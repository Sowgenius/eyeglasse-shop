# 🎓 Optician Pro - Step-by-Step Tutorials

Practical walkthroughs for common tasks.

---

## Tutorial 1: First-Time Setup

### Goal
Set up the system for the first time and create your admin account.

### Prerequisites
- System installed and running
- Database configured

### Steps

#### 1. Access the Application
```
Open browser: http://localhost:3000
```

#### 2. Create Admin User (Command Line)
```bash
cd server
node scripts/create-admin.js
```

This creates three default accounts:
- **admin@optician.pro** / admin123 (Manager)
- **manager@optician.pro** / manager123 (Manager)
- **user@optician.pro** / user123 (User)

#### 3. Login
1. Go to http://localhost:3000/login
2. Enter: `manager@optician.pro`
3. Password: `manager123`
4. Click "Login"

#### 4. Change Default Password
1. Click your name (top right)
2. Select "Profile"
3. Click "Change Password"
4. Enter new secure password
5. Save

✅ **Setup Complete!**

---

## Tutorial 2: Adding Your First Product

### Goal
Add a new eyeglass frame to inventory.

### Scenario
You've received new Ray-Ban Aviator frames and want to add them.

### Steps

#### 1. Navigate to Dashboard
- You should already be on the dashboard after login
- If not, click "Dashboard" in the menu

#### 2. Click "Add New"
- Green button at top right of product table
- A dialog/form opens

#### 3. Fill Product Details

**Basic Information:**
```
Product Name: Ray-Ban Aviator RB3025
Brand: Ray-Ban
Price: 159.99
Quantity: 25
Image: [Upload photo of the glasses]
```

**Frame Specifications:**
```
Frame Material: Metal
Frame Shape: Aviator
Hinge Type: Standard
```

**Lens & Fit:**
```
Lens Type: Single-vision
Gender: Unisex
Color: Gold
Temple Length: 140
Bridge Size: 14
```

**Supplier Information:**
```
Supplier Name: Luxottica France
Supplier Contact: +33 1 49 47 70 00
Location: Shelf A3
```

#### 4. Save the Product
- Click "Save" button
- Product appears in the table
- Success toast notification shows

✅ **Product Added!**

**Next**: Try adding 3-4 more products to build inventory.

---

## Tutorial 3: Creating a Customer Quote

### Goal
Create a price quote for a walk-in customer.

### Scenario
John Doe wants to buy glasses but needs an estimate first.

### Steps

#### 1. Add Customer
1. Go to **Customers** page
2. Click **"Add Customer"**
3. Fill details:
   ```
   First Name: John
   Last Name: Doe
   Email: john.doe@email.com
   Phone: +1 555-0123
   Address: 123 Main St
   City: New York
   Postal Code: 10001
   Insurance Provider: VSP Vision
   Insurance Number: VSP123456789
   ```
4. Click **"Save"**

#### 2. Create Quote
1. Go to **Quotes** page
2. Click **"New Quote"**
3. Select **John Doe** from customer dropdown
4. Add items:
   
   **Item 1 - Frame:**
   - Click "Add from Inventory"
   - Select "Ray-Ban Aviator RB3025"
   - Quantity: 1
   - Discount: 0%
   
   **Item 2 - Lenses:**
   - Click "Add Custom Item"
   - Description: "Progressive Lenses - Anti-reflective"
   - Unit Price: 250.00
   - Quantity: 1
   - Discount: 10%

5. Set Tax Rate: 8.5%
6. Valid Until: [30 days from now]
7. Terms: "Valid for 30 days. 50% deposit required."
8. Notes: "Customer prefers lightweight frames"

#### 3. Save Quote
- Click **"Save as Draft"**
- Review the total: $443.54

#### 4. Send to Customer
- Click **"Send to Customer"**
- System emails the quote to john.doe@email.com
- Status changes to "SENT"

✅ **Quote Created & Sent!**

---

## Tutorial 4: Converting Quote to Invoice

### Goal
Convert an accepted quote to an invoice and record payment.

### Scenario
John Doe accepted the quote and wants to proceed.

### Steps

#### 1. Find the Quote
1. Go to **Quotes** page
2. Find John Doe's quote
3. Click on quote number to open

#### 2. Mark as Accepted
1. Review the details
2. Click **"Mark as Accepted"**
3. Status changes to "ACCEPTED"

#### 3. Convert to Invoice
1. Click **"Convert to Invoice"**
2. System creates invoice automatically
3. Stock is reserved (not yet deducted)
4. Click **"View Invoice"**

#### 4. Record Initial Payment
Customer pays 50% deposit ($221.77):

1. On invoice page, click **"Add Payment"**
2. Fill payment form:
   ```
   Amount: 221.77
   Payment Method: Credit Card
   Reference: Visa ending 4242
   Date: [Today]
   ```
