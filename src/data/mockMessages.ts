
import { Message } from '@/types';

export const mockMessages: Message[] = [
  {
    id: '1',
    invoiceId: 'INV-001',
    clientName: 'Acme Corp',
    type: 'email',
    direction: 'incoming',
    content: 'I just received your invoice and will process it this week.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: 'unread',
    sentiment: 'positive',
    priority: 'medium',
  },
  {
    id: '2',
    invoiceId: 'INV-002',
    clientName: 'Tech Solutions',
    type: 'sms',
    direction: 'incoming',
    content: 'Payment sent just now. Please confirm receipt.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'unread',
    sentiment: 'positive',
    priority: 'high',
  },
  {
    id: '3',
    invoiceId: 'INV-003',
    clientName: 'Global Services',
    type: 'call',
    direction: 'incoming',
    content: 'Called about invoice payment delay. Will pay by Friday.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'read',
    sentiment: 'neutral',
    priority: 'medium',
  },
  {
    id: '4',
    invoiceId: 'INV-004',
    clientName: 'Fresh Supplies',
    type: 'email',
    direction: 'outgoing',
    content: 'Thank you for your payment. Receipt attached.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'read',
    sentiment: 'positive',
    priority: 'low',
  },
  {
    id: '5',
    invoiceId: 'INV-005',
    clientName: 'Johnson & Co',
    type: 'sms',
    direction: 'incoming',
    content: 'Can we discuss a payment plan for this invoice?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'read',
    sentiment: 'negative',
    priority: 'high',
  },
];

export default mockMessages;
