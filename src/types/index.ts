
export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid' | 'partial';
  issueDate: string;
  invoiceNumber: string;
  clientEmail: string;
  clientPhone?: string;
  description: string;
  remindersSent: number;
  lastContactDate?: string;
  notes?: string;
}

export interface AIMessage {
  id: string;
  invoiceId: string;
  content: string;
  sentiment: 'neutral' | 'friendly' | 'firm' | 'urgent';
  createdAt: string;
  deliveryStatus: 'draft' | 'sent' | 'delivered' | 'failed';
}

export interface DashboardStats {
  totalUnpaid: number;
  totalOverdue: number;
  totalCollected: number;
  collectionRate: number;
  averagePaymentTime: number;
}
