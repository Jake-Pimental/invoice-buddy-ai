
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import InvoiceList from "@/components/InvoiceList";
import UploadInvoice from "@/components/UploadInvoice";
import AIAssistant from "@/components/AIAssistant";
import { Invoice, AIMessage, DashboardStats } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, addDays } from "date-fns";

const Index = () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [messageHistory, setMessageHistory] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Dashboard stats
  const [stats, setStats] = useState<DashboardStats>({
    totalUnpaid: 0,
    totalOverdue: 0,
    totalCollected: 37500,
    collectionRate: 78,
    averagePaymentTime: 32,
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockInvoices: Invoice[] = [
        {
          id: "inv-001",
          clientName: "Acme Corporation",
          amount: 12500,
          issueDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
          dueDate: format(subDays(new Date(), 5), "yyyy-MM-dd"),
          status: "overdue",
          invoiceNumber: "INV-2023-001",
          clientEmail: "billing@acmecorp.com",
          description: "Web development services",
          remindersSent: 2,
          lastContactDate: format(subDays(new Date(), 3), "yyyy-MM-dd"),
        },
        {
          id: "inv-002",
          clientName: "Globex Industries",
          amount: 8750,
          issueDate: format(subDays(new Date(), 20), "yyyy-MM-dd"),
          dueDate: format(addDays(new Date(), 10), "yyyy-MM-dd"),
          status: "pending",
          invoiceNumber: "INV-2023-002",
          clientEmail: "accounts@globex.com",
          description: "UI/UX design project",
          remindersSent: 1,
          lastContactDate: format(subDays(new Date(), 7), "yyyy-MM-dd"),
        },
        {
          id: "inv-003",
          clientName: "Stark Enterprises",
          amount: 15000,
          issueDate: format(subDays(new Date(), 45), "yyyy-MM-dd"),
          dueDate: format(subDays(new Date(), 15), "yyyy-MM-dd"),
          status: "partial",
          invoiceNumber: "INV-2023-003",
          clientEmail: "finance@stark.com",
          description: "Mobile app development",
          remindersSent: 3,
          lastContactDate: format(subDays(new Date(), 2), "yyyy-MM-dd"),
          notes: "Client has committed to paying remainder by end of month",
        },
        {
          id: "inv-004",
          clientName: "Wayne Industries",
          amount: 5200,
          issueDate: format(subDays(new Date(), 25), "yyyy-MM-dd"),
          dueDate: format(addDays(new Date(), 5), "yyyy-MM-dd"),
          status: "pending",
          invoiceNumber: "INV-2023-004",
          clientEmail: "ap@wayne.com",
          description: "Consulting services",
          remindersSent: 0,
        },
        {
          id: "inv-005",
          clientName: "Oscorp",
          amount: 9000,
          issueDate: format(subDays(new Date(), 60), "yyyy-MM-dd"),
          dueDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
          status: "paid",
          invoiceNumber: "INV-2023-005",
          clientEmail: "payments@oscorp.com",
          description: "Software licensing",
          remindersSent: 2,
          lastContactDate: format(subDays(new Date(), 25), "yyyy-MM-dd"),
          notes: "Paid in full after 2nd reminder",
        },
      ];

      setInvoices(mockInvoices);
      
      // Update stats based on invoices
      const unpaidInvoices = mockInvoices.filter(inv => inv.status !== 'paid');
      const overdueInvoices = mockInvoices.filter(inv => inv.status === 'overdue');
      
      setStats({
        ...stats,
        totalUnpaid: unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0),
        totalOverdue: overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      });
      
      // Mock message history
      const mockMessages: AIMessage[] = [
        {
          id: "msg-001",
          invoiceId: "inv-001",
          content: "Hi Acme Corporation, this is a friendly reminder that invoice INV-2023-001 for $12,500 is now overdue. Please let us know when we can expect payment.",
          sentiment: "friendly",
          createdAt: format(subDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss"),
          deliveryStatus: "delivered",
        },
        {
          id: "msg-002",
          invoiceId: "inv-002",
          content: "Hello Globex Industries, just a reminder that invoice INV-2023-002 for $8,750 is due in 10 days. Please let me know if you have any questions.",
          sentiment: "neutral",
          createdAt: format(subDays(new Date(), 7), "yyyy-MM-dd'T'HH:mm:ss"),
          deliveryStatus: "delivered",
        },
      ];
      
      setMessageHistory(mockMessages);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleOpenUploadDialog = () => {
    setShowUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setShowUploadDialog(false);
  };

  const handleUploadComplete = () => {
    toast({
      description: "Invoice added to your collection queue",
    });
    
    // In a real app, we'd add the new invoice to the list
    // Here we'll just simulate it for demo purposes
    setTimeout(() => {
      const newInvoice: Invoice = {
        id: `inv-00${invoices.length + 1}`,
        clientName: "New Client Inc.",
        amount: 3200,
        issueDate: format(new Date(), "yyyy-MM-dd"),
        dueDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
        status: "pending",
        invoiceNumber: `INV-2023-00${invoices.length + 1}`,
        clientEmail: "billing@newclient.com",
        description: "Professional services",
        remindersSent: 0,
      };
      
      setInvoices([...invoices, newInvoice]);
      
      // Update stats
      setStats({
        ...stats,
        totalUnpaid: stats.totalUnpaid + newInvoice.amount,
      });
    }, 500);
  };

  const handleSendReminder = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowAIDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header onUploadClick={handleOpenUploadDialog} />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8 animate-fade-in">
        <div className="space-y-8">
          <Dashboard stats={stats} />
          
          <InvoiceList 
            invoices={invoices} 
            onUploadClick={handleOpenUploadDialog}
            onSendReminder={handleSendReminder}
          />
        </div>
      </main>
      
      {/* Upload Invoice Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-xl p-0" showCloseButton={false}>
          <UploadInvoice 
            onClose={handleCloseUploadDialog}
            onUploadComplete={handleUploadComplete}
          />
        </DialogContent>
      </Dialog>
      
      {/* AI Assistant Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-3xl p-0" showCloseButton={false}>
          <AIAssistant 
            invoice={selectedInvoice}
            messageHistory={messageHistory.filter(
              msg => msg.invoiceId === selectedInvoice?.id
            )}
            onClose={() => setShowAIDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
