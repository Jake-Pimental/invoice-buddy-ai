import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, isPast, parseISO } from "date-fns";
import Header from "@/components/Header";
import UploadInvoice from "@/components/UploadInvoice";
import AIAssistant from "@/components/AIAssistant";
import { Invoice, AIMessage } from "@/types";
import { toast } from "@/components/ui/use-toast";
import {
  SearchIcon,
  FilterIcon,
  DownloadIcon,
  MailIcon,
  PhoneIcon,
  FileTextIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  },
  {
    id: "inv-005",
    clientName: "Acme Corporation",
    amount: 2800,
    dueDate: "2023-09-15",
    status: "pending",
    issueDate: "2023-08-15",
    invoiceNumber: "INV-2023-005",
    clientEmail: "billing@acmecorp.com",
    description: "Additional Development Hours",
    remindersSent: 0
  },
  {
    id: "inv-006",
    clientName: "TechStart Inc.",
    amount: 4500,
    dueDate: "2023-07-30",
    status: "paid",
    issueDate: "2023-06-30",
    invoiceNumber: "INV-2023-006",
    clientEmail: "accounts@techstart.io",
    description: "App Development Phase 1",
    remindersSent: 1
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

const Invoices = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'dueDate' | 'amount' | 'clientName'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSortChange = (field: 'dueDate' | 'amount' | 'clientName') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const filteredInvoices = MOCK_INVOICES
    .filter(invoice => {
      if (activeTab === "all") return true;
      return invoice.status === activeTab;
    })
    .filter(invoice => {
      if (!searchQuery) return true;
      const lowerQuery = searchQuery.toLowerCase();
      return (
        invoice.clientName.toLowerCase().includes(lowerQuery) ||
        invoice.invoiceNumber.toLowerCase().includes(lowerQuery) ||
        invoice.description.toLowerCase().includes(lowerQuery)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else {
        return sortDirection === 'asc'
          ? a.clientName.localeCompare(b.clientName)
          : b.clientName.localeCompare(a.clientName);
      }
    });

  const handleUploadClick = () => {
    setIsUploadOpen(true);
  };

  const handleUploadClose = () => {
    setIsUploadOpen(false);
  };

  const handleUploadComplete = () => {
    toast({
      title: "Upload complete",
      description: "Your invoice has been uploaded successfully.",
    });
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusInfo = (status: Invoice["status"]) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <ClockIcon className="h-3.5 w-3.5 mr-1" />,
          label: "Pending",
        };
      case "overdue":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <AlertCircleIcon className="h-3.5 w-3.5 mr-1" />,
          label: "Overdue",
        };
      case "paid":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />,
          label: "Paid",
        };
      case "partial":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <ClockIcon className="h-3.5 w-3.5 mr-1" />,
          label: "Partial",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: null,
          label: status,
        };
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = parseISO(dueDate);
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isOverdue = (dueDate: string) => {
    return isPast(parseISO(dueDate));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onUploadClick={handleUploadClick} />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold">All Invoices</CardTitle>
                <CardDescription>
                  Manage and track your invoices
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    type="search" 
                    placeholder="Search invoices..." 
                    className="pl-8 w-60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleUploadClick()}>
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Upload Invoice
                </Button>
              </div>
            </div>

            <div className="relative sm:hidden mt-3">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                type="search" 
                placeholder="Search invoices..." 
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
              </TabsList>
              <Separator />
            </div>

            <CardContent className="py-4">
              <TabsContent value={activeTab} className="m-0 pt-1">
                <div className="overflow-hidden rounded-lg border border-gray-100">
                  <table className="w-full min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            className="flex items-center font-medium text-gray-500"
                            onClick={() => handleSortChange('clientName')}
                          >
                            Client / Invoice
                            {sortBy === 'clientName' && (
                              <ArrowUpDown className={cn(
                                "ml-1 h-4 w-4 text-gray-400",
                                sortDirection === 'asc' ? 'transform rotate-180' : ''
                              )} />
                            )}
                          </button>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          <button 
                            className="flex items-center font-medium text-gray-500"
                            onClick={() => handleSortChange('dueDate')}
                          >
                            Due Date
                            {sortBy === 'dueDate' && (
                              <ArrowUpDown className={cn(
                                "ml-1 h-4 w-4 text-gray-400",
                                sortDirection === 'asc' ? 'transform rotate-180' : ''
                              )} />
                            )}
                          </button>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            className="flex items-center justify-end ml-auto font-medium text-gray-500"
                            onClick={() => handleSortChange('amount')}
                          >
                            Amount
                            {sortBy === 'amount' && (
                              <ArrowUpDown className={cn(
                                "ml-1 h-4 w-4 text-gray-400",
                                sortDirection === 'asc' ? 'transform rotate-180' : ''
                              )} />
                            )}
                          </button>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredInvoices.map((invoice) => {
                        const statusInfo = getStatusInfo(invoice.status);
                        const daysOverdue =
                          invoice.status === "overdue" || 
                          (invoice.status === "pending" && isOverdue(invoice.dueDate))
                            ? getDaysOverdue(invoice.dueDate)
                            : 0;
                        
                        return (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                              <div className="text-sm text-gray-500">{invoice.invoiceNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                              <div className="text-sm text-gray-500">
                                {format(parseISO(invoice.dueDate), "MMM d, yyyy")}
                              </div>
                              <div className="text-xs text-gray-400">
                                Issued: {format(parseISO(invoice.issueDate), "MMM d, yyyy")}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "flex items-center text-xs",
                                    statusInfo.color
                                  )}
                                >
                                  {statusInfo.icon}
                                  {statusInfo.label}
                                </Badge>
                                
                                {(invoice.status === "overdue" || 
                                  (invoice.status === "pending" && isOverdue(invoice.dueDate))) && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-100 text-xs"
                                  >
                                    {daysOverdue} days overdue
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              {formatCurrency(invoice.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                {(invoice.status === "pending" || invoice.status === "overdue" || invoice.status === "partial") && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                    onClick={() => handleSendReminder(invoice)}
                                  >
                                    <MailIcon className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                >
                                  <PhoneIcon className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                >
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
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

export default Invoices;
