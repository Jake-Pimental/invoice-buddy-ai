
import { useState } from "react";
import { Link } from "react-router-dom";
import { Invoice } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/EmptyState";
import {
  MoreHorizontalIcon,
  MailIcon,
  PhoneIcon,
  FileTextIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  Eye,
} from "lucide-react";
import { format, isPast, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface InvoiceListProps {
  invoices: Invoice[];
  onUploadClick: () => void;
  onSendReminder: (invoice: Invoice) => void;
}

const InvoiceList = ({ invoices, onUploadClick, onSendReminder }: InvoiceListProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredInvoices = invoices.filter((invoice) => {
    if (activeTab === "all") return true;
    return invoice.status === activeTab;
  });

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const isOverdue = (dueDate: string) => {
    return isPast(parseISO(dueDate));
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = parseISO(dueDate);
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Invoices</CardTitle>
            <CardDescription>
              Manage and track your unpaid invoices
            </CardDescription>
          </div>
          <Button size="sm" onClick={onUploadClick} className="hidden sm:flex">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Upload Invoice
          </Button>
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
            {filteredInvoices.length === 0 ? (
              <EmptyState
                title="No invoices found"
                description={
                  activeTab === "all"
                    ? "Upload your first invoice to get started with automated collection."
                    : `You don't have any ${activeTab} invoices right now.`
                }
                buttonText="Upload Invoice"
                onButtonClick={onUploadClick}
                illustration={
                  <FileTextIcon className="h-12 w-12 text-gray-300" />
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredInvoices.map((invoice) => {
                  const statusInfo = getStatusInfo(invoice.status);
                  const daysOverdue =
                    invoice.status === "overdue" || 
                    (invoice.status === "pending" && isOverdue(invoice.dueDate))
                      ? getDaysOverdue(invoice.dueDate)
                      : 0;

                  return (
                    <div
                      key={invoice.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 ease-apple animate-slide-in-right"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="mb-2 sm:mb-0 sm:mr-6">
                          <Link to={`/invoices/${invoice.id}`} className="hover:text-blue-600">
                            <h3 className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                              {invoice.clientName}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span className="truncate max-w-[150px] sm:max-w-[250px]">
                                #{invoice.invoiceNumber}
                              </span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span>
                                {formatCurrency(invoice.amount)}
                              </span>
                            </div>
                          </Link>
                        </div>

                        <div className="flex flex-wrap gap-2 my-2 sm:my-0">
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

                          {invoice.remindersSent > 0 && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-100 text-xs"
                            >
                              {invoice.remindersSent} reminder{invoice.remindersSent > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end mt-3 sm:mt-0">
                        <div className="flex sm:mr-4 text-sm text-gray-500">
                          <span>Due: {format(parseISO(invoice.dueDate), "MMM d, yyyy")}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            asChild
                          >
                            <Link to={`/invoices/${invoice.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                            onClick={() => onSendReminder(invoice)}
                          >
                            <MailIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500"
                          >
                            <PhoneIcon className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500"
                              >
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/invoices/${invoice.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default InvoiceList;
