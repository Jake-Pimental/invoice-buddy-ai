
import { Invoice, AIMessage } from "@/types";

// Dummy data for development
const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    clientName: "Acme Corporation",
    amount: 2500,
    dueDate: "2023-12-30",
    status: "pending",
    issueDate: "2023-12-01",
    invoiceNumber: "INV-2023-001",
    clientEmail: "billing@acme.com",
    clientPhone: "+1234567890",
    description: "Website Development Services",
    remindersSent: 0,
    lastContactDate: "2023-12-05",
    notes: "Client requested detailed breakdown of hours."
  },
  {
    id: "inv-002",
    clientName: "Globex Inc",
    amount: 4750,
    dueDate: "2023-11-15",
    status: "overdue",
    issueDate: "2023-10-15",
    invoiceNumber: "INV-2023-002",
    clientEmail: "accounts@globex.com",
    description: "Monthly Retainer - November",
    remindersSent: 2,
    lastContactDate: "2023-11-28",
    notes: "Promised payment by end of month."
  },
  {
    id: "inv-003",
    clientName: "Stark Industries",
    amount: 12000,
    dueDate: "2023-12-20",
    status: "pending",
    issueDate: "2023-12-05",
    invoiceNumber: "INV-2023-003",
    clientEmail: "finance@stark.com",
    clientPhone: "+1987654321",
    description: "Product Design Consultation",
    remindersSent: 0
  },
  {
    id: "inv-004",
    clientName: "Wayne Enterprises",
    amount: 8500,
    dueDate: "2023-11-30",
    status: "partial",
    issueDate: "2023-11-01",
    invoiceNumber: "INV-2023-004",
    clientEmail: "ap@wayne.com",
    description: "Security System Upgrade",
    remindersSent: 1,
    lastContactDate: "2023-11-25",
    notes: "Paid 50%. Remainder due after testing."
  },
  {
    id: "inv-005",
    clientName: "Umbrella Corporation",
    amount: 6300,
    dueDate: "2023-10-31",
    status: "overdue",
    issueDate: "2023-10-01",
    invoiceNumber: "INV-2023-005",
    clientEmail: "billing@umbrella.com",
    clientPhone: "+1122334455",
    description: "Research Project Phase 1",
    remindersSent: 3,
    lastContactDate: "2023-12-01",
    notes: "Escalated to legal department."
  },
  {
    id: "inv-006",
    clientName: "Los Pollos Hermanos",
    amount: 1800,
    dueDate: "2023-12-15",
    status: "pending",
    issueDate: "2023-12-01",
    invoiceNumber: "INV-2023-006",
    clientEmail: "orders@lph.com",
    description: "Marketing Campaign",
    remindersSent: 0
  },
  {
    id: "inv-007",
    clientName: "Dunder Mifflin",
    amount: 950,
    dueDate: "2023-11-20",
    status: "paid",
    issueDate: "2023-11-01",
    invoiceNumber: "INV-2023-007",
    clientEmail: "accounting@dundermifflin.com",
    clientPhone: "+1567891234",
    description: "Paper Supply - November",
    remindersSent: 0,
    lastContactDate: "2023-11-18",
    notes: "Paid on time."
  },
  {
    id: "inv-008",
    clientName: "Oceanic Airlines",
    amount: 15200,
    dueDate: "2023-12-10",
    status: "overdue",
    issueDate: "2023-11-10",
    invoiceNumber: "INV-2023-008",
    clientEmail: "finance@oceanic.com",
    description: "Booking System Maintenance",
    remindersSent: 1,
    lastContactDate: "2023-12-05",
    notes: "Delayed due to technical review."
  }
];

// Dummy messages for development
const mockAIMessages: AIMessage[] = [
  {
    id: "msg-001",
    invoiceId: "inv-001",
    content: "Just a friendly reminder that invoice INV-2023-001 for $2,500 is due on December 30th. Please let me know if you have any questions!",
    sentiment: "friendly",
    createdAt: "2023-12-10T14:30:00Z",
    deliveryStatus: "sent"
  },
  {
    id: "msg-002",
    invoiceId: "inv-002",
    content: "This is a reminder that invoice INV-2023-002 for $4,750 was due on November 15th and is now overdue. Please arrange for payment as soon as possible.",
    sentiment: "firm",
    createdAt: "2023-11-25T10:15:00Z",
    deliveryStatus: "delivered"
  },
  {
    id: "msg-003",
    invoiceId: "inv-002",
    content: "Your invoice INV-2023-002 is now significantly overdue. Please contact us immediately to arrange payment or discuss payment options.",
    sentiment: "urgent",
    createdAt: "2023-12-05T09:00:00Z",
    deliveryStatus: "delivered"
  }
];

// Function to fetch all invoices 
export const fetchInvoices = async (): Promise<Invoice[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockInvoices);
    }, 500);
  });
};

// Function to fetch single invoice details
export const fetchInvoiceDetails = async (id: string): Promise<Invoice | null> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const invoice = mockInvoices.find(inv => inv.id === id) || null;
      resolve(invoice);
    }, 500);
  });
};

// Function to update an invoice
export const updateInvoice = async (updatedInvoice: Invoice): Promise<Invoice> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Just return the updated invoice as if it was saved to the database
      resolve(updatedInvoice);
    }, 500);
  });
};

// Function to fetch messages for an invoice
export const fetchInvoiceMessages = async (invoiceId: string): Promise<AIMessage[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const messages = mockAIMessages.filter(msg => msg.invoiceId === invoiceId);
      resolve(messages);
    }, 500);
  });
};

// Utility function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};
