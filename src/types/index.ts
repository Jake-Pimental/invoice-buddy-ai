
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

export interface Message {
  id: string;
  invoiceId: string;
  clientName: string;
  type: 'email' | 'sms' | 'call';
  direction: 'incoming' | 'outgoing';
  content: string;
  timestamp: string;
  status: 'read' | 'unread';
  sentiment?: 'positive' | 'neutral' | 'negative';
  priority?: 'high' | 'medium' | 'low';
}
