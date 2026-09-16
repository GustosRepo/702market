# 702Market Website & Vendor Application Management System

## Project Overview

Build a modern, mobile-first website and lightweight management system
for **702Market**.

The public website should take visual inspiration from **1042 Flea**:
large typography, strong photography, event-focused calls to action,
playful movement, and a creative market aesthetic. The goal is
inspiration rather than copying the reference site's exact layout,
assets, or branding.

The system should allow 702Market staff to:

-   Publish and manage upcoming markets/events.
-   Accept vendor applications for specific events.
-   Review and organize applications from a private admin portal.
-   Track application status per event.
-   Track application fees/revenue collected per event.
-   Send transactional emails to applicants.
-   Manage a simple public merchandise catalog.
-   Link merchandise products to external checkout/product URLs.
-   Export vendor/application information when needed.

Vendors do **not** need accounts or profiles in V1. They submit an
application and receive email updates.

------------------------------------------------------------------------

# 1. Recommended Stack

## Frontend

-   Next.js using App Router
-   TypeScript
-   Tailwind CSS
-   Motion for animations/transitions

## Backend

-   Supabase
    -   PostgreSQL database
    -   Supabase Auth for **admin users only**
    -   Supabase Storage for vendor/product/event images
-   Supabase JS SDK

## Email

-   Resend
-   React Email templates

## Hosting

-   Vercel

## Architecture Principle

Keep the system intentionally small.

This is **not** intended to replace Jotform, Shopify, Eventbrite, or a
full CRM in V1.

The core workflow is:

**Promote Events → Accept Applications → Track Fees → Review Vendors →
Approve/Waitlist/Decline → Communicate → Run Event**

------------------------------------------------------------------------

# 2. Public Website

## Main Routes

``` text
/
├── /events
├── /events/[slug]
├── /apply
├── /apply/[eventSlug]
├── /merch
├── /about
├── /faq
└── /contact
```

## Homepage

Suggested sections:

1.  Hero
2.  Next Market
3.  Upcoming Events
4.  About 702Market
5.  Market Gallery
6.  Become a Vendor
7.  Merch Preview
8.  FAQ
9.  Instagram / Social Links
10. Footer

### Primary CTAs

-   View Next Market
-   Apply to Sell
-   Shop Merch

------------------------------------------------------------------------

# 3. Event System

Events should be database-driven instead of hard-coded.

Example:

``` text
702Market Night Market
October 24, 2026
4:00 PM – 10:00 PM
Downtown Las Vegas
Applications Close: October 10, 2026
```

Creating the event in Admin automatically makes it available to the
public website.

Example generated routes:

``` text
/events/october-night-market
/apply/october-night-market
```

## Event Fields

-   Event name
-   Slug
-   Description
-   Event date
-   Start time
-   End time
-   Venue/location name
-   Address
-   Hero image
-   Application opening date
-   Application deadline
-   Application fee
-   Applications enabled/disabled
-   Optional vendor capacity
-   Published/draft status
-   Upcoming/completed/cancelled status

Past events can automatically move into a Past Events section.

------------------------------------------------------------------------

# 4. Vendor Application System

Each application belongs to a specific event.

No vendor account is required.

## Suggested Application Fields

### Contact

-   First name
-   Last name
-   Email
-   Phone

### Business

-   Business/vendor name
-   Instagram
-   Website (optional)

### Products

-   Vendor category
-   Product description
-   Typical price range
-   1--5 product images

Suggested categories:

-   Vintage
-   Clothing
-   Jewelry
-   Art
-   Food
-   Collectibles
-   Handmade
-   Beauty
-   Accessories
-   Other

### Event Requirements

-   Booth type
-   Electricity needed: Yes / No
-   Special requests
-   Agreement to vendor rules

### Application

-   Event
-   Submission date
-   Application status
-   Payment status
-   Application fee amount
-   Internal admin notes

------------------------------------------------------------------------

# 5. Application Workflow

