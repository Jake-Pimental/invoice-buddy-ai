// Add exports to fix errors in InvoiceHeader and InvoiceInformation
import { Invoice } from "@/types";
import { differenceInDays } from "date-fns";

// Function to get the status information of an invoice
export const getStatusInfo = (status: string) => {
  switch (status) {
    case 'paid':
      return { color: 'bg-green-100 text-green-800', icon: 'CheckCircle' };
    case 'overdue':
      return { color: 'bg-red-100 text-red-800', icon: 'AlertCircle' };
    case 'pending':
      return { color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' };
    case 'partial':
      return { color: 'bg-blue-100 text-blue-800', icon: 'PieChart' };
    default:
      return { color: 'bg-gray-100 text-gray-800', icon: 'Circle' };
  }
};

// Function to check if an invoice is overdue
export const isOverdue = (invoice: Invoice) => {
  return invoice.status === 'overdue' || (
    invoice.status === 'pending' && 
    new Date(invoice.dueDate) < new Date()
  );
};

// Function to get days overdue
export const getDaysOverdue = (invoice: Invoice) => {
  if (!isOverdue(invoice)) return 0;
  
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  return differenceInDays(today, dueDate);
};
