export interface InvoiceItem {
  id: number;
  description: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  igstPercent: number;
  igstAmount?: number;
  amount?: number;
}

export interface InvoiceData {
  invoiceNumber: number;
  invoiceDate: string;
  dueDate: string;
  
  sellerName: string;
  sellerAddress: string;
  sellerGstin: string;
  
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
}
