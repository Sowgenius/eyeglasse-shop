---
sidebar_position: 1
slug: /
---

# Optician Pro Documentation

Welcome to **Optician Pro** - A complete management system for opticians with quotes, invoices, inventory, customers, and prescriptions.

## What is Optician Pro?

Optician Pro is a comprehensive business management platform designed specifically for opticians and eyewear retailers. It provides:

- 📊 **Dashboard** with real-time business insights
- 👥 **Customer Management** with full CRM capabilities
- 📦 **Inventory Management** with stock tracking and alerts
- 📝 **Quote System** for professional proposals
- 💳 **Invoicing** with payment tracking
- 👓 **Prescription Management** for eye measurements
- 📈 **Reporting** and analytics
- 🌍 **Multi-language** support (French/English)

## Quick Start

Get up and running in minutes:

```bash
# Clone the repository
git clone <repository-url>
cd eyeglasse-shop

# Setup database
createdb optician_db

# Install and start backend
cd server
npm install
npx prisma migrate dev
npm run dev

# Install and start frontend (in new terminal)
cd client
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## Features Overview

### Customer Management
- Complete customer profiles with insurance information
- Purchase history tracking
- Prescription history
- Advanced search and filtering

### Product & Inventory
- SKU-based product catalog
- Automatic stock tracking
- Reorder point alerts
- Stock movement history

### Quotes & Invoices
- Professional document generation
- Automatic numbering (QT-YYYY-XXXX / INV-YYYY-XXXX)
- Payment tracking with partial payments
- Email integration ready

### Prescriptions
- Store complete eye measurements
- Expiration tracking
- Lens recommendations
- History by customer

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, PostgreSQL, Prisma
- **Frontend**: Next.js 14, TypeScript, Redux Toolkit, Tailwind CSS
- **Testing**: Jest (backend), Vitest/Playwright (frontend)
- **Documentation**: Docusaurus

## Next Steps

- Read the [Installation Guide](./installation)
- Learn about [System Configuration](./configuration)
- Explore the [User Guide](./guide/dashboard)
- Check the [API Reference](./api/authentication)

## Support

Need help? Check our [GitHub Issues](https://github.com/your-org/optician-pro/issues) or contact support.
