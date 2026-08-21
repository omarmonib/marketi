# Marketi — Full-Stack E-Commerce Platform

A full-featured e-commerce platform built with Next.js 15, TypeScript, PostgreSQL, and Stripe. Includes a complete storefront, admin dashboard, and payment processing.

**Live Demo:** [marketi-lyart.vercel.app](https://marketi-lyart.vercel.app)

---

## Screenshots

> Home page, product listing, cart, and admin dashboard


---

## Tech Stack

### Frontend
- **Next.js 15** — App Router, Server Components, Server Actions
- **TypeScript** — end-to-end type safety
- **Tailwind CSS v4** — utility-first styling
- **next-intl** — i18n with English/Arabic (RTL) support
- **Zustand** — client-side cart state
- **react-hook-form + Zod** — form validation

### Backend
- **Next.js API Routes** — REST endpoints
- **Prisma ORM** — database access layer
- **PostgreSQL** — relational database (hosted on Neon)
- **NextAuth v5** — authentication (Google OAuth + credentials)
- **Stripe** — payment processing and webhooks
- **Nodemailer** — transactional email (SMTP)

### Architecture
- Provider-independent storage abstraction (local dev / Vercel Blob in production)
- In-memory rate limiting on auth endpoints
- Role-based access control (USER / ADMIN)
- Clean separation of server actions vs API routes

---

## Features

### Storefront
- Product catalog with filtering, sorting, and pagination
- Category browsing
- Product detail pages with reviews and ratings
- Related products section
- Search functionality
- Wishlist (save products for later)
- Shopping cart with quantity management
- Coupon / discount code support
- Stripe checkout with order confirmation
- Order history

### Admin Dashboard
- Analytics — revenue chart, order status breakdown, top products
- Product management (create, edit, delete, image upload)
- Order management with status updates
- User management
- Category management
- Coupon management

### Other
- Google OAuth + email/password authentication
- Arabic / English with automatic RTL layout
- Mobile responsive with hamburger menu
- SEO metadata + XML sitemap + robots.txt
- Order confirmation emails
- Error boundaries on all segments
- Rate limiting on login/register

---

## Database Schema

12 Prisma models:

```
User · Account · Session          — Authentication
Product · Category · Tag          — Catalog
Cart · CartItem                   — Shopping
Order · OrderItem · Address       — Checkout
Review · Wishlist · Coupon        — Engagement
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL (local or [Neon](https://neon.tech) free tier)
- pnpm

### 1. Clone the repository

```bash
git clone https://github.com/omarmonib/marketi.git
cd marketi
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in the required values:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/marketi"

# Auth
AUTH_SECRET="generate with: openssl rand -base64 32"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Email (optional — logs to console if not set)
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="orders@marketi.com"

# Storage (optional — uses local /public/uploads if not set)
BLOB_READ_WRITE_TOKEN=""
```

### 3. Set up the database

```bash
# Run migrations
npx prisma migrate deploy

# Seed with sample data
npx prisma db seed
```

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create an admin user

Register an account, then update your user role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Then access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Project Structure

```
src/
├── app/
│   ├── (store)/          # Customer-facing pages
│   ├── (admin)/          # Admin dashboard
│   ├── (auth)/           # Login / Register
│   └── api/              # API routes (checkout, webhook, upload)
├── actions/              # Server actions (products, orders, auth...)
├── components/
│   ├── admin/            # Admin UI components
│   ├── store/            # Store UI components
│   └── shared/           # Shared components (navbar, pagination...)
├── emails/               # React Email templates
├── i18n/                 # Internationalization config
├── lib/                  # Utilities (db, auth, storage, email, stripe)
├── store/                # Zustand client state
└── validators/           # Zod schemas
prisma/
├── schema.prisma         # Database schema
├── migrations/           # Migration history
└── seed.ts               # Sample data
```

---

## Deployment

The project is deployed on **Vercel** with **Neon PostgreSQL**.

### Deploy your own

1. Fork this repository
2. Create a project on [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

### Stripe webhooks

After deploying, add a webhook endpoint in your Stripe dashboard:
- URL: `https://your-domain.vercel.app/api/webhook`
- Event: `checkout.session.completed`

Update `STRIPE_WEBHOOK_SECRET` with the signing secret.

---

## Architecture Decisions

**Why Next.js API routes instead of a separate backend?**
For a project of this scale, co-locating frontend and backend in one Next.js app reduces complexity and deployment overhead without sacrificing capability.

**Why a storage abstraction?**
`src/lib/storage.ts` decouples business logic from the storage provider. Swap local storage for Vercel Blob, S3, or any other provider by changing one file.

**Why in-memory rate limiting?**
Avoids a Redis dependency for a demo project. The interface matches `@upstash/ratelimit` so it can be swapped in minutes if needed.

---

## License

MIT