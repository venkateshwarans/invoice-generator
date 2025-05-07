import type { InvoiceFieldConfig } from '@/types/invoice';

// Default configuration for invoice fields
export const defaultInvoiceConfig: InvoiceFieldConfig = {
  // Company/Seller Information
  company: {
    name: {
      label: 'Company Name',
      defaultValue: 'Your Company Name',
      type: 'text',
      required: true,
    },
    address: {
      label: 'Company Address',
      defaultValue: '123 Main St, Anytown, USA',
      type: 'textarea',
      required: true,
    },
    gstin: {
      label: 'GSTIN',
      defaultValue: 'YOUR_GSTIN_HERE',
      type: 'text',
      required: false,
    },
    phone: {
      label: 'Phone',
      defaultValue: '+1 (555) 123-4567',
      type: 'text',
      required: false,
    },
    email: {
      label: 'Email',
      defaultValue: 'contact@yourcompany.com',
      type: 'email',
      required: false,
    },
  },

  // Invoice Details
  invoice: {
    number: {
      label: 'Invoice Number',
      defaultValue: '1',
      type: 'text',
      required: true,
    },
    date: {
      label: 'Invoice Date',
      defaultValue: new Date().toISOString().slice(0, 10),
      type: 'date',
      required: true,
    },
    dueDate: {
      label: 'Due Date',
      defaultValue: '',
      type: 'date',
      required: false,
    },
  },

  // Client/Billing Information
  client: {
    billingName: {
      label: 'Billing Name',
      defaultValue: '',
      type: 'text',
      required: true,
    },
    billingAddress: {
      label: 'Billing Address',
      defaultValue: '',
      type: 'textarea',
      required: true,
    },
    shippingName: {
      label: 'Shipping Name',
      defaultValue: '',
      type: 'text',
      required: false,
    },
    shippingAddress: {
      label: 'Shipping Address',
      defaultValue: '',
      type: 'textarea',
      required: false,
    },
  },

  // Bank/Payment Information
  payment: {
    accountDetails: {
      label: 'Bank Account Details',
      defaultValue: 'Bank: Your Bank\nAccount No: 1234567890\nIFSC: YOURIFSC',
      type: 'textarea',
      required: false,
    },
    authorizedSignature: {
      label: 'Authorized Signature',
      defaultValue: 'Your Name / Company Stamp',
      type: 'text',
      required: false,
    },
  },

  // Item Table Configuration
  itemFields: [
    {
      key: 'description',
      label: 'Item & Description',
      type: 'text',
      required: true,
    },
    {
      key: 'hsnSac',
      label: 'HSN/SAC',
      type: 'text',
      required: false,
    },
    {
      key: 'quantity',
      label: 'Qty',
      type: 'number',
      required: true,
    },
    {
      key: 'rate',
      label: 'Rate',
      type: 'number',
      required: true,
    },
    {
      key: 'igstPercent',
      label: 'IGST %',
      type: 'number',
      required: false,
    },
  ],

  // Tax Configuration
  taxes: {
    igst: {
      enabled: true,
      label: 'IGST',
      defaultValue: 0,
    },
  },

  // UI Configuration
  ui: {
    darkModeEnabled: true,
    showPreview: true,
    currency: 'USD',
    currencySymbol: '$',
  },
};

// Function to merge user config with default config
export function mergeConfig(userConfig: Partial<InvoiceFieldConfig> = {}): InvoiceFieldConfig {
  return {
    company: { ...defaultInvoiceConfig.company, ...userConfig.company },
    invoice: { ...defaultInvoiceConfig.invoice, ...userConfig.invoice },
    client: { ...defaultInvoiceConfig.client, ...userConfig.client },
    payment: { ...defaultInvoiceConfig.payment, ...userConfig.payment },
    itemFields: userConfig.itemFields || defaultInvoiceConfig.itemFields,
    taxes: { ...defaultInvoiceConfig.taxes, ...userConfig.taxes },
    ui: { ...defaultInvoiceConfig.ui, ...userConfig.ui },
  };
}
