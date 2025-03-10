
import React from "react";
import { format, parseISO } from "date-fns";
import { CheckCircle, Mail, Phone, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types";
import { cn } from "@/lib/utils";
import { isOverdue, formatCurrency } from "@/utils/invoiceUtils";
import EditInvoiceForm from "@/components/EditInvoiceForm";

interface InvoiceInformationProps {
  invoice: Invoice;
  isEditing: boolean;
  onCancelEdit: () => void;
  onSaveChanges: (updatedInvoice: Invoice) => void;
  onMarkAsPaid: () => void;
  onSendReminder: () => void;
}

const InvoiceInformation: React.FC<InvoiceInformationProps> = ({
  invoice,
  isEditing,
  onCancelEdit,
  onSaveChanges,
  onMarkAsPaid,
  onSendReminder
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{isEditing ? "Edit Invoice" : "Invoice Information"}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <EditInvoiceForm 
            invoice={invoice} 
            onCancel={onCancelEdit} 
            onSave={onSaveChanges} 
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Amount</h3>
                <p className="text-2xl font-semibold mt-1">
                  {formatCurrency(invoice.amount)}
                </p>
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
                  isOverdue(invoice) ? "text-red-600 font-medium" : ""
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
                  <Button onClick={onMarkAsPaid} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </Button>
                  <Button onClick={onSendReminder} variant="outline">
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
  );
};

export default InvoiceInformation;