``` text
Vendor selects event
        ↓
Completes application
        ↓
Application submitted
        ↓
Application fee/payment recorded
        ↓
Confirmation email sent
        ↓
702Market receives notification
        ↓
Application appears in Admin
        ↓
Staff reviews application
        ↓
Approved / Waitlisted / Declined
        ↓
Applicant receives status email
```

If the application fee is collected using an external payment link in
V1, the system can still store the amount and payment status.

A future version can integrate payment processing directly.

------------------------------------------------------------------------

# 6. Admin Portal

Private route:

``` text
/admin
```

Only authorized 702Market staff can access it.

Supabase Auth should protect all admin routes.

## Main Admin Navigation

``` text
Dashboard
Events
Applications
Merch
Reports / Exports
Settings
```

------------------------------------------------------------------------

# 7. Admin Dashboard

The dashboard should answer the most important business questions
immediately.

Example:

``` text
702MARKET ADMIN

NEXT EVENT
October Night Market
October 24, 2026

Applications                84
Pending                     31
Approved                    42
Waitlisted                   7
Declined                     4

Application Revenue     $4,200
Paid Applications            84
Average Fee              $50.00
```

## Financial Overview

Include cards for:

-   Application revenue this event
-   Application revenue this month
-   Application revenue all time
-   Number of paid applications
-   Number of unpaid applications
-   Average application fee

Example:

``` text
APPLICATION REVENUE

October Market       $4,200
September Market     $3,750
August Market        $3,100
--------------------------------
Total               $11,050
```

This should be calculated from actual application/payment records rather
than manually entered totals.

### Revenue Formula

``` text
Application Revenue =
SUM(application fee amounts for successfully paid applications)
```

The dashboard should **not** count unpaid, failed, refunded, or waived
fees as collected revenue.

If refunds are introduced later, revenue reporting should support:

``` text
Gross Collected
Refunds
Net Collected
```

------------------------------------------------------------------------

# 8. Event-Specific Application Management

Route concept:

``` text
/admin/events/[eventId]/applications
```

Example:

``` text
October Night Market

84 Applications
$4,200 Collected

[ All ]
[ Pending ]
[ Approved ]
[ Waitlisted ]
[ Declined ]

Search Vendor...

Category: [ All ]
Payment: [ All / Paid / Unpaid ]
Sort: [ Newest ]
```

## Application Table

``` text
Vendor          Category      Payment    Status       Submitted
----------------------------------------------------------------
Liah Vintage    Clothing      Paid       Pending      Oct 3
Desert Goods    Handmade      Paid       Approved     Oct 3
Retro LV        Vintage       Unpaid     Pending      Oct 2
```

Clicking an application opens the full application.

------------------------------------------------------------------------

# 9. Application Detail

Example:

``` text
LIAH VINTAGE

CONTACT
Name
Email
Phone

BUSINESS
Business Name
Instagram
Website

PRODUCTS
Category
Description
Price Range

PRODUCT PHOTOS
[Image] [Image] [Image]

EVENT
October Night Market
Application Fee: $50
Payment: Paid

SPECIAL REQUESTS
Needs access to electricity.

ADMIN STATUS
Pending
Approved
Waitlisted
Declined

ADMIN NOTES
[ Internal notes ]

[ Save Changes ]
```

------------------------------------------------------------------------

# 10. Application Statuses

Use a small, clear workflow:

``` text
Pending
Approved
Waitlisted
Declined
```

Optional future statuses:

``` text
Needs Review
Confirmed
Cancelled
Checked In
No Show
```

Do not add these until the business actually needs them.

------------------------------------------------------------------------

# 11. Email Automation

Use transactional emails for the basic workflow.

## Application Received

Send immediately after successful submission.

Include:

-   Vendor name
-   Event
-   Application date
-   Application status
-   Fee/payment confirmation if applicable

## Admin Notification

Notify 702Market when a new application arrives.

## Approved

Send when staff changes status to Approved.

