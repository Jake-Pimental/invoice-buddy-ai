
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Edit, Mail, Phone, FileText, Clock, AlertCircle, CheckCircle, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Invoice } from "@/types";
import { cn } from "@/lib/utils";
import { getStatusInfo, getDaysOverdue, isOverdue } from "@/utils/invoiceUtils";

interface InvoiceHeaderProps {
  invoice: Invoice;
  isEditing: boolean;
  onEditClick: () => void;
  onUploadClick: () => void;
  onSendReminder: () => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoice,
  isEditing,
  onEditClick,
  onUploadClick,
  onSendReminder
}) => {
  const statusInfo = getStatusInfo(invoice.status);
  const daysOverdue = isOverdue(invoice) ? getDaysOverdue(invoice) : 0;

  return (
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
            <TooltipProvider>
              <div className="hidden sm:flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={onUploadClick} variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Upload Invoice
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Upload a PDF version of this invoice
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={onSendReminder} variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Send Reminder
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Send a payment reminder to the client
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={onEditClick} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Invoice
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Edit invoice details
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
          
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 px-2 py-1",
                statusInfo.color
              )}
            >
              {statusInfo.icon === "Clock" && <Clock className="h-4 w-4" />}
              {statusInfo.icon === "AlertCircle" && <AlertCircle className="h-4 w-4" />}
              {statusInfo.icon === "CheckCircle" && <CheckCircle className="h-4 w-4" />}
              {statusInfo.icon === "PieChart" && <PieChart className="h-4 w-4" />}
              {statusInfo.label}
            </Badge>
            
            {isOverdue(invoice) && (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-100 flex items-center gap-1 px-2 py-1"
              >
                <Clock className="h-4 w-4" />
                {daysOverdue} days overdue
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile action buttons */}
      <div className="flex justify-between mt-4 gap-2 sm:hidden">
        <Button onClick={onUploadClick} variant="outline" className="flex-1 gap-2">
          <FileText className="h-4 w-4" />
          Upload
        </Button>
        <Button onClick={onSendReminder} variant="outline" className="flex-1 gap-2">
          <Mail className="h-4 w-4" />
          Remind
        </Button>
        <Button onClick={() => {}} variant="outline" className="flex-1 gap-2">
          <Phone className="h-4 w-4" />
          Call
        </Button>
      </div>
      
      <Separator className="mt-6" />
    </div>
  );
};

export default InvoiceHeader;
