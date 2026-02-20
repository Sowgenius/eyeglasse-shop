# Changelog

All notable changes to **Z-0 Optician Pro** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-XX-XX

### Added
- **Authentication System**
  - JWT-based authentication
  - User registration with admin approval workflow
  - User roles: User, Manager
  - User statuses: Pending, Active, Rejected, Suspended
  - Admin approval/rejection functionality

- **Internationalization (i18n)**
  - French (default) and English language support
  - Language switcher component
  - Complete translations for all UI elements
  - next-i18next integration

- **UI/UX Improvements**
  - New modern design with Manrope + DM Sans fonts
  - shadcn/ui upgraded to New York style with CSS variables
  - Neutral color palette
  - Custom branding (Z-0)

### Changed
- **Framework Updates**
  - Next.js 16 (middleware → proxy.ts)
  - Updated all shadcn components to latest version
  - Migrated from slate to neutral color base

### Fixed
- SVG prop issues in custom icons (stroke-width → strokeWidth)
- React state errors in login/register forms
- Demo functionality removed

---

## [0.9.0] - 2024-12-XX

### Added
- **Admin Dashboard**
  - User management panel
  - Pending approval queue
  - Role management (User/Manager)
  - Status management (Activate/Suspend)

- **User Management**
  - One-line user creation script
  - Profile deletion with password confirmation
  - Transaction history modal
  - Sales history chart

### Changed
- Default locale changed to French ('fr')
- Improved form validation

---

## [0.8.0] - 2024-11-XX

### Added
- **Products Management**
  - Full CRUD operations
  - Stock tracking with reorder points
  - Duplicate product functionality
  - Bulk delete
  - Image upload support

- **Data Table**
  - Advanced filtering
  - Column sorting
  - Pagination
  - View options (show/hide columns)

### Changed
- Table redesign with better UX
- Improved search functionality

---

## [0.7.0] - 2024-10-XX

### Added
- **Quotes System**
  - Quote creation
  - Automatic numbering (QT-YYYY-XXXX)
  - Send quote functionality
  - Convert to invoice

- **Invoices System**
  - Full invoice lifecycle
  - Partial payments support
  - Payment tracking
  - Automatic numbering (INV-YYYY-XXXX)
  - Overdue alerts
  - Download invoice PDF

---

## [0.6.0] - 2024-09-XX

### Added
- **Prescriptions Management**
  - Optical prescription storage
  - Detailed measurements (SPH, CYL, AXIS, ADD, PD)
  - Expiry alerts
  - Link to customer

- **Customer Management**
  - Full customer profiles
  - Purchase history
  - Insurance information
  - Notes

---

## [0.5.0] - 2024-08-XX

### Added
- **Dashboard**
  - Real-time statistics
  - Revenue tracking
  - Low stock alerts
  - Overdue invoices alerts
  - Quick actions

- **Reporting**
  - Sales history charts
  - Daily/Weekly/Monthly/Yearly views
  - Product performance

---

## [0.4.0] - 2024-07-XX

### Added
- **Initial MVP Launch**
  - PostgreSQL + Prisma ORM setup
  - Express.js backend
  - Next.js frontend
  - Redux Toolkit + RTK Query
  - Tailwind CSS styling
  - Shadcn/UI components

---

## [Unreleased] - Development

### Known Issues
- Demo accounts feature pending redesign

---

## Migration Guides

### Upgrading to v1.0.0

1. **Database**: No schema changes
2. **Environment**: Add `JWT_SECRET` if not present
3. **Frontend**: Rebuild with `npm run build`
4. **Run migrations**: `npx prisma migrate deploy`

### Upgrading to v0.9.0

The admin functionality requires new Prisma fields. Run:
```bash
npx prisma migrate dev --name admin_approval_workflow
```

---

## Credits

- **Lead Developer**: Development Team
- **UI Library**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [Lucide](https://lucide.dev)
- **Fonts**: [Manrope](https://fonts.google.com/specimen/Manrope), [DM Sans](https://fonts.google.com/specimen/DM+Sans)

---

## Contact

For issues and feature requests:
- GitHub Issues: https://github.com/your-repo/z0-optician/issues

---

*This changelog was started in 2024. Previous versions information may be limited.*
