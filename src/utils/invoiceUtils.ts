import { parseISO, isPast, format } from "date-fns";
import { Invoice } from "@/types";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getStatusInfo = (status: Invoice["status"]) => {
  switch (status) {
    case "pending":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "Clock",
        label: "Pending",
      };
    case "overdue":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "AlertCircle",
        label: "Overdue",
      };
    case "paid":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "CheckCircle",
        label: "Paid",
      };
    case "partial":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: "Clock",
        label: "Partial",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "",
        label: status,
      };
  }
};

export const getDaysOverdue = (dueDate: string) => {
  const today = new Date();
  const due = parseISO(dueDate);
  const diffTime = Math.abs(today.getTime() - due.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isOverdue = (dueDate: string) => {
  return isPast(parseISO(dueDate));
};

export const fetchInvoiceDetails = async (id: string): Promise<Invoice> => {
  const mockInvoices = [
    {
      id: "inv-001",
      clientName: "Acme Corporation",
      amount: 5600,
      dueDate: "2023-08-15",
      status: "overdue",
      issueDate: "2023-07-15",
      invoiceNumber: "INV-2023-001",
      clientEmail: "billing@acmecorp.com",
      clientPhone: "555-123-4567",
      description: "Website Development Services",
      remindersSent: 2,
      lastContactDate: "2023-08-20",
      notes: "Client requested payment extension until end of month."
    },
    {
      id: "inv-002",
      clientName: "TechStart Inc.",
      amount: 3200,
      dueDate: "2023-09-01",
      status: "pending",
      issueDate: "2023-08-01",
      invoiceNumber: "INV-2023-002",
      clientEmail: "accounts@techstart.io",
      description: "Monthly Consulting Retainer",
      remindersSent: 1,
      lastContactDate: "2023-08-25"
    },
    {
      id: "inv-003",
      clientName: "Global Designs",
      amount: 1800,
      dueDate: "2023-08-20",
      status: "paid",
      issueDate: "2023-07-20",
      invoiceNumber: "INV-2023-003",
      clientEmail: "finance@globaldesigns.com",
      clientPhone: "555-987-6543",
      description: "Logo Design and Branding Package",
      remindersSent: 0
    }
  ];

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const invoice = mockInvoices.find(inv => inv.id === id);
      if (invoice) {
        resolve(invoice as Invoice);
      } else {
        reject(new Error("Invoice not found"));
      }
    }, 500);
  });
};

export const fetchInvoiceMessages = async (invoiceId: string): Promise<AIMessage[]> => {
  const mockMessages = [
    {
      id: "msg-001",
      invoiceId: "inv-001",
      content: "Hello Acme Corporation, I hope this message finds you well. I wanted to follow up on invoice #INV-2023-001 for $5,600 which was due on August 15th. Please let me know if there's anything I can help with to facilitate the payment process.",
      sentiment: "friendly",
      createdAt: "2023-08-16",
      deliveryStatus: "delivered"
    },
    {
      id: "msg-002",
      invoiceId: "inv-001",
      content: "Hi Acme Corporation, this is a gentle reminder about your outstanding payment for invoice #INV-2023-001 for $5,600. It's now 5 days past the due date of August 15th. Could you please provide an update on when we might expect payment?",
      sentiment: "friendly",
      createdAt: "2023-08-20",
      deliveryStatus: "delivered"
    },
    {
      id: "msg-003",
      invoiceId: "inv-002",
      content: "Hello TechStart Inc., I hope you're doing well. This is a friendly reminder that invoice #INV-2023-002 for $3,200 is due on September 1st. Please let me know if you have any questions about the invoice.",
      sentiment: "friendly",
      createdAt: "2023-08-25",
      deliveryStatus: "delivered"
    }
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      const messages = mockMessages.filter(msg => msg.invoiceId === invoiceId);
      resolve(messages as AIMessage[]);
    }, 500);
  });
};

export const updateInvoice = async (invoice: Invoice): Promise<Invoice> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(invoice);
    }, 500);
  });
};

export const generateAIReply = (
  message: {
    content: string;
    sentiment: string;
    subject: string;
  }
): {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
  subject: string;
  sentiment: string;
  deliveryStatus: string;
} => {
  let reply = "";
  
  if (message.sentiment === "urgent") {
    reply = "I'm sorry, but I can't assist with that right now.";
  } else {
    reply = "I hope this message finds you well. I wanted to follow up on your invoice and provide some additional information.";
  }

  return {
    id: Date.now().toString(),
    sender: "AI Assistant",
    content: reply,
    createdAt: new Date().toISOString(),
    subject: `Re: ${message.subject}`,
    sentiment: message.sentiment === "urgent" ? "firm" : "friendly",
    deliveryStatus: "sent",
  };
};