## Waitlisted

Send when staff changes status to Waitlisted.

## Declined

Send when staff changes status to Declined.

## Future Option

Add scheduled reminders before events for approved vendors.

------------------------------------------------------------------------

# 12. Simple Merch Catalog

702Market does **not** need full ecommerce management in V1.

The goal is simply to let staff control which merchandise appears on the
website while sending customers to an external product/checkout URL.

Public route:

``` text
/merch
```

Example:

``` text
702MARKET MERCH

[ Shirt Image ]
702Market Logo Tee
$30
[ SHOP NOW ]

[ Hat Image ]
702Market Hat
$25
[ SHOP NOW ]
```

`SHOP NOW` redirects to whatever external URL the client provides.

This could be:

-   Existing online store
-   Product checkout link
-   External marketplace listing
-   Payment/product page

No cart, inventory engine, order management, shipping management, or
native checkout is required in V1.

------------------------------------------------------------------------

# 13. Merch Admin

Route:

``` text
/admin/merch
```

Staff should be able to:

-   Add product
-   Edit product
-   Delete/archive product
-   Upload product image
-   Set product name
-   Set description
-   Set displayed price
-   Set external purchase URL
-   Mark product active/inactive
-   Mark product featured
-   Change display order

Example:

``` text
MERCH

702Market Logo Tee
$30
Active
[ Edit ]

702Market Hat
$25
Active
[ Edit ]

[ + ADD PRODUCT ]
```

## Add/Edit Product

``` text
Product Name
Description
Displayed Price
Product Image
External Purchase URL

[ ] Featured
[ ] Active

Display Order

[ Save Product ]
```

This gives the client control of their merch page without requiring you
to edit code whenever they add or remove an item.

------------------------------------------------------------------------

# 14. Merch Upgrade Path

The database should be designed so a real store can be added later
without rebuilding the public merch section.

Future V2 ecommerce could add:

-   Stripe
-   Native checkout
-   Shopping cart
-   Inventory
-   Product variants
-   Sizes
-   Colors
-   Discount codes
-   Orders
-   Shipping
-   Order status
-   Sales reporting

For V1, these features are intentionally excluded.

------------------------------------------------------------------------

# 15. CSV Export

Admins should be able to export applications for an individual event.

Example:

``` text
Admin → Events → October Market → Export CSV
```

Suggested columns:

``` text
Vendor Name
Contact Name
Email
Phone
Category
Instagram
Website
Application Status
Payment Status
Application Fee
Submitted Date
Admin Notes
```

This allows 702Market to open the information in Excel or Google Sheets
and share it with event staff.

------------------------------------------------------------------------

# 16. Database Design

## `events`

``` sql
id
title
slug
description
event_date
start_time
end_time
location_name
address
hero_image
application_open_date
application_deadline
application_fee
applications_enabled
vendor_capacity
status
published
created_at
updated_at
```

## `applications`

``` sql
id
event_id

first_name
last_name
email
phone

business_name
instagram
website

category
product_description
price_range

booth_type
electricity_required
special_requests

status
admin_notes

application_fee
payment_status
payment_reference
paid_at

created_at
updated_at
```

## `application_images`

``` sql
id
application_id
storage_path
sort_order
created_at
```

## `merch_products`

``` sql
id
name
slug
description
display_price
image_path
external_url
featured
active
sort_order
created_at
updated_at
```

Admin identities can initially be handled through Supabase Auth without
building a customer-facing profile system.

------------------------------------------------------------------------

# 17. Payment / Revenue Data Model

Even if payment processing is external in V1, keep payment information
structured.

Suggested statuses:

``` text
unpaid
paid
waived
refunded
```

Store:

``` text
application_fee
payment_status
payment_reference
paid_at
```

Revenue queries should only count:

``` text
payment_status = 'paid'
```

This lets the dashboard calculate:

-   Revenue by event
-   Revenue by month
-   Revenue all time
-   Paid application count
-   Unpaid application count
-   Average application fee

