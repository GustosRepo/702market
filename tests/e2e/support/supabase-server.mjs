import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { tables } from "./data.mjs";

// Only the service boundary is simulated. Next.js rendering, validation, server
// actions, multipart uploads, and Supabase client serialization run normally.
const writes = { contact_submissions: [], applications: [], application_images: [], uploads: [] };
const failures = [];
const siteAssetFiles = new Map();
const adminUser = {
  id: "00000000-0000-4000-8000-000000000099",
  aud: "authenticated",
  role: "authenticated",
  email: "admin@example.test",
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
};
const adminToken = [
  Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url"),
  Buffer.from(JSON.stringify({ sub: adminUser.id, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url"),
  "e2e-fixture-signature",
].join(".");

function reply(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

function matches(row, filters) {
  return Object.entries(filters).every(([key, value]) => row[key] === value);
}

function shouldFail(operation, row) {
  const index = failures.findIndex((failure) => failure.operation === operation && matches(row, failure.match));
  if (index === -1) return false;
  failures.splice(index, 1);
  return true;
}

function filterRows(rows, params) {
  return rows.filter((row) => [...params].every(([key, value]) => {
    if (value.startsWith("eq.")) return String(row[key]) === value.slice(3);
    if (value === "is.null") return row[key] == null;
    return true;
  }));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://127.0.0.1:54329");
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const bytes = Buffer.concat(chunks);
    const body = bytes.length && request.headers["content-type"]?.includes("application/json")
      ? JSON.parse(bytes.toString())
      : null;

    if (url.pathname === "/__test/health") return reply(response, 200, { ready: true });
    if (url.pathname === "/__test/state" && request.method === "GET") return reply(response, 200, writes);
    if (url.pathname === "/__test/fail-next" && request.method === "POST") {
      failures.push(body);
      return reply(response, 200, { ok: true });
    }

    if (url.pathname === "/auth/v1/token" && request.method === "POST") {
      if (body.email === adminUser.email && body.password === "e2e-valid-admin-password") {
        return reply(response, 200, {
          access_token: adminToken, token_type: "bearer", expires_in: 3600,
          refresh_token: "e2e-refresh-token", user: adminUser,
        });
      }
      return reply(response, 400, { error_code: "invalid_credentials", msg: "Invalid login credentials" });
    }
    if (url.pathname === "/auth/v1/user" && request.method === "GET") {
      return request.headers.authorization === `Bearer ${adminToken}`
        ? reply(response, 200, adminUser)
        : reply(response, 401, { message: "Invalid test token" });
    }

    const storagePrefix = "/storage/v1/object/application-images/";
    if (url.pathname.startsWith(storagePrefix) && request.method === "POST") {
      const path = decodeURIComponent(url.pathname.slice(storagePrefix.length));
      const application = writes.applications.find((row) => row.id === path.split("/")[0]);
      if (shouldFail("upload", { ...application, documentType: path.split("/")[1] })) {
        return reply(response, 500, { statusCode: "500", error: "StorageError", message: "Test upload failure" });
      }
      writes.uploads.push({ path, size: bytes.length, email: application?.email });
      return reply(response, 200, { Key: `application-images/${path}` });
    }
    if (url.pathname === "/storage/v1/object/application-images" && request.method === "DELETE") {
      writes.uploads = writes.uploads.filter((upload) => !body.prefixes.includes(upload.path));
      return reply(response, 200, []);
    }
    const siteAssetPrefix = "/storage/v1/object/site-assets/";
    if (url.pathname.startsWith(siteAssetPrefix) && request.method === "POST") {
      const path = decodeURIComponent(url.pathname.slice(siteAssetPrefix.length));
      const contentType = request.headers["content-type"] || "image/png";
      if (contentType.includes("multipart/form-data")) {
        const form = await new Response(bytes, { headers: { "Content-Type": contentType } }).formData();
        const file = [...form.values()].find((value) => value instanceof File);
        siteAssetFiles.set(path, { bytes: Buffer.from(await file.arrayBuffer()), type: file.type });
      } else {
        siteAssetFiles.set(path, { bytes, type: contentType });
      }
      writes.uploads.push({ path, size: bytes.length, bucket: "site-assets" });
      return reply(response, 200, { Key: `site-assets/${path}` });
    }
    const publicSiteAssetPrefix = "/storage/v1/object/public/site-assets/";
    if (url.pathname.startsWith(publicSiteAssetPrefix) && request.method === "GET") {
      const file = siteAssetFiles.get(decodeURIComponent(url.pathname.slice(publicSiteAssetPrefix.length)));
      if (!file) return reply(response, 404, { message: "Photo not found" });
      response.writeHead(200, { "Content-Type": file.type || "image/png" });
      response.end(file.bytes);
      return;
    }

    const table = url.pathname.match(/^\/rest\/v1\/([a-z_]+)$/)?.[1];
    if (table && request.method === "GET" && (table in tables || table in writes)) {
      const rows = filterRows(tables[table] || writes[table], url.searchParams);
      if (table === "site_media") {
        rows.sort((a, b) => a.sort_order - b.sort_order || a.slot.localeCompare(b.slot));
      }
      const single = request.headers.accept?.includes("application/vnd.pgrst.object+json");
      return reply(response, 200, single ? rows[0] || null : rows);
    }
    if (["events", "event_vendor_options"].includes(table) && request.method === "PATCH") {
      const rows = filterRows(tables[table], url.searchParams);
      for (const row of rows) Object.assign(row, body);
      const single = request.headers.accept?.includes("application/vnd.pgrst.object+json");
      return reply(response, 200, single ? rows[0] || null : rows);
    }
    if (["site_content", "site_media"].includes(table) && request.method === "POST") {
      const rows = Array.isArray(body) ? body : [body];
      const key = table === "site_media" ? "slot" : "key";
      for (const row of rows) {
        const index = tables[table].findIndex((item) => item[key] === row[key]);
        if (index === -1) tables[table].push(row);
        else tables[table][index] = { ...tables[table][index], ...row };
      }
      return reply(response, 201, rows);
    }
    if (table && request.method === "POST" && ["contact_submissions", "applications", "application_images"].includes(table)) {
      if (shouldFail(table, body)) {
        return reply(response, 503, { message: "Test database failure", code: "TEST_FAILURE" });
      }
      const rows = (Array.isArray(body) ? body : [body]).map((row) => ({
        created_at: new Date().toISOString(), ...row, id: randomUUID(),
      }));
      writes[table].push(...rows);
      const single = request.headers.accept?.includes("application/vnd.pgrst.object+json");
      return reply(response, 201, single ? rows[0] : rows);
    }
    if (table === "applications" && request.method === "DELETE") {
      const removed = filterRows(writes.applications, url.searchParams);
      writes.applications = writes.applications.filter((row) => !removed.includes(row));
      return reply(response, 200, removed);
    }

    console.error(`Unhandled fixture request: ${request.method} ${url.pathname}`);
    return reply(response, 501, { message: "Unhandled E2E fixture request" });
  } catch (error) {
    console.error(error);
    return reply(response, 500, { message: "E2E fixture error" });
  }
});

server.listen(54329, "127.0.0.1");
