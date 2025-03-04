
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Edit, Mail, Phone, FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const daysOverdue = invoice.status === "overdue" || 
    (invoice.status === "pending" && isOverdue(invoice.dueDate))
      ? getDaysOverdue(invoice.dueDate)
      : 0;

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
            <>
              <Button onClick={onUploadClick} className="mr-2 hidden sm:flex">
                <FileText className="h-4 w-4 mr-2" />
                Upload Invoice
              </Button>
              <Button onClick={onSendReminder} className="mr-2 hidden sm:flex">
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              <Button variant="outline" onClick={onEditClick} className="mr-2">
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
            {statusInfo.icon === "Clock" && <Clock className="h-4 w-4 mr-1" />}
            {statusInfo.icon === "AlertCircle" && <AlertCircle className="h-4 w-4 mr-1" />}
            {statusInfo.icon === "CheckCircle" && <CheckCircle className="h-4 w-4 mr-1" />}
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
        <Button onClick={onUploadClick} className="flex-1">
          <FileText className="h-4 w-4 mr-2" />
          Upload
        </Button>
        <Button onClick={onSendReminder} className="flex-1">
          <Mail className="h-4 w-4 mr-2" />
          Remind
        </Button>
        <Button onClick={() => {}} className="flex-1">
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
      </div>
    </div>
  );
};

export default InvoiceHeader;
