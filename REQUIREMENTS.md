# Invoice Generator App Requirements

## Main Objective
Create an invoice generating application with the ability to download invoices as PDF.

## Core Features

### User Information
1. User should be able to enter name and address

### Invoice Details
2. Invoice number (automatically incremented)
3. Invoice date
4. Billing address and shipping address

### Invoice Items
5. Support for multiple line items including:
   - Items and description
   - HSN/SAC
   - Quantity
   - Rate
   - IGST
     - Percentage
     - Amount
   - Amount

### Calculations
6. Subtotal (automatically calculated)
7. IGST (automatically calculated)
8. Total (automatically calculated)
9. Total in words

### Additional Information
10. Account Details
11. Authorised Signature

## Technical Requirements

### Tech Stack
- React + Vite
- Shadcn UI
- Tailwind CSS Version 4
- Supabase for backend (if necessary)
- Vercel for deployment and backend logic

### Must-Have Features
- PDF Generation and Download

### Good-to-Have Features
- Responsive design
- Dark mode
- Light mode
- Preview PDF
- Customizable fields
- Customizable invoice template
