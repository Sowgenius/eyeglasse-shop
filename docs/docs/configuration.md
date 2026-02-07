---
sidebar_position: 3
---

# Configuration

Complete configuration guide for Optician Pro.

## Environment Variables

### Backend Configuration

Create a `.env` file in the `server` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Security
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Email (Optional)
RESEND_API_KEY="re_xxxxxxxx"

# CORS
CLIENT_URL="http://localhost:3000"

# Environment
NODE_ENV=development
PORT=8080
```

### Frontend Configuration

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:8080/api"
NEXT_PUBLIC_APP_NAME="Optician Pro"
```

## Database Configuration

### Connection Pool

Prisma manages connections automatically, but you can configure the pool size:

```env
DATABASE_URL="postgresql://user:pass@host/db?schema=public&connection_limit=20"
```

### SSL for Production

For managed PostgreSQL services (AWS RDS, etc.):

```env
DATABASE_URL="postgresql://user:pass@host/db?schema=public&sslmode=require"
```

## Email Configuration

### Resend Setup

1. Create account at [Resend](https://resend.com)
2. Verify your domain
3. Get API key
4. Add to `.env`:

```env
RESEND_API_KEY="re_your_api_key"
```

### Email Templates

Default sender: `Optician Pro <noreply@optician.pro>`

Customize in `server/src/lib/email.ts`:

```typescript
export const FROM_EMAIL = 'Your Name <your@domain.com>'
```

## Internationalization

### Default Language

French is the default language. To change:

Edit `client/next.config.mjs`:
```javascript
i18n: {
  defaultLocale: 'en',  // Change to 'en' for English
  locales: ['fr', 'en'],
}
```

### Adding New Languages

1. Create translation file:
```bash
mkdir -p client/public/locales/de
touch client/public/locales/de/common.json
```

2. Add locale to config:
```javascript
locales: ['fr', 'en', 'de'],
```

3. Copy translations from `fr/common.json` and translate

## Security Configuration

### JWT Settings

Token expiration is set to 15 days in `server/src/modules/user/user.service.ts`:

```typescript
const token = jwt.sign(
  { userId: user.id, role: user.role },
  env.JWT_SECRET,
  { expiresIn: '15d' }  // Change as needed
);
```

### CORS Origins

Update allowed origins in `server/src/app.ts`:

```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

### Password Policy

Minimum password length is set in validation schema:

Edit `server/src/modules/user/user.validation.ts`:
```typescript
export const userSchema = z.object({
  password: z.string().min(8),  // Change minimum length
  // ...
});
```

## Invoice & Quote Numbering

### Format

Default format: `QT-YYYY-XXXX` and `INV-YYYY-XXXX`

To customize, edit:
- `server/src/modules/quote/quote.service.ts`
- `server/src/modules/invoice/invoice.service.ts`

Example for French format:
```typescript
function generateInvoiceNumber(year: number, sequence: number): string {
  return `FACT-${year}-${sequence.toString().padStart(4, '0')}`;
}
```

## Tax Configuration

Default tax rate is 20%. To change:

Edit Prisma schema and regenerate:
```prisma
// In schema.prisma
 taxRate     Decimal     @default(0.20) @db.Decimal(5, 2)
```

Or set dynamically in the application when creating quotes/invoices.

## Next Steps

- Learn about [Authentication](../dev/authentication)
- Explore the [API Reference](../api/authentication)
- Read about [Deployment](../deploy/overview)
