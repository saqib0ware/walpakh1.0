# Walpakh Website — Frontend Build

Responsive multi-page frontend for **Walpakh Kashmir Tour Packages**, built from the supplied homepage, package comparison, Shop in Kashmir, signature experiences, car collection and membership design references.

## Current pages

- `index.html` — main travel homepage
- `packages.html` — Economy / Premium / Luxury package comparison page
- `shop.html` — Shop in Kashmir storefront page

## Shared files

- `styles.css` — shared design system and responsive page styles
- `script.js` — shared interactions, sliders, filtering, planner, wishlist and demo cart
- `assets/images/` — Walpakh logo and local design-reference imagery
- `assets/images/experiences/` — local experience-card imagery prepared from the supplied reference design

## Homepage features

- Responsive mobile navigation
- Packages / Hotels / Transport planner tabs
- Travel date validation
- Budget-based package highlighting
- Query-string package preselection from `packages.html`
- Destination carousel
- **Floating WhatsApp / Call / Email shortcuts that stay accessible while scrolling**
- **Car Collection after Top Destinations** with:
  - Sedan — 2–4 Pax
  - SUV — 4–6 Pax
  - Tempo Traveller — 7–12 Pax
  - Mini Coach — 13–25 Pax
  - Luxury Coach — 26+ Pax
- Transport cards automatically switch the planner into Transport mode
- **Walpakh Signature Experiences** section with ten premium Kashmir experiences
- **VIP Membership Club advertisement** before the footer
- Membership CTA with email-based interim enquiry flow
- Newsletter validation
- Back-to-top button
- Scroll reveal effects

## Packages page

- Three package-class comparison cards
- Economy, Premium and Luxury CTAs back to the homepage planner
- Inclusions, exclusions and add-on experience sections
- Responsive comparison layout

## Shop page

- Category filtering
- Product search
- Wishlist toggles and wishlist-only view
- Horizontal product carousel
- Front-end shopping cart drawer and quantity count
- Newsletter form
- Responsive mobile layout

## Important

The booking/search, checkout, authentication, payment, email automation, inventory and admin features are currently **front-end ready**, but not connected to a server or database yet. They should be connected after the remaining page designs are integrated so the data model and backend can be built once and used consistently across the website.

## Recommended backend stage

A later production phase can use:

- PHP 8+
- MySQL
- Reusable PHP includes for header/footer/configuration
- Admin authentication
- Packages/destinations/products/vehicles database
- Booking and enquiry management
- Membership accounts and rewards
- Product orders/cart/checkout
- Payment gateway integration
- Email/WhatsApp notifications
- Image upload and media management

## Run locally

Open `index.html` directly in a browser, or serve the folder with any local web server, for example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.