3. Click **"Record Payment"**
4. Invoice status: PARTIAL
5. Balance Due: $221.77

#### 5. Complete Order
When glasses are ready and customer picks up:

1. Customer pays remaining balance
2. Click **"Add Payment"**
3. Amount: 221.77
4. Method: Credit Card
5. Status changes to PAID
6. Stock is automatically deducted

#### 6. Give Receipt
1. Click **"Download PDF"**
2. Print receipt
3. Give to customer

✅ **Sale Complete!**

---

## Tutorial 5: Setting Up Installment Plan

### Goal
Create a payment plan for a customer who can't pay full amount upfront.

### Scenario
Jane Smith wants $800 designer glasses but prefers to pay over 4 months.

### Steps

#### 1. Create Invoice First
1. Create invoice for Jane Smith
2. Items: Designer Frame ($500) + Progressive Lenses ($300)
3. Total: $800 + tax = $868

#### 2. Create Installment Plan
1. Go to **Installments** page
2. Click **"New Payment Plan"**
3. Select Jane Smith's invoice
4. Configure plan:
   ```
   Total Amount: 868.00
   Number of Payments: 4
   Frequency: Monthly
   Start Date: [1st of next month]
   Late Fee %: 5
   Notes: "4-month payment plan. First payment due on pickup."
   ```

5. Review schedule:
   ```
   Payment 1: $217.00 - Due [Date]
   Payment 2: $217.00 - Due [Date + 1 month]
   Payment 3: $217.00 - Due [Date + 2 months]
   Payment 4: $217.00 - Due [Date + 3 months]
   ```

6. Click **"Create Plan"**

#### 3. First Payment (At Pickup)
Customer picks up glasses and makes first payment:

1. Find Jane's installment plan
2. Click **"Record Payment"** on Payment 1
3. Amount: 217.00
4. Method: Cash
5. Status: PAID
6. Give glasses to customer

#### 4. Subsequent Payments
Monthly, when customer comes in:

1. Go to **Installments** page
2. Find Jane's plan
3. Click **"Record Payment"** on next due payment
4. Enter payment details
5. Give receipt

#### 5. Handle Late Payment
If Payment 3 is 10 days late:

1. System shows payment as OVERDUE
2. Late fee calculated: $217 × 5% = $10.85
3. Total due: $227.85
4. Record payment of $227.85
5. Payment status: PAID

✅ **Installment Plan Active!**

---

## Tutorial 6: Managing Prescriptions

### Goal
Store and use customer eye prescriptions.

### Scenario
Dr. Johnson gave Michael Brown a new prescription. Store it and use for order.

### Steps

#### 1. Add Customer
Create Michael Brown's profile if not exists.

#### 2. Add Prescription
1. Go to **Customers** → Michael Brown
2. Click **"Prescriptions"** tab
3. Click **"Add Prescription"**
4. Fill prescription from doctor:

```
Prescription Date: 2026-01-15
Expiry Date: 2028-01-15
Prescribed By: Dr. Sarah Johnson, OD

Right Eye (OD):
  SPH: -2.50
  CYL: -0.75
  AXIS: 180
  ADD: +2.00
  PD: 32

Left Eye (OS):
  SPH: -2.25
  CYL: -0.50
  AXIS: 175
  ADD: +2.00
  PD: 31

Near PD: 30
Lens Type Recommended: Progressive, Anti-reflective
Notes: Patient has dry eye, recommend daily disposable contacts
```

5. Click **"Save Prescription"**

#### 3. Create Order Using Prescription
1. Create quote/invoice for Michael
2. Select **Prescription** from dropdown
3. Verify lens type matches prescription
4. Ensure anti-reflective coating is selected
5. Complete order

#### 4. Check Expiry
System will warn when prescription is:
- Yellow: Expires in 30 days
- Red: Already expired

✅ **Prescription Stored & Used!**

---

## Tutorial 7: Managing Inventory

### Goal
Handle stock management and low inventory.

### Scenario
Multiple products are running low. Reorder and update stock.

### Steps

#### 1. Check Low Stock Alerts
1. On **Dashboard**, look for red alerts
2. Or go to **Reports** → **Low Stock**
3. View products below reorder point

#### 2. Identify Reorder Needs
```
Product: Oakley Holbrook
Current Stock: 3
Reorder Point: 5
Status: 🔴 Low Stock
Action: Reorder 15 units
```

#### 3. Reorder from Supplier
1. Contact supplier: Oakley Europe
2. Place order for 15 units
3. Get order confirmation
4. Note expected delivery date

#### 4. Receive Stock
When order arrives:

1. Go to **Products** → Find Oakley Holbrook
2. Click **Edit**
3. Update Quantity: 3 → 18 (3 + 15)
4. System logs stock movement
5. Save

