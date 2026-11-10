import { permanentRedirect } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

export default function SocialsPage() {
  permanentRedirect(siteConfig.socials.linktree);
}
