
import { Invoice } from "@/types";

interface InvoiceContextProps {
  invoice: Invoice | null | undefined;
}

const InvoiceContext = ({ invoice }: InvoiceContextProps) => {
  if (!invoice) return null;
  
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4 animate-slide-up">
      <h3 className="font-medium mb-1">Context</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500">Client</span>
          <span className="font-medium">{invoice.clientName}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Invoice</span>
          <span className="font-medium">#{invoice.invoiceNumber}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Amount</span>
          <span className="font-medium">${invoice.amount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-500">Due Date</span>
          <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceContext;
