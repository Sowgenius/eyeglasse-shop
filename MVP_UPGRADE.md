# Optician Pro - MVP Upgrade Complete

## Summary

This is a complete MVP upgrade of the eyeglasses shop management system with the following major changes:

### 1. Database Migration
- **From**: MongoDB + Mongoose
- **To**: PostgreSQL + Prisma ORM

### 2. Multi-Language Support
- French (default) and English
- i18n ready with next-i18next

### 3. New Features
- **Customer Management**: Full CRM with contact info, insurance details, purchase history
- **Quote System**: Create, send, and track quotes (QT-2025-XXXX format)
- **Invoice System**: Professional invoicing with payment tracking (INV-2025-XXXX format)
- **Prescription Management**: Store eye prescriptions with full optical measurements
- **Enhanced Stock Management**: SKU tracking, reorder points, stock movement history
- **Reporting Dashboard**: Sales reports, product performance, business analytics
- **Email Integration**: Resend API ready for sending quotes and invoices

## Backend Architecture

### Database Schema (PostgreSQL)

```
├── users              (Authentication & roles)
├── customers          (Client management)
├── products           (Inventory with SKU & stock tracking)
├── stock_movements    (Audit trail for stock changes)
├── quotes             (Quote documents)
├── quote_items        (Quote line items)
├── invoices           (Invoice documents)
├── invoice_items      (Invoice line items)
├── payments           (Payment tracking)
├── prescriptions      (Eye prescriptions)
└── eye_exams          (Eye exam records)
```

### API Endpoints

#### Auth
- POST `/login` - User login
- POST `/logout` - User logout
- GET `/profile` - Get user profile
- DELETE `/profile/delete` - Delete account

#### Customers
- GET `/customers` - List customers (with pagination & search)
- POST `/customers` - Create customer
- GET `/customers/:id` - Get customer details
- PATCH `/customers/:id` - Update customer
- DELETE `/customers/:id` - Delete customer

#### Products
- GET `/products` - List products (with filters)
- POST `/products` - Create product
- GET `/products/:id` - Get product details
- PATCH `/products/:id` - Update product
- DELETE `/products/:id` - Delete product
- DELETE `/products/bulk-delete` - Bulk delete
- GET `/products/low-stock` - Low stock alert

#### Quotes
- GET `/quotes` - List quotes (with pagination & filters)
- POST `/quotes` - Create quote
- GET `/quotes/:id` - Get quote details
- PATCH `/quotes/:id` - Update quote
- DELETE `/quotes/:id` - Delete quote
- POST `/quotes/:id/send` - Send quote to customer

#### Invoices
- GET `/invoices` - List invoices (with pagination & filters)
- POST `/invoices` - Create invoice
- GET `/invoices/:id` - Get invoice details
- PATCH `/invoices/:id` - Update invoice
- DELETE `/invoices/:id` - Cancel invoice
- POST `/invoices/:id/payments` - Add payment
- GET `/invoices/overdue` - Get overdue invoices

#### Prescriptions
- GET `/prescriptions` - List prescriptions
- POST `/prescriptions` - Create prescription
- GET `/prescriptions/:id` - Get prescription details
- PATCH `/prescriptions/:id` - Update prescription
- DELETE `/prescriptions/:id` - Delete prescription

#### Reports
- GET `/reports/dashboard` - Dashboard statistics
- GET `/reports/sales` - Sales report
- GET `/reports/products` - Product performance

## Setup Instructions

### 1. Database Setup

```bash
# Install PostgreSQL locally or use a cloud provider
# Create database
createdb optician_db

# Update server/.env
DATABASE_URL="postgresql://username:password@localhost:5432/optician_db?schema=public"
```

### 2. Backend Setup

```bash
cd server
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to manage data
npx prisma studio

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install

# Start development server
npm run dev
```

### 4. Environment Variables

