import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ChevronLeft, 
  Download, 
  Mail, 
  Phone, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  History,
  Edit,
  Save,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, isPast } from "date-fns";
import { Invoice, AIMessage } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import EditInvoiceForm from "@/components/EditInvoiceForm";
import AIAssistant from "@/components/AIAssistant";
import UploadInvoice from "@/components/UploadInvoice";

const fetchInvoiceDetails = async (id: string): Promise<Invoice> => {
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

  return new Promise((resolve) => {
    setTimeout(() => {
      const invoice = mockInvoices.find(inv => inv.id === id);
      if (invoice) {
        resolve(invoice as Invoice);
      } else {
        throw new Error("Invoice not found");
      }
    }, 500);
  });
};

const fetchInvoiceMessages = async (invoiceId: string): Promise<AIMessage[]> => {
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

const updateInvoice = async (invoice: Invoice): Promise<Invoice> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(invoice);
    }, 500);
  });
};

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  
  const { 
    data: invoice, 
    isLoading: isLoadingInvoice, 
    error: invoiceError,
    refetch 
  } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => fetchInvoiceDetails(id || ''),
    enabled: !!id,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['invoiceMessages', id],
    queryFn: () => fetchInvoiceMessages(id || ''),
    enabled: !!id,
  });

  const handleMarkAsPaid = () => {
    if (!invoice) return;
    
    updateInvoice({ ...invoice, status: 'paid' })
      .then(() => {
        refetch();
        toast({
          title: "Invoice marked as paid",
          description: "The invoice has been marked as paid successfully.",
        });
      });
  };

  const handleSendReminder = () => {
    if (!invoice) return;
    setIsAIAssistantOpen(true);
  };

  const handleUploadClick = () => {
    setIsUploadOpen(true);
  };

  const handleUploadClose = () => {
    setIsUploadOpen(false);
  };

  const handleUploadComplete = () => {
    setIsUploadOpen(false);
    toast({
      title: "Upload complete",
      description: "Your invoice has been uploaded successfully.",
    });
  };

  const handleAssistantClose = () => {
    setIsAIAssistantOpen(false);
  };

  const handleSendMessage = (message: Omit<AIMessage, "id" | "createdAt">) => {
    toast({
      title: "Message sent",
      description: "Your message has been queued for delivery.",
    });
    
    handleAssistantClose();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = (updatedInvoice: Invoice) => {
    updateInvoice(updatedInvoice)
      .then(() => {
        setIsEditing(false);
        refetch();
        toast({
          title: "Invoice updated",
          description: "The invoice has been updated successfully.",
        });
      })
      .catch(error => {
        toast({
          title: "Update failed",
          description: "There was an error updating the invoice.",
          variant: "destructive"
        });
      });
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
          icon: <Clock className="h-4 w-4 mr-1" />,
          label: "Pending",
        };
      case "overdue":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          label: "Overdue",
        };
      case "paid":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          label: "Paid",
        };
      case "partial":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Clock className="h-4 w-4 mr-1" />,
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

  if (isLoadingInvoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (invoiceError || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Invoice Not Found</h1>
          <p className="mt-2 text-gray-600">We couldn't find the invoice you're looking for. It may have been deleted or the ID is incorrect.</p>
          <Button className="mt-6" asChild>
            <Link to="/invoices">Back to Invoices</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(invoice.status);
  const daysOverdue = invoice.status === "overdue" || 
    (invoice.status === "pending" && isOverdue(invoice.dueDate))
      ? getDaysOverdue(invoice.dueDate)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            to="/invoices" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Invoices
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Invoice #{invoice.invoiceNumber}
              </h1>
              <p className="text-gray-500 mt-1">
                {invoice.description}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
              {!isEditing && (
                <>
                  <Button onClick={handleUploadClick} className="mr-2 hidden sm:flex">
                    <FileTextIcon className="h-4 w-4 mr-2" />
                    Upload Invoice
                  </Button>
                  <Button onClick={handleSendReminder} className="mr-2 hidden sm:flex">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                  <Button variant="outline" onClick={handleEditClick} className="mr-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Invoice
                  </Button>
                </>
              )}
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center text-sm px-3 py-1",
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
                  className="bg-red-50 text-red-700 border-red-100 text-sm px-3 py-1"
                >
                  {daysOverdue} days overdue
                </Badge>
              )}
            </div>
          </div>
          
          {/* Mobile action buttons */}
          <div className="flex justify-between mt-4 gap-2 sm:hidden">
            <Button onClick={handleUploadClick} className="flex-1">
              <FileTextIcon className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button onClick={handleSendReminder} className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Remind
            </Button>
            <Button onClick={() => {}} className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{isEditing ? "Edit Invoice" : "Invoice Information"}</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <EditInvoiceForm 
                    invoice={invoice} 
                    onCancel={handleCancelEdit} 
                    onSave={handleSaveChanges} 
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                        <p className="text-2xl font-semibold mt-1">{formatCurrency(invoice.amount)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Client</h3>
                        <p className="text-lg font-medium mt-1">{invoice.clientName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Issue Date</h3>
                        <p className="text-base mt-1">{format(parseISO(invoice.issueDate), "MMMM d, yyyy")}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                        <p className={cn(
                          "text-base mt-1", 
                          invoice.status === "overdue" || (invoice.status === "pending" && isOverdue(invoice.dueDate)) 
                            ? "text-red-600 font-medium" 
                            : ""
                        )}>
                          {format(parseISO(invoice.dueDate), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="text-base mt-1">{invoice.clientEmail}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p className="text-base mt-1">{invoice.clientPhone || "Not provided"}</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="text-base mt-2">{invoice.description}</p>
                    </div>

                    {invoice.notes && (
                      <>
                        <Separator className="my-6" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                          <p className="text-base mt-2 text-gray-700">{invoice.notes}</p>
                        </div>
                      </>
                    )}

                    <div className="mt-8 flex flex-wrap gap-3">
                      {invoice.status !== 'paid' && (
                        <>
                          <Button onClick={handleMarkAsPaid} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </Button>
                          <Button onClick={handleSendReminder} variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </Button>
                        </>
                      )}
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Client
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {!isEditing && (
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Communication History
                  </CardTitle>
                  <CardDescription>
                    Previous reminders and messages sent to the client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMessages ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading messages...</p>
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="border border-gray-100 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <Avatar>
                                <Mail className="h-4 w-4" />
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">Email Reminder</p>
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-100"
                                  >
                                    {message.sentiment}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500">
                                  Sent on {format(parseISO(message.createdAt), "MMMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700 border-green-100"
                            >
                              {message.deliveryStatus}
                            </Badge>
                          </div>
                          <p className="mt-3 text-gray-700 text-sm">{message.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto" />
                      <p className="mt-4 text-gray-600">No messages have been sent for this invoice yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {!isEditing && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Subtotal</span>
                      <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Tax</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-base font-medium">Total</span>
                      <span className="text-lg font-semibold">{formatCurrency(invoice.amount)}</span>
                    </div>
                    
                    {invoice.status === 'partial' && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-green-600">
                          <span className="text-sm font-medium">Paid</span>
                          <span className="font-medium">{formatCurrency(invoice.amount * 0.5)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span className="text-sm font-medium">Remaining</span>
                          <span className="font-medium">{formatCurrency(invoice.amount * 0.5)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {invoice.status !== 'paid' && (
                    <div className="mt-6">
                      <Button className="w-full">Send Payment Link</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
                    
                    <div className="space-y-6">
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">Invoice created</p>
                        <p className="text-xs text-gray-500">{format(parseISO(invoice.issueDate), "MMMM d, yyyy")}</p>
                      </div>
                      
                      {invoice.remindersSent > 0 && (
                        <div className="relative pl-10">
                          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                            <Mail className="h-3 w-3 text-yellow-600" />
                          </div>
                          <p className="text-sm font-medium">First reminder sent</p>
                          <p className="text-xs text-gray-500">{format(parseISO(invoice.lastContactDate || invoice.dueDate), "MMMM d, yyyy")}</p>
                        </div>
                      )}
                      
                      {invoice.status === 'paid' && (
                        <div className="relative pl-10">
                          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <p className="text-sm font-medium">Payment received</p>
                          <p className="text-xs text-gray-500">August 30, 2023</p>
                        </div>
                      )}
                      
                      {invoice.status === 'overdue' && (
                        <div className="relative pl-10">
                          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertCircle className="h-3 w-3 text-red-600" />
                          </div>
                          <p className="text-sm font-medium">Invoice overdue</p>
                          <p className="text-xs text-gray-500">{format(parseISO(invoice.dueDate), "MMMM d, yyyy")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      {/* Add the dialogs for Upload and AI Assistant */}
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
            invoice={invoice}
            previousMessages={messages || []}
            onClose={handleAssistantClose}
            onSendMessage={handleSendMessage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceDetails;
