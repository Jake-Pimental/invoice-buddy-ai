
// Add exports to fix errors in InvoiceHeader and InvoiceInformation
import { Invoice, AIMessage, Message } from "@/types";
import { differenceInDays } from "date-fns";

// Function to get the status information of an invoice
export const getStatusInfo = (status: string) => {
  switch (status) {
    case 'paid':
      return { color: 'bg-green-100 text-green-800', icon: 'CheckCircle', label: 'Paid' };
    case 'overdue':
      return { color: 'bg-red-100 text-red-800', icon: 'AlertCircle', label: 'Overdue' };
    case 'pending':
      return { color: 'bg-yellow-100 text-yellow-800', icon: 'Clock', label: 'Pending' };
    case 'partial':
      return { color: 'bg-blue-100 text-blue-800', icon: 'PieChart', label: 'Partial Payment' };
    default:
      return { color: 'bg-gray-100 text-gray-800', icon: 'Circle', label: 'Unknown' };
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

// Format currency helper function
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Mock API functions for invoice data
export const fetchInvoiceDetails = async (id: string): Promise<Invoice> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id,
    clientName: "Acme Corporation",
    amount: 1299.99,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    issueDate: new Date().toISOString(),
    invoiceNumber: "INV-2023-001",
    clientEmail: "billing@acmecorp.com",
    clientPhone: "+1 (555) 123-4567",
    description: "Web Development Services - June 2023",
    remindersSent: 0,
    lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Client requested itemized breakdown of services."
  };
};

export const fetchInvoiceMessages = async (id: string): Promise<AIMessage[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: "msg-1",
      invoiceId: id,
      content: "Hello, just checking in about invoice #INV-2023-001. Payment is due in 7 days.",
      sentiment: "friendly",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryStatus: "delivered"
    },
    {
      id: "msg-2",
      invoiceId: id,
      content: "This is a friendly reminder that invoice #INV-2023-001 is due soon. Please let us know if you have any questions.",
      sentiment: "friendly",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryStatus: "delivered"
    }
  ];
};

export const updateInvoice = async (invoice: Invoice): Promise<Invoice> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the updated invoice (in a real app this would be handled by the server)
  return invoice;
};
