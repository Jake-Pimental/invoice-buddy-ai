
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import InvoiceList from "@/components/InvoiceList";
import AIAssistant from "@/components/AIAssistant";
import UploadInvoice from "@/components/UploadInvoice";
import { DashboardStats, Invoice, AIMessage } from "@/types";
import { toast } from "@/components/ui/use-toast";

const MOCK_INVOICES: Invoice[] = [
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
  },
  {
    id: "inv-004",
    clientName: "City Services Ltd.",
    amount: 4250,
    dueDate: "2023-08-30",
    status: "partial",
    issueDate: "2023-07-30",
    invoiceNumber: "INV-2023-004",
    clientEmail: "ap@cityservices.net",
    description: "Maintenance Contract Q3",
    remindersSent: 0
  }
];

const MOCK_MESSAGES: AIMessage[] = [
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

const MOCK_STATS: DashboardStats = {
  totalUnpaid: 13050,
  totalOverdue: 5600,
  totalCollected: 7250,
  collectionRate: 78,
  averagePaymentTime: 32
};

const Index = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleUploadClick = () => {
    setIsUploadOpen(true);
  };

  const handleUploadClose = () => {
    setIsUploadOpen(false);
  };

  const handleSendReminder = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsAIAssistantOpen(true);
  };

  const handleAssistantClose = () => {
    setIsAIAssistantOpen(false);
    setSelectedInvoice(null);
  };

  const handleSendMessage = (message: Omit<AIMessage, "id" | "createdAt">) => {
    toast({
      title: "Message sent",
      description: "Your message has been queued for delivery.",
    });
    
    handleAssistantClose();
  };
  
  const handleUploadComplete = () => {
    setIsUploadOpen(false);
    toast({
      title: "Success",
      description: "Invoice uploaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onUploadClick={handleUploadClick} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Dashboard stats={MOCK_STATS} />
        
        <InvoiceList 
          invoices={MOCK_INVOICES} 
          onUploadClick={handleUploadClick}
          onSendReminder={handleSendReminder}
        />
      </main>
      
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="sm:max-w-[500px]">
          <UploadInvoice 
            onClose={handleUploadClose}
            onUploadComplete={handleUploadComplete}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAIAssistantOpen} onOpenChange={setIsAIAssistantOpen}>
        <DialogTrigger className="hidden" />
        <DialogContent className="sm:max-w-[600px]">
          <AIAssistant 
            invoice={selectedInvoice}
            previousMessages={selectedInvoice ? MOCK_MESSAGES.filter(msg => msg.invoiceId === selectedInvoice.id) : []}
            onClose={handleAssistantClose}
            onSendMessage={handleSendMessage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
