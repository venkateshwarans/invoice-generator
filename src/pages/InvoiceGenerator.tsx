import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Sun, Moon, PlusCircle, Trash2, Download } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

import type { InvoiceItem, InvoiceFieldConfig } from '@/types/invoice';
import { numberToWords } from '@/lib/utils';
import { defaultInvoiceConfig } from '@/config/invoiceConfig';


interface InvoiceGeneratorProps {
  config?: InvoiceFieldConfig;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ config = defaultInvoiceConfig }) => {
  // Use config for initial state values
  const [darkMode, setDarkMode] = useState<boolean>(config.ui.darkModeEnabled);
  const [invoiceNumber, setInvoiceNumber] = useState<number>(Number(config.invoice.number.defaultValue) || 1);
  const [invoiceDate, setInvoiceDate] = useState<string>(config.invoice.date.defaultValue || new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState<string>(config.invoice.dueDate.defaultValue || '');

  const [sellerName, setSellerName] = useState<string>(config.company.name.defaultValue || 'Your Company Name');
  const [sellerAddress, setSellerAddress] = useState<string>(config.company.address.defaultValue || '123 Main St, Anytown, USA');
  const [sellerGstin, setSellerGstin] = useState<string>(config.company.gstin.defaultValue || 'YOUR_GSTIN_HERE');
  // These fields are defined in the config but not used in the current UI
  // const [sellerPhone, setSellerPhone] = useState<string>(config.company.phone?.defaultValue || '');
  // const [sellerEmail, setSellerEmail] = useState<string>(config.company.email?.defaultValue || '');

  const [billingName, setBillingName] = useState<string>(config.client.billingName.defaultValue || '');
  const [billingAddress, setBillingAddress] = useState<string>(config.client.billingAddress.defaultValue || '');
  const [shippingName, setShippingName] = useState<string>(config.client.shippingName.defaultValue || '');
  const [shippingAddress, setShippingAddress] = useState<string>(config.client.shippingAddress.defaultValue || '');

  // Create initial item from config
  const initialItem: InvoiceItem = {
    id: Date.now(),
    description: '',
    hsnSac: '',
    quantity: 1,
    rate: 0,
    igstPercent: config.taxes.igst.defaultValue || 0,
    igstAmount: 0,
    amount: 0
  };
  
  const [items, setItems] = useState<InvoiceItem[]>([{ ...initialItem }]);

  const [accountDetails, setAccountDetails] = useState<string>(config.payment.accountDetails.defaultValue || 'Bank: Your Bank\nAccount No: 1234567890\nIFSC: YOURIFSC');
  const [authorizedSignature, setAuthorizedSignature] = useState<string>(config.payment.authorizedSignature.defaultValue || 'Your Name / Company Stamp');
  
  // Currency settings from config - currently not used in the UI but available in the config
  // const [currency, setCurrency] = useState<string>(config.ui.currency || 'USD');
  // const [currencySymbol, setCurrencySymbol] = useState<string>(config.ui.currencySymbol || '$');

  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddItem = () => {
    setItems([...items, { ...initialItem, id: Date.now() }]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = (): number => {
    return items.reduce((sum, item) => {
      const itemAmount = item.quantity * item.rate;
      return sum + itemAmount;
    }, 0);
  };

  const calculateTotalIgst = (): number => {
    return items.reduce((sum, item) => {
      const itemAmount = item.quantity * item.rate;
      const igstAmount = itemAmount * (item.igstPercent / 100);
      return sum + igstAmount;
    }, 0);
  };

  const calculateTotalAmount = (): number => {
    return calculateSubtotal() + calculateTotalIgst();
  };

  const subtotal = calculateSubtotal();
  const totalIgst = calculateTotalIgst();
  const totalAmount = calculateTotalAmount();
  const totalInWords = numberToWords(Math.round(totalAmount));

  const generatePdf = () => {
    const input = invoicePreviewRef.current;
    if (!input) return;

    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;
    
    // Create a clone of the invoice element to modify before rendering
    const clone = input.cloneNode(true) as HTMLElement;
    const container = document.createElement('div');
    container.appendChild(clone);
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    
    // Set fixed dimensions to match A4 aspect ratio
    clone.style.width = '794px'; // 210mm at 96dpi
    clone.style.minHeight = '1123px'; // 297mm at 96dpi
    clone.style.maxHeight = '1123px';
    clone.style.overflow = 'hidden';
    clone.style.fontFamily = 'Ubuntu, sans-serif';
    
    // Remove any existing border on the clone
    clone.style.border = 'none';
    clone.style.boxSizing = 'border-box';
    
    document.body.appendChild(container);
    
    // Apply inline styles to replace Tailwind classes that use oklch
    const elements = clone.querySelectorAll('*');
    elements.forEach(el => {
      if (el.classList.contains('bg-gray-100') || el.classList.contains('bg-gray-50')) {
        (el as HTMLElement).style.backgroundColor = '#f3f4f6';
      }
      if (el.classList.contains('border-gray-300')) {
        (el as HTMLElement).style.borderColor = '#d1d5db';
      }
    });
    
    // Use html2canvas with the modified clone
    html2canvas(clone, { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // Fixed width matching A4 proportion
      height: 1123 // Fixed height matching A4 proportion
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Add the image to exactly fit A4 size
        pdf.addImage(imgData, 'PNG', 0, 0, a4Width, a4Height);
        pdf.save(`invoice-${invoiceNumber}.pdf`);
        
        // Clean up the temporary container
        document.body.removeChild(container);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please check console for details.');
        document.body.removeChild(container);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoice Generator</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoice Creation Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Invoice</CardTitle>
              <CardDescription>Fill in the details to generate an invoice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invoice Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      value={sellerGstin}
                      onChange={(e) => setSellerGstin(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={sellerAddress}
                    onChange={(e) => setSellerAddress(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Invoice Number and Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Invoice Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <Input
                      id="invoice-number"
                      type="number"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-date">Invoice Date</Label>
                    <Input
                      id="invoice-date"
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Billing and Shipping */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Bill To</h3>
                <div className="space-y-2">
                  <Label htmlFor="billing-name">Name</Label>
                  <Input
                    id="billing-name"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing-address">Address</Label>
                  <Textarea
                    id="billing-address"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ship To (if different)</h3>
                <div className="space-y-2">
                  <Label htmlFor="shipping-name">Name</Label>
                  <Input
                    id="shipping-name"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping-address">Address</Label>
                  <Textarea
                    id="shipping-address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Invoice Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Invoice Items</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddItem}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                {items.map((item, index) => (
                  <div key={item.id} className="space-y-4 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`item-desc-${item.id}`}>Item & Description</Label>
                        <Textarea
                          id={`item-desc-${item.id}`}
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`hsn-sac-${item.id}`}>HSN/SAC</Label>
                        <Input
                          id={`hsn-sac-${item.id}`}
                          value={item.hsnSac}
                          onChange={(e) => handleItemChange(item.id, 'hsnSac', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                        <Input
                          id={`quantity-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`rate-${item.id}`}>Rate</Label>
                        <Input
                          id={`rate-${item.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`igst-${item.id}`}>IGST %</Label>
                        <Input
                          id={`igst-${item.id}`}
                          type="number"
                          min="0"
                          max="100"
                          value={item.igstPercent}
                          onChange={(e) => handleItemChange(item.id, 'igstPercent', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>IGST Amount</Label>
                        <div className="h-10 px-3 py-2 rounded-md border bg-muted/50">
                          ₹ {(item.quantity * item.rate * (item.igstPercent / 100)).toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <div className="h-10 px-3 py-2 rounded-md border bg-muted/50">
                          ₹ {(item.quantity * item.rate * (1 + item.igstPercent / 100)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Account Details and Signature */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="account-details">Bank Details</Label>
                  <Textarea
                    id="account-details"
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authorized Signature</h3>
                <div className="space-y-2">
                  <Label htmlFor="signature">Signature</Label>
                  <Input
                    id="signature"
                    value={authorizedSignature}
                    onChange={(e) => setAuthorizedSignature(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={generatePdf} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Invoice Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
              <CardDescription>This is how your invoice will look.</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                id="invoice-preview"
                ref={invoicePreviewRef} 
                className="border border-gray-400 bg-white text-black text-xs"
                style={{ 
                  aspectRatio: '210/297',
                  width: '100%', 
                  maxWidth: '794px',
                  padding: '20px',
                  fontFamily: '"Ubuntu", sans-serif',
                  // margin: '20px auto'
                }}
              >
                {/* Invoice Header */}
                <div className="grid grid-cols-2 border border-gray-300">
                  <div className="p-4 border-r border-gray-300">
                    <h2 className="text-base font-bold">{sellerName}</h2>
                    <p className="whitespace-pre-line text-xs">{sellerAddress}</p>
                    <p className="text-xs">India</p>
                    <p className="text-xs">GSTIN {sellerGstin}</p>
                  </div>
                  <div className="p-4 text-right">
                    <h1 className="text-3xl font-bold mb-4">TAX INVOICE</h1>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 border border-gray-300 border-t-0">
                  <div className="p-2 border-r border-gray-300">
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="py-1 pr-2">#</td>
                          <td className="py-1">: INV-{invoiceNumber.toString().padStart(6, '0')}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2">Invoice Date</td>
                          <td className="py-1">: {invoiceDate}</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2">Terms</td>
                          <td className="py-1">: Custom</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-2">Due Date</td>
                          <td className="py-1">: {dueDate || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-2">
                    {/* This cell intentionally left blank */}
                  </div>
                </div>

                {/* Bill To / Ship To */}
                <div className="grid grid-cols-2 border border-gray-300 border-t-0">
                  <div className="border-r border-gray-300">
                    <div className="p-2 border-b border-gray-300" style={{ backgroundColor: '#f3f4f6' }}>
                      <h3 className="font-bold text-xs">Bill To</h3>
                    </div>
                    <div className="p-2">
                      <p className="font-semibold text-xs">{billingName}</p>
                      <p className="text-xs whitespace-pre-line">{billingAddress}</p>
                    </div>
                  </div>
                  <div>
                    <div className="p-2 border-b border-gray-300" style={{ backgroundColor: '#f3f4f6' }}>
                      <h3 className="font-bold text-xs">Ship To</h3>
                    </div>
                    <div className="p-2">
                      <p className="font-semibold text-xs">{shippingName || billingName}</p>
                      <p className="text-xs whitespace-pre-line">{shippingAddress || billingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Invoice Items Table */}
                <table className="w-full border-collapse text-xs border border-gray-300 border-t-0">
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th className="p-2 border-b border-r border-gray-300 text-center">#</th>
                      <th className="p-2 border-b border-r border-gray-300 text-left">Item & Description</th>
                      <th className="p-2 border-b border-r border-gray-300 text-center">HSN/SAC</th>
                      <th className="p-2 border-b border-r border-gray-300 text-center">Qty</th>
                      <th className="p-2 border-b border-r border-gray-300 text-right">Rate</th>
                      <th className="border-b border-r border-gray-300 text-center" colSpan={2} style={{ padding: 0, width: '20%' }}>
                        <div className="text-center p-2">IGST</div>
                        <div className="grid grid-cols-2 border-t border-gray-300">
                          <div className="border-r border-gray-300 p-2 text-center">%</div>
                          <div className="p-2 text-center">Amt</div>
                        </div>
                      </th>
                      <th className="p-2 border-b border-gray-300 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => {
                      const itemTotal = item.quantity * item.rate;
                      const igstAmount = itemTotal * (item.igstPercent / 100);
                      const totalWithTax = itemTotal + igstAmount;
                      
                      return (
                        <tr key={item.id}>
                          <td className="p-2 border-r border-b border-gray-300 text-center">{index + 1}</td>
                          <td className="p-2 border-r border-b border-gray-300">{item.description}</td>
                          <td className="p-2 border-r border-b border-gray-300 text-center">{item.hsnSac}</td>
                          <td className="p-2 border-r border-b border-gray-300 text-center">{item.quantity.toFixed(2)}</td>
                          <td className="p-2 border-r border-b border-gray-300 text-right">{item.rate.toFixed(2)}</td>
                          <td className="p-2 border-r border-b border-gray-300 text-center">{item.igstPercent}%</td>
                          <td className="p-2 border-r border-b border-gray-300 text-right">{igstAmount.toFixed(2)}</td>
                          <td className="p-2 border-b border-gray-300 text-right">{totalWithTax.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {/* Totals Section */}
                <div className="grid grid-cols-2 border border-gray-300 border-t-0">
                  <div className="p-2 border-r border-gray-300">
                    <div className="font-bold mb-2">Total In Words</div>
                    <div className="italic">United States Dollars {totalInWords}</div>
                  </div>
                  <div>
                    <table className="w-full text-xs">
                      <tbody>
                        <tr>
                          <td className="p-2 text-right">Sub Total</td>
                          <td className="p-2 text-right">{subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-right">IGST0 (0%)</td>
                          <td className="p-2 text-right">{totalIgst.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-right font-bold">Total</td>
                          <td className="p-2 text-right font-bold">{totalAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-right font-bold">Balance Due</td>
                          <td className="p-2 text-right font-bold">${totalAmount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bank Details and Signature */}
                <div className="grid grid-cols-2 border border-gray-300 border-t-0">
                  <div className="p-2 border-r border-gray-300">
                    <p className="text-xs mb-1">Tax PAN Card No: {sellerGstin.substring(2, 12)}</p>
                    <p className="text-xs font-bold mb-1">Bank Details</p>
                    <p className="text-xs">Branch: {accountDetails.split('\n')[0].replace('Bank: ', '')}, Salem</p>
                    <p className="text-xs">IFSC Code: {accountDetails.split('\n')[2].replace('IFSC: ', '')}</p>
                    <p className="text-xs">BIC Code (Swift code): HDFCINBB</p>
                    <p className="text-xs">Acc Name: {authorizedSignature}</p>
                    <p className="text-xs">Acc Number: {accountDetails.split('\n')[1].replace('Account No: ', '')}</p>
                  </div>
                  <div className="p-2 text-right">
                    <div className="h-24"></div>
                    <p className="text-xs font-bold">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { InvoiceGenerator };
export default InvoiceGenerator;