#### 5. Verify Stock Levels
1. Dashboard shows updated quantity
2. Alert disappears
3. Product available for sale

✅ **Inventory Updated!**

---

## Tutorial 8: Running Reports

### Goal
Generate sales and performance reports.

### Scenario
End of month - need to review sales performance.

### Steps

#### 1. Monthly Sales Report
1. Go to **Reports** page
2. Select **"Sales Report"**
3. Set Date Range:
   ```
   Start: 2026-01-01
   End: 2026-01-31
   ```
4. Click **"Generate Report"**

#### 2. Review Results
```
Total Revenue: $24,500.00
Number of Sales: 45
Average Order: $544.44
Best Day: Jan 15 ($1,850)
```

#### 3. Export Report
1. Click **"Export to PDF"**
2. Save as: "January_2026_Sales_Report.pdf"
3. Or click **"Export to Excel"** for spreadsheet

#### 4. Product Performance Report
1. Select **"Product Performance"**
2. Same date range
3. View:
   ```
   Top Selling:
   1. Ray-Ban Aviator - 12 sold
   2. Oakley Holbrook - 8 sold
   3. Chanel 3281 - 5 sold
   
   Low Stock:
   - Oakley Holbrook (3 left)
   - Chanel 3281 (2 left)
   ```

#### 5. Outstanding Payments
1. Select **"Financial Summary"**
2. Filter: Status = PENDING or PARTIAL
3. View customers with unpaid invoices
4. Follow up for collection

✅ **Reports Generated!**

---

## Tutorial 9: User Management (Manager Only)

### Goal
Add new staff members to the system.

### Scenario
Hiring a new sales associate.

### Steps

#### 1. Create New User
**Method 1: Command Line**
```bash
./scripts/manage-users.sh create \
  -e sarah.sales@shop.com \
  -n "Sarah Williams" \
  -p "sarah2024!" \
  -r USER
```

**Method 2: Direct Node Script**
```bash
cd server
node scripts/create-user.js \
  --email sarah.sales@shop.com \
  --name "Sarah Williams" \
  --password "sarah2024!" \
  --role USER
```

#### 2. Verify User Created
1. Check console output shows success
2. User can now login with provided credentials

#### 3. User Training
Give Sarah:
- Login credentials
- Link to this User Guide
- Explain she can only see HER customers and products
- Show how to create quotes and invoices

#### 4. Monitor Activity (Manager)
1. As manager, you can see all users' data
2. Review Sarah's quotes and sales
3. Provide feedback and training

✅ **New User Added!**

---

## Tutorial 10: Handling Returns

### Goal
Process a customer return.

### Scenario
Customer returns glasses - defective frame.

### Steps

#### 1. Find Original Invoice
1. Go to **Invoices** page
2. Search by customer name
3. Open original invoice

#### 2. Assess Return
Options:
- **Full Refund**: If defective
- **Exchange**: For different frame
- **Partial Refund**: If damaged by customer

#### 3. Create Credit Note
1. Note the return in invoice notes:
   ```
   RETURNED: 2026-02-15
   Reason: Defective hinge
   Action: Full refund issued
   Ref #: CR-2026-001
   ```

2. If full refund:
   - Refund payment (outside system)
   - Add negative payment to invoice:
     - Amount: -$500.00
     - Method: Refund
     - Notes: "Full refund - defective"

#### 4. Return to Stock
If item is resellable:
1. Go to **Products**
2. Edit product quantity (+1)
3. Note in stock movement: "Return - resaleable"

If defective:
1. Do not add back to stock
2. Dispose or return to supplier
3. Contact supplier for warranty claim

#### 5. Warranty Claim (if applicable)
1. Check if frame under warranty
2. Contact supplier with:
   - Original invoice
   - Defect photos
   - Serial number
3. Process supplier return

✅ **Return Processed!**

---

## Quick Reference Card

### Keyboard Shortcuts
- `Ctrl + K`: Quick search
- `Ctrl + N`: New item (context dependent)
- `Ctrl + S`: Save form
- `Esc`: Close dialog

### Status Meanings
| Status | Color | Meaning |
|--------|-------|---------|
| ACTIVE | Green | Normal/active |
| PENDING | Yellow | Awaiting action |
| PARTIAL | Orange | Partially complete |
| OVERDUE | Red | Past deadline |
| PAID | Green | Complete |
| CANCELLED | Gray | Cancelled |

### Important Reminders
- ✅ Always verify prescription expiry
- ✅ Record payments immediately
- ✅ Check low stock weekly
- ✅ Backup data regularly
- ✅ Log out when done

---

**Need More Help?**
- Review [User Guide](./USER_GUIDE.md)
- Check [API Documentation](./api-reference.md)
- Contact system administrator

**Practice Makes Perfect!**
Try each tutorial in a test environment before working with real data.

---

*Last Updated: 2026-02-19*