**Server (.env)**:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/optician_db?schema=public"
JWT_SECRET="your-secret-key-here"
RESEND_API_KEY="your-resend-api-key"  # Optional - for email
CLIENT_URL="http://localhost:3000"
NODE_ENV=development
PORT=8080
```

**Client (.env.local)**:
```env
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
```

## Key Features

### Multi-Language
- Default language: French
- Secondary language: English
- Easy to add more languages in `client/public/locales/`

### Role-Based Access
- **USER**: Can only manage their own products, customers, quotes, invoices
- **MANAGER**: Can manage all data across the system

### Stock Management
- Automatic stock deduction when creating invoices
- Stock restoration when cancelling invoices
- Low stock alerts
- Stock movement history for audit trail

### Invoice & Quote Numbering
- Quotes: `QT-2025-0001`, `QT-2025-0002`, etc.
- Invoices: `INV-2025-0001`, `INV-2025-0002`, etc.
- Auto-incrementing sequence per year

### Payment Tracking
- Multiple payment methods supported
- Partial payment support
- Overdue invoice tracking
- Payment history per invoice

### Prescription Management
- Store full optical prescriptions
- Track prescription expiration
- Link prescriptions to customers

## Frontend API Hooks

All new API endpoints are ready to use with React hooks:

```typescript
// Customers
const { data: customers } = useGetCustomersQuery({ page: 1, search: 'John' });
const [createCustomer] = useCreateCustomerMutation();

// Quotes
const { data: quotes } = useGetQuotesQuery({ status: 'PENDING' });
const [createQuote] = useCreateQuoteMutation();

// Invoices
const { data: invoices } = useGetInvoicesQuery();
const [createInvoice] = useCreateInvoiceMutation();
const [addPayment] = useAddPaymentMutation();

// Prescriptions
const { data: prescriptions } = useGetPrescriptionsQuery();
const [createPrescription] = useCreatePrescriptionMutation();

// Reports
const { data: stats } = useGetDashboardStatsQuery();
```

## Next Steps (UI Components)

The backend is complete. To finish the MVP, you need to create:

1. **Customer Management Pages**
   - Customer list with search
   - Customer detail view
   - Customer form (create/edit)

2. **Quote Management**
   - Quote list
   - Quote creation form
   - Quote detail with PDF generation
   - Send quote functionality

3. **Invoice Management**
   - Invoice list with status filters
   - Invoice creation form
   - Invoice detail with payment tracking
   - Add payment modal
   - Overdue invoices view

4. **Prescription Management**
   - Prescription list
   - Prescription form with eye measurement fields
   - Prescription detail view

5. **Enhanced Dashboard**
   - Stats cards (revenue, customers, etc.)
   - Low stock alerts widget
   - Overdue invoices widget
   - Quick action buttons

6. **Updated Navigation**
   - Sidebar/menu with new routes
   - Language switcher

## Database Migrations

To make changes to the database schema:

```bash
cd server

# Edit prisma/schema.prisma

# Generate migration
npx prisma migrate dev --name your_change_name

# Update Prisma client
npx prisma generate
```

## Email Setup (Optional)

To enable email sending:

1. Create account at https://resend.com
2. Get API key
3. Add to server/.env: `RESEND_API_KEY=your_key`
4. Verify your domain in Resend dashboard

Emails will be sent for:
- Quote confirmations
- Invoice reminders
- Payment receipts

## Testing

Run the development servers:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Access the app at http://localhost:3000 (French by default)
Switch to English by visiting http://localhost:3000/en

## Production Deployment

### Backend
- Set `NODE_ENV=production`
- Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- Set up Resend for production emails
- Deploy to Vercel, Railway, or similar

### Frontend
- Set `NEXT_PUBLIC_API_URL` to production backend
- Deploy to Vercel (optimal for Next.js)

## Support

For issues or questions:
1. Check Prisma documentation: https://prisma.io/docs
2. Check Next.js i18n: https://nextjs.org/docs/advanced-features/i18n-routing
3. Check Resend docs: https://resend.com/docs
