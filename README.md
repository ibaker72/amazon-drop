# NJ Drop — Local Wholesale E-Commerce Platform

A full-stack e-commerce platform built for a North Jersey-based local-drop business. Products are sourced from Paterson/Clifton area wholesalers, hand-inspected, and shipped within 24 hours.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: Supabase (Postgres + Storage + RLS)
- **Payments**: Stripe Checkout + Webhooks
- **Cart**: Zustand (persisted to localStorage)
- **Styling**: Tailwind CSS v4 + custom UI components
- **AI**: Claude API (Haiku) — AI-generated product descriptions

## Features

### Customer Storefront (`/`)
- Homepage with hero, category grid, featured products, trust section
- Product catalog with sidebar filtering (category, sort) and search
- Product detail pages with image gallery, stock status, add-to-cart
- Persistent cart with slide-over drawer
- Stripe-hosted checkout with free shipping threshold
- Order confirmation page

### Admin Dashboard (`/admin`)
- **Dashboard**: Revenue, orders, pending fulfillment, low stock alerts, quick actions
- **Products**: Full CRUD with image upload to Supabase Storage, real-time margin calculator, AI description generator (Claude)
- **Orders**: Order list + detail view, fulfillment status tracking (paid → picking → shipped → delivered), tracking number logging, per-order profit display
- **Inventory & P&L**: Full profit/loss breakdown per product — revenue, COGS, gross margin %, inventory value
- **Suppliers**: Manage local NJ wholesaler contacts (name, phone, address, notes)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
```bash
cp .env.local.example .env.local
# Fill in Supabase, Stripe, and Anthropic keys
```

### 3. Database
Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor. This creates all tables, indexes, RLS policies, and seeds the default categories.

### 4. Storage
Create a public bucket named `product-images` in Supabase Storage.

### 5. Dev server
```bash
npm run dev
```

### 6. Stripe webhooks (local)
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_BASE_URL` | App base URL (e.g. `https://njdrop.com`) |
| `ANTHROPIC_API_KEY` | Claude API key for AI descriptions |

## Business Model

This platform supports the **Local-Drop** model:
1. Source products from Paterson/Clifton/Secaucus NJ wholesalers
2. List on this storefront — set cost + sell price, track margin live in admin
3. When order comes in → pick up from supplier → drop at UPS/USPS hub
4. 2-day delivery beats any overseas dropshipper

**Phase 2**: Offer this as a **B2B Wholesale Portal** to local NJ wholesalers — they use it as their own digital ordering system, you take a % of digital sales processed.
