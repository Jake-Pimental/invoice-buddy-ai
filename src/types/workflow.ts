
export type WorkflowStep = {
  id: string;
  name: string;
  description: string;
  triggerDays: number;
  messageTemplate: string;
  type: "email" | "sms" | "reminder";
  active: boolean;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  active: boolean;
};

export const defaultWorkflows: Workflow[] = [
  {
    id: "wf-001",
    name: "Standard Collection",
    description: "A standard 30-day collection process with regular reminders",
    active: true,
    steps: [
      {
        id: "step-001",
        name: "Initial Reminder",
        description: "Sent 3 days before due date",
        triggerDays: -3,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nThis is a friendly reminder that invoice {{invoiceNumber}} for {{amount}} is due in 3 days on {{dueDate}}.\n\nThank you for your business!\n\nBest regards,\n{{companyName}}",
        active: true
      },
      {
        id: "step-002",
        name: "Due Date Reminder",
        description: "Sent on the due date",
        triggerDays: 0,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nJust a reminder that invoice {{invoiceNumber}} for {{amount}} is due today.\n\nThank you for your business!\n\nBest regards,\n{{companyName}}",
        active: true
      },
      {
        id: "step-003",
        name: "First Follow-up",
        description: "Sent 7 days after due date",
        triggerDays: 7,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nOur records show that invoice {{invoiceNumber}} for {{amount}} is now 7 days overdue. If you have already made the payment, please disregard this message.\n\nIf you have any questions about this invoice, please don't hesitate to contact us.\n\nBest regards,\n{{companyName}}",
        active: true
      },
      {
        id: "step-004",
        name: "Final Notice",
        description: "Sent 14 days after due date",
        triggerDays: 14,
        type: "sms",
        messageTemplate: "IMPORTANT: Invoice {{invoiceNumber}} for {{amount}} is now 14 days past due. Please contact us immediately at {{companyPhone}} to make arrangements for payment.",
        active: true
      }
    ]
  },
  {
    id: "wf-002",
    name: "Gentle Collection",
    description: "A more lenient approach for valued clients",
    active: false,
    steps: [
      {
        id: "step-005",
        name: "Friendly Reminder",
        description: "Sent 7 days after due date",
        triggerDays: 7,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nI hope this message finds you well. I wanted to check in about invoice {{invoiceNumber}} for {{amount}} which was due on {{dueDate}}.\n\nPlease let me know if you have any questions or if there's anything I can assist with regarding this payment.\n\nWarm regards,\n{{companyName}}",
        active: true
      },
      {
        id: "step-006",
        name: "Check-in",
        description: "Sent 14 days after due date",
        triggerDays: 14,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nI'm following up on invoice {{invoiceNumber}} for {{amount}} which was due on {{dueDate}}. We value your business and would appreciate an update on the status of this payment.\n\nIf you're experiencing any issues, please let us know how we can help.\n\nBest regards,\n{{companyName}}",
        active: true
      }
    ]
  }
];
