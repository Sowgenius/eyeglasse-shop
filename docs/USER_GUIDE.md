# 📚 Optician Pro - User Guide

Complete guide for using the Optician Pro management system.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Products](#managing-products)
4. [Customer Management](#customer-management)
5. [Creating Quotes](#creating-quotes)
6. [Invoicing & Payments](#invoicing--payments)
7. [Installment Plans](#installment-plans)
8. [Prescription Management](#prescription-management)
9. [Reports & Analytics](#reports--analytics)

---

## Getting Started

### Login

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your email and password
3. Click "Login"

**Default Demo Accounts:**
- **Manager**: manager@optician.pro / manager123
- **User**: user@optician.pro / user123

### Understanding Roles

**MANAGER (Admin)**
- Can manage ALL products in the system
- Can view ALL customers
- Can access all reports
- Can manage other users' data

**USER (Sales Staff)**
- Can only manage products THEY created
- Can only view customers THEY created
- Can create quotes and invoices
- Cannot access other users' data

---

## Dashboard Overview

The dashboard is your central hub showing:

### Product Inventory Table
- **Columns**: Name, Brand, Price, Quantity, and more
- **Filters**: Search by brand, material, shape, lens type, color, gender, price range
- **Actions**: Edit, Duplicate, Delete, Sell

### Quick Actions
- **Add New Product**: Create new eyeglass inventory item
- **Bulk Delete**: Select multiple products and delete them

### Understanding Icons
- 👁️ **View Image**: See product photo
- ✏️ **Edit**: Modify product details
- 📋 **Duplicate**: Copy product to create similar item
- 💵 **Sell**: Record a sale
- 🗑️ **Delete**: Remove product from inventory

---

## Managing Products

### Adding a New Product

1. Click the **"Add New"** button (top right)
2. Fill in the product form:

**Basic Information:**
- **Product Name**: e.g., "Ray-Ban Aviator RB3025"
- **Brand**: e.g., "Ray-Ban"
- **Price**: Selling price (e.g., 159.99)
- **Quantity**: Stock count
- **Image**: Upload product photo

**Frame Specifications:**
- **Frame Material**: Metal, Plastic, Acetate, Titanium
- **Frame Shape**: Aviator, Rectangular, Round, Cat-eye, etc.
- **Hinge Type**: Standard, Spring-loaded, Flexible

**Lens & Fit:**
- **Lens Type**: Single-vision, Bifocal, Progressive, Polycarbonate
- **Gender**: Men, Women, Unisex
- **Color**: Frame color
- **Temple Length**: In millimeters (e.g., 140)
- **Bridge Size**: In millimeters (e.g., 14)

**Supplier Information:**
- **Supplier Name**: e.g., "Luxottica France"
- **Supplier Contact**: Phone or email
- **Location**: Storage location in shop

3. Click **"Save"** to add the product

### Editing a Product

1. Find the product in the table
2. Click the **three dots** (⋯) on the right
3. Select **"Edit"**
4. Modify the fields
5. Click **"Save"**

### Duplicating a Product

Use this when adding similar products:

1. Find the product to copy
2. Click the **three dots** (⋯)
3. Select **"Duplicate"**
4. Modify SKU and any different details
5. Click **"Save"**

### Deleting Products

**Single Delete:**
1. Click the **three dots** (⋯)
2. Select **"Delete"**
3. Confirm deletion

**Bulk Delete:**
1. Check the boxes next to products you want to delete
2. Click **"Delete Selected"** button that appears
3. Confirm deletion

⚠️ **Note**: Deleted products are soft-deleted (hidden but recoverable by admin)

### Filtering Products

Use the filter bar to find products:

1. **Search by Name/Brand**: Type in the search box
2. **Filter by Material**: Click filter dropdown
3. **Price Range**: Enter min/max prices
4. **Frame Shape**: Select from dropdown
5. **Clear Filters**: Click "Reset" button

---

## Customer Management

### Adding a New Customer

1. Navigate to **Customers** page
2. Click **"Add Customer"**
3. Fill customer details:
   - **First Name** & **Last Name**
   - **Email** (optional but recommended)
   - **Phone Number**
   - **Address**: Street, City, Postal Code
   - **Birth Date**: For age-related lens recommendations
   - **Insurance Provider**: e.g., "Mutuelle Générale"
   - **Insurance Number**: Policy number
   - **Notes**: Any special requirements

4. Click **"Save"**

### Viewing Customer History

1. Go to **Customers** page
2. Click on customer name
3. View tabs:
   - **Profile**: Contact information
   - **Purchase History**: All past orders
   - **Prescriptions**: Eye prescription records
   - **Quotes**: Pending estimates

### Searching Customers

- Use the search bar to find by name, email, or phone
- Use filters for insurance provider

---

## Creating Quotes

Quotes are estimates for customers before they commit to purchase.

### Creating a New Quote

1. Go to **Quotes** page
2. Click **"New Quote"**
3. Select **Customer** (or create new)
4. Add items:
   - Select **Product** from inventory
   - Or add **Custom Item** (description, price)
   - Set **Quantity**
   - Add **Discount** if applicable
5. Set **Tax Rate** (e.g., 20%)
6. Set **Valid Until** date
7. Add **Notes** or **Terms**
8. Click **"Save as Draft"** or **"Send to Customer"**

### Quote Statuses

- **DRAFT**: Working on the quote
- **SENT**: Emailed to customer
- **ACCEPTED**: Customer approved
- **REJECTED**: Customer declined
- **EXPIRED**: Past valid date

### Converting Quote to Invoice

When customer accepts:

1. Open the accepted quote
2. Click **"Convert to Invoice"**
3. System creates invoice with same items
4. Stock is deducted when invoice is created

---

## Invoicing & Payments

### Creating an Invoice

**From Quote:**
- Convert accepted quote to invoice

**New Invoice:**
1. Go to **Invoices** page
2. Click **"New Invoice"**
3. Select **Customer**
4. Add items (from inventory or custom)
5. Set **Due Date**
6. Add **Notes** if needed
7. Click **"Create Invoice"**

### Recording Payments

When customer pays:

1. Open the invoice
2. Click **"Add Payment"**
3. Enter:
   - **Amount Paid**
   - **Payment Method**: Cash, Credit Card, Check, etc.
   - **Reference**: Check number, transaction ID
   - **Date**: Payment date
4. Click **"Record Payment"**

### Payment Statuses

- **PENDING**: No payment received
- **PARTIAL**: Some payment received
- **PAID**: Fully paid
- **OVERDUE**: Past due date

### Partial Payments

The system supports multiple payments:

1. Invoice total: $500
2. First payment: $200 → Status: PARTIAL
3. Second payment: $300 → Status: PAID

### Downloading Invoice PDF

1. Open the invoice
2. Click **"Download PDF"**
3. Save or print the invoice

---

## Installment Plans

Allow customers to pay over time.

### Creating an Installment Plan

1. Go to **Installments** page
2. Click **"New Payment Plan"**
3. Select **Invoice**
4. Configure plan:
   - **Total Amount**: Amount to finance
   - **Number of Payments**: 3 to 24
   - **Frequency**: Weekly, Bi-weekly, Monthly, Quarterly
   - **Start Date**: First payment date
   - **Late Fee %**: Optional penalty for late payments
   - **Notes**: Terms and conditions

5. Review payment schedule
6. Click **"Create Plan"**

**Example**: $600 total, 3 monthly payments = $200/month

### Recording Installment Payments

1. Go to **Installments** page
2. Find the customer's plan
3. Click **"Record Payment"** on the due payment
4. Enter:
   - **Amount Received**
   - **Payment Method**
   - **Notes**
5. Click **"Confirm Payment"**

### Viewing Payment Schedule

Each plan shows:
- **Payment Number**: 1 of 6, etc.
- **Due Date**: When payment is expected
- **Amount**: Payment amount
- **Status**: Pending, Paid, Overdue
- **Paid Date**: When received

### Late Fees

If a payment is overdue:
- System automatically calculates late fee
- Fee = Payment Amount × Late Fee %
- Total due = Payment + Late Fee

### Cancelling a Plan

1. Open the installment plan
2. Click **"Cancel Plan"**
3. Confirm cancellation
4. All pending payments are waived

⚠️ **Cannot cancel plans that are fully paid**

### Overdue Payment Report

1. Go to **Installments** page
2. Click **"Overdue Payments"** tab
3. View all late payments
4. Contact customers for collection

---

## Prescription Management

Store customer eye prescriptions from their doctors.

### Adding a Prescription

1. Go to **Customers** → Select customer
2. Click **"Prescriptions"** tab
3. Click **"Add Prescription"**
4. Fill prescription details:

**Prescription Information:**
- **Prescription Date**: When prescribed
- **Expiry Date**: Usually 1-2 years
- **Prescribed By**: Doctor's name

**Right Eye (OD):**
- **SPH**: Sphere (e.g., -2.50)
- **CYL**: Cylinder (e.g., -0.75)
- **AXIS**: 0-180 degrees
- **ADD**: Addition for progressive (e.g., +2.00)
- **PD**: Pupillary Distance

**Left Eye (OS):**
- Same fields as right eye

**Additional:**
- **Near PD**: For reading glasses
- **Lens Type Recommended**: Progressive, Bifocal, etc.
- **Notes**: Special instructions

5. Click **"Save Prescription"**

### Using Prescriptions for Orders

When creating quote/invoice:
1. Select customer
2. System shows available prescriptions
3. Select appropriate prescription
4. Verify lens type matches prescription

### Prescription Expiry Alerts

System alerts when prescriptions are expiring soon:
- Yellow warning: Expires in 30 days
- Red warning: Already expired

---

## Reports & Analytics

### Available Reports

1. **Sales Report**
   - Daily, Weekly, Monthly, Yearly
   - Total revenue
   - Number of sales
   - Average order value

2. **Product Performance**
   - Best selling products
   - Low stock alerts
   - Inventory value

3. **Customer Analytics**
   - New customers
   - Repeat customers
   - Outstanding balances

4. **Financial Summary**
   - Revenue by period
   - Outstanding invoices
   - Overdue payments

### Viewing Reports

1. Go to **Reports** page
2. Select report type
3. Set date range
4. Click **"Generate Report"**
5. View on screen or **Export to PDF/Excel**

### Low Stock Alerts

System automatically shows alerts when:
- Product quantity ≤ Reorder Point
- Alert appears on dashboard
- Click to view low stock products

---

## Tips & Best Practices

### Daily Workflow

1. **Morning**: Check low stock alerts and overdue payments
2. **Sales**: Create quotes for walk-in customers
3. **Orders**: Convert quotes to invoices
4. **End of Day**: Record all payments received

### Data Entry

- **Always use unique SKUs** for products
- **Enter prescriptions accurately** - verify with customer
- **Record payments immediately** when received
- **Add notes** for special customer requests

### Customer Service

- Check customer's **purchase history** before recommending
- Verify **prescription expiry** before ordering lenses
- Set up **installment plans** for expensive purchases
- Send **quote reminders** for pending estimates

### Security

- **Never share your login**
- **Log out** when leaving the computer
- **USER role** staff can only see their own data
- **MANAGER role** can see everything

---

## Troubleshooting

### Common Issues

**Can't find a product:**
- Check filters are cleared
- Try searching by brand or SKU
- Verify product is "Active" (not deleted)

**Payment won't record:**
- Check invoice isn't already paid
- Verify amount is correct
- Ensure payment method is selected

**Customer can't see their data:**
- Verify you're logged in as MANAGER
- Or ensure USER created that customer

**Installment payment is wrong:**
- Check due dates were calculated correctly
- Verify late fees if overdue
- Contact admin to adjust if needed

---

## Support

For technical issues or questions:
1. Check this documentation
2. Review the [API Documentation](./api-reference.md)
3. Contact system administrator

---

**Last Updated**: 2026-02-19  
**Version**: 2.0.0
