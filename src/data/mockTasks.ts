
import { TaskItem } from '@/types';

const mockTasks: TaskItem[] = [
  {
    id: 'task-001',
    invoiceId: 'INV-005',
    clientName: 'Johnson & Co',
    type: 'payment_plan',
    title: 'Payment Plan Request',
    description: 'Client has requested to pay the invoice in 3 monthly installments due to cash flow issues.',
    amount: 1200,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days from now
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    priority: 'high',
  },
  {
    id: 'task-002',
    invoiceId: 'INV-003',
    clientName: 'Global Services',
    type: 'extension',
    title: 'Due Date Extension',
    description: 'Client has requested an extension of 2 weeks due to internal approval processes.',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days from now
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    priority: 'medium',
  },
  {
    id: 'task-003',
    invoiceId: 'INV-008',
    clientName: 'Evergreen Industries',
    type: 'discount',
    title: 'Discount Request',
    description: 'Client has requested a 5% discount for early payment, offering to pay within 3 days if approved.',
    amount: 950,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    priority: 'high',
  },
  {
    id: 'task-004',
    invoiceId: 'INV-010',
    clientName: 'Metro Solutions',
    type: 'negotiation',
    title: 'Invoice Dispute',
    description: 'Client is disputing the hours billed and requesting a review of the invoice details.',
    amount: 2150,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    priority: 'high',
  },
  {
    id: 'task-005',
    invoiceId: 'INV-012',
    clientName: 'Pacific Consulting',
    type: 'payment_plan',
    title: 'Installment Plan',
    description: 'Client is requesting a 4-month payment plan for their large project invoice.',
    amount: 4500,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString(), // 120 days from now
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    priority: 'medium',
  },
];

export default mockTasks;