------------------------------------------------------------------------

# 18. Security

-   Admin routes require authentication.
-   Vendors never receive database/admin access.
-   Public application submissions should be validated server-side.
-   Use Supabase Row Level Security.
-   Restrict Supabase Storage uploads by file type and size.
-   Admin database mutations should happen through protected server
    actions/route handlers.
-   Validate external merch URLs.
-   Rate-limit or otherwise protect public forms from spam/abuse.
-   Never expose service-role credentials to the browser.

------------------------------------------------------------------------

# 19. V1 Deliverables

## Public Website

-   Responsive custom website
-   Mobile-first design
-   702Market branding
-   Motion animations
-   Homepage
-   Events page
-   Event detail pages
-   About
-   FAQ
-   Contact
-   Vendor application
-   Merch catalog
-   SEO fundamentals

## Event Management

-   Create events
-   Edit events
-   Publish/unpublish
-   Event images
-   Application opening/closing
-   Application fee configuration
-   Upcoming/past event handling

## Application Management

-   Event-specific applications
-   Admin dashboard
-   Search
-   Filters
-   Vendor details
-   Product images
-   Pending status
-   Approved status
-   Waitlist status
-   Declined status
-   Payment status
-   Internal notes
-   CSV export

## Revenue Dashboard

-   Application revenue by event
-   Application revenue by month
-   All-time application revenue
-   Paid application count
-   Unpaid application count
-   Average application fee

## Merch Management

-   Add merchandise
-   Edit merchandise
-   Remove/archive merchandise
-   Product images
-   Display price
-   External purchase link
-   Featured products
-   Active/inactive status
-   Display ordering

## Email Automation

-   Application confirmation
-   Admin application notification
-   Approval email
-   Waitlist email
-   Decline email

## Admin

-   Secure admin login
-   Dashboard
-   Event manager
-   Application manager
-   Merch manager
-   Revenue overview

------------------------------------------------------------------------

# 20. Explicitly Out of Scope for V1

To keep the initial build focused and maintainable, V1 does **not**
include:

-   Vendor user accounts
-   Vendor dashboards
-   Full CRM
-   Native ecommerce checkout
-   Shopping cart
-   Inventory management
-   Shipping management
-   Native order management
-   Complex Jotform-style form builder
-   Booth map designer
-   QR event check-in
-   Automated booth assignments
-   Full accounting system

These can become future paid upgrades instead of inflating the initial
project.

------------------------------------------------------------------------

# 21. Future V2 Opportunities

Potential future modules:

### Vendor Accounts

Returning vendors can save business information and apply faster.

### Native Application Payments

Integrate Stripe and automatically verify application payments.

### Booth Payments

Approved vendors can pay booth fees directly.

### Vendor Database

Track vendor history across every 702Market event.

### Booth Assignment

Assign booth numbers/tables to approved vendors.

### Event Check-In

QR code or searchable check-in list.

### Full Ecommerce

Replace external merch links with native products, checkout, inventory,
orders, and sales reporting.

### Analytics

Track:

-   Application conversion
-   Revenue per event
-   Vendor return rate
-   Category distribution
-   Approval rate
-   Event growth
-   Merch engagement

------------------------------------------------------------------------

# 22. Product Philosophy

The first version should solve the actual operational problem without
creating unnecessary software overhead.

The system should make these tasks easy:

1.  702Market creates an event.
2.  The event automatically appears on the website.
3.  Vendors apply to that specific event.
4.  Application/payment information is recorded.
5.  Staff can see how many applications arrived and how much application
    revenue was collected.
6.  Staff reviews applications from one dashboard.
7.  Vendors receive status emails.
8.  Staff can export the event vendor list.
9.  Staff can add or remove merch from the website without touching
    code.
10. Merch purchases continue through external links until 702Market is
    ready for a full ecommerce integration.

This creates a strong V1 while leaving clear room for future paid
upgrades.
