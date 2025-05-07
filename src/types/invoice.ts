export interface InvoiceItem {
  id: number;
  description: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  igstPercent: number;
  igstAmount?: number;
  amount?: number;
  [key: string]: any; // Allow for dynamic fields
}

export interface InvoiceData {
  invoiceNumber: number;
  invoiceDate: string;
  dueDate: string;
  
  sellerName: string;
  sellerAddress: string;
  sellerGstin: string;
  sellerPhone?: string;
  sellerEmail?: string;
  
  billingName: string;
  billingAddress: string;
  shippingName: string;
  shippingAddress: string;
  
  items: InvoiceItem[];
  
  subtotal: number;
  totalIgst: number;
  totalAmount: number;
  totalInWords: string;
  
  accountDetails: string;
  authorizedSignature: string;
  
  // Additional custom fields
  [key: string]: any;
}

// Field configuration types
export interface FieldConfig {
  label: string;
  defaultValue: any;
  type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'select';
  required: boolean;
  options?: string[]; // For select type fields
}

export interface ItemFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'email' | 'select';
  required: boolean;
  options?: string[];
}

export interface TaxConfig {
  enabled: boolean;
  label: string;
  defaultValue: number;
}

export interface UIConfig {
  darkModeEnabled: boolean;
  showPreview: boolean;
  currency: string;
  currencySymbol: string;
}

// Complete invoice configuration
export interface InvoiceFieldConfig {
  company: {
    name: FieldConfig;
    address: FieldConfig;
    gstin: FieldConfig;
    phone?: FieldConfig;
    email?: FieldConfig;
    [key: string]: FieldConfig | undefined;
  };
  invoice: {
    number: FieldConfig;
    date: FieldConfig;
    dueDate: FieldConfig;
    [key: string]: FieldConfig | undefined;
  };
  client: {
    billingName: FieldConfig;
    billingAddress: FieldConfig;
    shippingName: FieldConfig;
    shippingAddress: FieldConfig;
    [key: string]: FieldConfig | undefined;
  };
  payment: {
    accountDetails: FieldConfig;
    authorizedSignature: FieldConfig;
    [key: string]: FieldConfig | undefined;
  };
  itemFields: ItemFieldConfig[];
  taxes: {
    igst: TaxConfig;
    [key: string]: TaxConfig | undefined;
  };
  ui: UIConfig;
  [key: string]: any;
}
