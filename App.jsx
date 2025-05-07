// App.jsx
// Main application component

// IMPORTANT: To resolve "Could not resolve" errors for jspdf and html2canvas,
// you need to include them via CDN in your main HTML file (e.g., public/index.html).
// Add these lines to the <head> or before the closing </body> tag:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
//
// You would also typically install other packages like:
// npm install lucide-react
// npx shadcn-ui@latest init
// npx shadcn-ui@latest add button input label textarea date-picker table card select separator

import React, { useState, useEffect, useRef } from 'react';
// Removed: import jsPDF from 'jspdf';
// Removed: import html2canvas from 'html2canvas';
import { Sun, Moon, PlusCircle, Trash2, Download } from 'lucide-react';

// Shadcn UI (Illustrative - you'd import actual installed components)
// For example: import { Button } from "@/components/ui/button";
// Using placeholder components for now to keep it runnable without full setup.

const ShadcnButton = ({ children, onClick, variant = 'default', size = 'default', className = '' }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      ${variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' :
      variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' :
      variant === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' :
      variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' :
      variant === 'link' ? 'text-primary underline-offset-4 hover:underline' :
      'bg-primary text-primary-foreground hover:bg-primary/90'}
      ${size === 'sm' ? 'h-9 px-3' : size === 'lg' ? 'h-11 px-8' : 'h-10 px-4 py-2'}
      ${className}`}
  >
    {children}
  </button>
);

const ShadcnInput = ({ type = 'text', placeholder, value, onChange, className = '', ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const ShadcnTextarea = ({ placeholder, value, onChange, className = '', ...props }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const ShadcnLabel = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const ShadcnDatePicker = ({ value, onChange, className = '' }) => (
    <ShadcnInput type="date" value={value} onChange={onChange} className={className} />
);

const ShadcnCard = ({ children, className = '' }) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
        {children}
    </div>
);
const ShadcnCardHeader = ({ children, className = '' }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const ShadcnCardTitle = ({ children, className = '' }) => <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const ShadcnCardDescription = ({ children, className = '' }) => <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
const ShadcnCardContent = ({ children, className = '' }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const ShadcnCardFooter = ({ children, className = '' }) => <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>;

const ShadcnTable = ({ children, className = '' }) => <div className={`w-full caption-bottom text-sm ${className}`}><table className="w-full">{children}</table></div>;
const ShadcnTableHeader = ({ children, className = '' }) => <thead className={`[&_tr]:border-b ${className}`}>{children}</thead>;
const ShadcnTableBody = ({ children, className = '' }) => <tbody className={`[&_tr:last-child]:border-0 ${className}`}>{children}</tbody>;
const ShadcnTableRow = ({ children, className = '' }) => <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>{children}</tr>;
const ShadcnTableHead = ({ children, className = '' }) => <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</th>;
const ShadcnTableCell = ({ children, className = '' }) => <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>;

// Helper function to convert number to words
function numberToWords(num) {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim() ? str.trim().charAt(0).toUpperCase() + str.trim().slice(1) + ' only' : 'Zero only';
}


const initialItem = { description: '', hsnSac: '', quantity: 1, rate: 0, igstPercent: 0 };

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(1); // Basic auto-increment
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');

  const [sellerName, setSellerName] = useState('Your Company Name');
  const [sellerAddress, setSellerAddress] = useState('123 Main St, Anytown, USA');
  const [sellerGstin, setSellerGstin] = useState('YOUR_GSTIN_HERE');


  const [billingName, setBillingName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const [items, setItems] = useState([{ ...initialItem, id: Date.now() }]);

  const [accountDetails, setAccountDetails] = useState('Bank: Your Bank\nAccount No: 1234567890\nIFSC: YOURIFSC');
  const [authorizedSignature, setAuthorizedSignature] = useState('Your Name / Company Stamp'); // Placeholder for image or digital sig

  const invoicePreviewRef = useRef(null);

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

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemAmount = parseFloat(item.quantity || 0) * parseFloat(item.rate || 0);
      return sum + itemAmount;
    }, 0);
  };

  const calculateTotalIgst = () => {
    return items.reduce((sum, item) => {
      const itemAmount = parseFloat(item.quantity || 0) * parseFloat(item.rate || 0);
      const igstAmount = itemAmount * (parseFloat(item.igstPercent || 0) / 100);
      return sum + igstAmount;
    }, 0);
  };

  const calculateTotalAmount = () => {
    return calculateSubtotal() + calculateTotalIgst();
  };

  const subtotal = calculateSubtotal();
  const totalIgst = calculateTotalIgst();
  const totalAmount = calculateTotalAmount();
  const totalInWords = numberToWords(totalAmount.toFixed(0)); // toFixed(0) for whole numbers, adjust if cents needed

  const generatePdf = () => {
    const input = invoicePreviewRef.current;
    // Ensure jsPDF and html2canvas are loaded (e.g., via CDN)
    if (!window.jspdf || !window.html2canvas) {
        console.error("jsPDF or html2canvas not loaded. Make sure to include them via CDN.");
        alert("Error: PDF generation libraries not loaded. Please check console."); // User-friendly message
        return;
    }
    const { jsPDF } = window.jspdf; // Or window.jsPDF depending on how the CDN exposes it.
                                   // For https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js, it's window.jspdf.jsPDF

    if (input) {
      window.html2canvas(input, { scale: 2 }) // Increase scale for better quality
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4'); // Use the destructured jsPDF
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 0; // Or some margin
          pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
          pdf.save(`invoice-${invoiceNumber}.pdf`);
          setInvoiceNumber(prev => prev + 1); // Increment invoice number after download
        })
        .catch(err => {
            console.error("Error generating PDF:", err);
            alert("Error generating PDF. Please check console."); // User-friendly message
        });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-sans">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Invoice Generator</h1>
        <div className="flex items-center gap-4">
          <ShadcnButton onClick={generatePdf} variant="default" className="flex items-center gap-2">
            <Download size={18} /> Download PDF
          </ShadcnButton>
          <ShadcnButton onClick={() => setDarkMode(!darkMode)} variant="outline" size="icon">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </ShadcnButton>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invoice Form Section */}
        <ShadcnCard className="dark:bg-slate-800">
          <ShadcnCardHeader>
            <ShadcnCardTitle>Create Invoice</ShadcnCardTitle>
            <ShadcnCardDescription>Fill in the details to generate your invoice.</ShadcnCardDescription>
          </ShadcnCardHeader>
          <ShadcnCardContent className="space-y-6">
            {/* Seller Details */}
            <div className="space-y-2 border p-4 rounded-md dark:border-slate-700">
              <h3 className="text-lg font-semibold text-primary">Your Details</h3>
              <div>
                <ShadcnLabel htmlFor="sellerName">Company Name</ShadcnLabel>
                <ShadcnInput id="sellerName" value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="Your Company Name" />
              </div>
              <div>
                <ShadcnLabel htmlFor="sellerAddress">Address</ShadcnLabel>
                <ShadcnTextarea id="sellerAddress" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} placeholder="Your Company Address" />
              </div>
              <div>
                <ShadcnLabel htmlFor="sellerGstin">GSTIN</ShadcnLabel>
                <ShadcnInput id="sellerGstin" value={sellerGstin} onChange={(e) => setSellerGstin(e.target.value)} placeholder="Your GSTIN" />
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md dark:border-slate-700">
                <div>
                    <ShadcnLabel htmlFor="invoiceNumber">Invoice Number</ShadcnLabel>
                    <ShadcnInput id="invoiceNumber" type="number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(parseInt(e.target.value))} />
                </div>
                <div>
                    <ShadcnLabel htmlFor="invoiceDate">Invoice Date</ShadcnLabel>
                    <ShadcnDatePicker id="invoiceDate" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </div>
                <div>
                    <ShadcnLabel htmlFor="dueDate">Due Date</ShadcnLabel>
                    <ShadcnDatePicker id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
            </div>


            {/* Billing and Shipping Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md dark:border-slate-700">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">Bill To</h3>
                <div>
                  <ShadcnLabel htmlFor="billingName">Name</ShadcnLabel>
                  <ShadcnInput id="billingName" value={billingName} onChange={(e) => setBillingName(e.target.value)} placeholder="Client Company Name" />
                </div>
                <div>
                  <ShadcnLabel htmlFor="billingAddress">Address</ShadcnLabel>
                  <ShadcnTextarea id="billingAddress" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} placeholder="Client Billing Address" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">Ship To (if different)</h3>
                <div>
                  <ShadcnLabel htmlFor="shippingName">Name</ShadcnLabel>
                  <ShadcnInput id="shippingName" value={shippingName} onChange={(e) => setShippingName(e.target.value)} placeholder="Shipping Name" />
                </div>
                <div>
                  <ShadcnLabel htmlFor="shippingAddress">Address</ShadcnLabel>
                  <ShadcnTextarea id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Shipping Address" />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="space-y-4 border p-4 rounded-md dark:border-slate-700">
              <h3 className="text-lg font-semibold text-primary mb-2">Invoice Items</h3>
              {items.map((item, index) => (
                <ShadcnCard key={item.id} className="p-4 space-y-3 dark:bg-slate-700/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                    <div className="md:col-span-2 lg:col-span-2">
                      <ShadcnLabel htmlFor={`itemDesc-${item.id}`}>Item & Description</ShadcnLabel>
                      <ShadcnInput id={`itemDesc-${item.id}`} value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} placeholder="Service or Product" />
                    </div>
                    <div>
                      <ShadcnLabel htmlFor={`itemHsn-${item.id}`}>HSN/SAC</ShadcnLabel>
                      <ShadcnInput id={`itemHsn-${item.id}`} value={item.hsnSac} onChange={(e) => handleItemChange(item.id, 'hsnSac', e.target.value)} placeholder="HSN/SAC" />
                    </div>
                    <div>
                      <ShadcnLabel htmlFor={`itemQty-${item.id}`}>Quantity</ShadcnLabel>
                      <ShadcnInput id={`itemQty-${item.id}`} type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))} placeholder="1" min="0" />
                    </div>
                    <div>
                      <ShadcnLabel htmlFor={`itemRate-${item.id}`}>Rate</ShadcnLabel>
                      <ShadcnInput id={`itemRate-${item.id}`} type="number" value={item.rate} onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value))} placeholder="0.00" min="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                     <div>
                        <ShadcnLabel htmlFor={`itemIgstPercent-${item.id}`}>IGST %</ShadcnLabel>
                        <ShadcnInput id={`itemIgstPercent-${item.id}`} type="number" value={item.igstPercent} onChange={(e) => handleItemChange(item.id, 'igstPercent', parseFloat(e.target.value))} placeholder="0" min="0" />
                    </div>
                    <div>
                        <ShadcnLabel>IGST Amt</ShadcnLabel>
                        <p className="h-10 flex items-center px-3 py-2 text-sm dark:text-slate-300">
                            {((parseFloat(item.quantity || 0) * parseFloat(item.rate || 0)) * (parseFloat(item.igstPercent || 0) / 100)).toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <ShadcnLabel>Item Amount</ShadcnLabel>
                         <p className="h-10 flex items-center px-3 py-2 text-sm font-semibold dark:text-slate-300">
                            {(parseFloat(item.quantity || 0) * parseFloat(item.rate || 0)).toFixed(2)}
                        </p>
                    </div>
                    {items.length > 1 && (
                      <ShadcnButton onClick={() => handleRemoveItem(item.id)} variant="destructive" size="sm" className="self-end flex items-center gap-1">
                        <Trash2 size={16} /> Remove
                      </ShadcnButton>
                    )}
                  </div>
                </ShadcnCard>
              ))}
              <ShadcnButton onClick={handleAddItem} variant="outline" className="mt-2 flex items-center gap-2">
                <PlusCircle size={18} /> Add Item
              </ShadcnButton>
            </div>

            {/* Account Details & Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-md dark:border-slate-700">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Account Details</h3>
                    <ShadcnTextarea value={accountDetails} onChange={(e) => setAccountDetails(e.target.value)} placeholder="Bank Name, Account Number, IFSC Code" rows={4}/>
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-primary">Authorised Signature</h3>
                    <ShadcnInput value={authorizedSignature} onChange={(e) => setAuthorizedSignature(e.target.value)} placeholder="Your Name / For [Company Name]"/>
                    <p className="text-xs text-muted-foreground">This will appear above the signature line in the PDF.</p>
                </div>
            </div>

          </ShadcnCardContent>
        </ShadcnCard>

        {/* Invoice Preview Section */}
        <ShadcnCard className="dark:bg-slate-800 lg:sticky lg:top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <ShadcnCardHeader>
            <ShadcnCardTitle>Invoice Preview</ShadcnCardTitle>
            <ShadcnCardDescription>This is how your invoice will look.</ShadcnCardDescription>
          </ShadcnCardHeader>
          <ShadcnCardContent>
            <div ref={invoicePreviewRef} className="p-6 bg-white text-black aspect-[210/297] overflow-auto print-friendly-preview"> {/* A4 Aspect Ratio, white background for PDF */}
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{sellerName || "Your Company"}</h2>
                  <p className="text-xs whitespace-pre-line">{sellerAddress || "Your Address"}</p>
                  {sellerGstin && <p className="text-xs">GSTIN: {sellerGstin}</p>}
                </div>
                <div className="text-right">
                  <h1 className="text-3xl font-bold uppercase text-gray-700">Tax Invoice</h1>
                  <p className="text-sm">Invoice #: <span className="font-semibold">{String(invoiceNumber).padStart(6, '0')}</span></p>
                  <p className="text-sm">Date: <span className="font-semibold">{new Date(invoiceDate).toLocaleDateString()}</span></p>
                  {dueDate && <p className="text-sm">Due Date: <span className="font-semibold">{new Date(dueDate).toLocaleDateString()}</span></p>}
                </div>
              </div>

              {/* Billing and Shipping */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-600 mb-1">Bill To:</h3>
                  <p className="text-sm font-bold">{billingName || "Client Name"}</p>
                  <p className="text-xs whitespace-pre-line">{billingAddress || "Client Address"}</p>
                </div>
                {(shippingName || shippingAddress) && (
                    <div className="text-right">
                        <h3 className="font-semibold text-gray-600 mb-1">Ship To:</h3>
                        <p className="text-sm font-bold">{shippingName || billingName}</p>
                        <p className="text-xs whitespace-pre-line">{shippingAddress || billingAddress}</p>
                    </div>
                )}
              </div>

              {/* Items Table */}
              <ShadcnTable className="mb-8">
                <ShadcnTableHeader className="bg-gray-100">
                  <ShadcnTableRow>
                    <ShadcnTableHead className="w-[40%] text-gray-700">Item & Description</ShadcnTableHead>
                    <ShadcnTableHead className="text-gray-700">HSN/SAC</ShadcnTableHead>
                    <ShadcnTableHead className="text-right text-gray-700">Qty</ShadcnTableHead>
                    <ShadcnTableHead className="text-right text-gray-700">Rate</ShadcnTableHead>
                    <ShadcnTableHead className="text-right text-gray-700">IGST %</ShadcnTableHead>
                    <ShadcnTableHead className="text-right text-gray-700">IGST Amt</ShadcnTableHead>
                    <ShadcnTableHead className="text-right text-gray-700">Amount</ShadcnTableHead>
                  </ShadcnTableRow>
                </ShadcnTableHeader>
                <ShadcnTableBody>
                  {items.map((item, index) => {
                    const itemAmount = parseFloat(item.quantity || 0) * parseFloat(item.rate || 0);
                    const igstAmountForItem = itemAmount * (parseFloat(item.igstPercent || 0) / 100);
                    return (
                      <ShadcnTableRow key={index} className="text-xs">
                        <ShadcnTableCell className="font-medium text-gray-800">{item.description || "Item Name"}</ShadcnTableCell>
                        <ShadcnTableCell>{item.hsnSac}</ShadcnTableCell>
                        <ShadcnTableCell className="text-right">{item.quantity}</ShadcnTableCell>
                        <ShadcnTableCell className="text-right">{parseFloat(item.rate || 0).toFixed(2)}</ShadcnTableCell>
                        <ShadcnTableCell className="text-right">{item.igstPercent}%</ShadcnTableCell>
                        <ShadcnTableCell className="text-right">{igstAmountForItem.toFixed(2)}</ShadcnTableCell>
                        <ShadcnTableCell className="text-right font-semibold">{itemAmount.toFixed(2)}</ShadcnTableCell>
                      </ShadcnTableRow>
                    );
                  })}
                  {items.length === 0 && (
                    <ShadcnTableRow>
                        <ShadcnTableCell colSpan={7} className="text-center text-gray-500 py-4">No items added yet.</ShadcnTableCell>
                    </ShadcnTableRow>
                  )}
                </ShadcnTableBody>
              </ShadcnTable>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-full max-w-xs text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-800">{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-600">Total IGST:</span>
                    <span className="font-semibold text-gray-800">{totalIgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-base">
                    <span className="font-bold text-gray-700">Total Amount:</span>
                    <span className="font-bold text-gray-800">${totalAmount.toFixed(2)}</span> {/* Assuming USD, adjust as needed */}
                  </div>
                </div>
              </div>

              {/* Total in Words */}
              <div className="mb-8">
                <p className="text-xs text-gray-600">Total In Words: <span className="font-semibold text-gray-700">{totalInWords}</span></p>
              </div>

              {/* Bank Details & Signature */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200 mt-auto">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 text-sm">Bank Details:</h4>
                  <p className="text-xs whitespace-pre-line text-gray-600">{accountDetails}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-semibold text-gray-700 mb-12 text-sm">Authorised Signature:</h4>
                  <p className="text-sm text-gray-700">{authorizedSignature}</p>
                  <div className="mt-1 border-t border-gray-400 w-48 ml-auto"></div>
                  <p className="text-xs text-gray-500 mt-1">( {sellerName} )</p>
                </div>
              </div>

            </div>
          </ShadcnCardContent>
        </ShadcnCard>
      </div>
      <style jsx global>{`
        // Basic theme variables (customize these for your Shadcn theme)
        :root {
          --background: 255 255 255; // white
          --foreground: 0 0 0; // black

          --card: 255 255 255;
          --card-foreground: 0 0 0;

          --popover: 255 255 255;
          --popover-foreground: 0 0 0;

          --primary: 25 25 112; // midnightblue-ish
          --primary-foreground: 255 255 255;

          --secondary: 240 240 240; // light gray
          --secondary-foreground: 25 25 112;

          --muted: 240 240 240;
          --muted-foreground: 100 100 100; // darker gray

          --accent: 245 245 245;
          --accent-foreground: 25 25 112;

          --destructive: 220 38 38; // red
          --destructive-foreground: 255 255 255;

          --border: 220 220 220; // light gray border
          --input: 220 220 220;
          --ring: 25 25 112;

          --radius: 0.5rem;
        }

        .dark {
          --background: 12 12 12; // very dark gray
          --foreground: 230 230 230; // light gray text

          --card: 24 24 24; // slightly lighter dark
          --card-foreground: 230 230 230;

          --popover: 12 12 12;
          --popover-foreground: 230 230 230;

          --primary: 100 100 250; // lighter blue for dark mode
          --primary-foreground: 12 12 12;

          --secondary: 36 36 36;
          --secondary-foreground: 230 230 230;

          --muted: 36 36 36;
          --muted-foreground: 160 160 160;

          --accent: 48 48 48;
          --accent-foreground: 230 230 230;

          --destructive: 255 80 80; // lighter red
          --destructive-foreground: 12 12 12;

          --border: 48 48 48;
          --input: 48 48 48;
          --ring: 100 100 250;
        }
        body {
            font-family: 'Inter', sans-serif; /* Ensure Inter font is loaded */
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
        }
        .bg-background { background-color: hsl(var(--background)); }
        .text-foreground { color: hsl(var(--foreground)); }
        .bg-card { background-color: hsl(var(--card)); }
        .text-card-foreground { color: hsl(var(--card-foreground)); }
        .text-primary { color: hsl(var(--primary)); }
        .bg-primary { background-color: hsl(var(--primary)); }
        .text-primary-foreground { color: hsl(var(--primary-foreground)); }
        .border-input { border-color: hsl(var(--border)); }
        .ring-ring { box-shadow: 0 0 0 2px hsl(var(--ring)); }
        .text-muted-foreground { color: hsl(var(--muted-foreground)); }
        .bg-destructive { background-color: hsl(var(--destructive)); }
        .text-destructive-foreground { color: hsl(var(--destructive-foreground)); }
        .border { border-color: hsl(var(--border)); }
        .dark .dark\\:bg-slate-800 { background-color: #1e293b; } /* Example dark mode specific class */
        .dark .dark\\:border-slate-700 { border-color: #334155; }
        .dark .dark\\:bg-slate-700\\/50 { background-color: rgba(51, 65, 85, 0.5); }
        .dark .dark\\:text-slate-300 { color: #cbd5e1; }

        // Ensure preview is not affected by dark mode for PDF generation
        .print-friendly-preview {
            background-color: white !important;
            color: black !important;
        }
        .print-friendly-preview * {
            color: black !important; // Force all child text to black
        }
        .print-friendly-preview .text-gray-800 { color: #1f2937 !important; }
        .print-friendly-preview .text-gray-700 { color: #374151 !important; }
        .print-friendly-preview .text-gray-600 { color: #4b5563 !important; }
        .print-friendly-preview .text-gray-500 { color: #6b7280 !important; }
        .print-friendly-preview .bg-gray-100 { background-color: #f3f4f6 !important; }
        .print-friendly-preview .border-gray-200 { border-color: #e5e7eb !important; }

      `}</style>
    </div>
  );
}

export default App;

