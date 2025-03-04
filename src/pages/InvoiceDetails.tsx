
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Invoice, AIMessage } from "@/types";
import { fetchInvoiceDetails, fetchInvoiceMessages, updateInvoice } from "@/utils/invoiceUtils";
import InvoiceHeader from "@/components/invoice/InvoiceHeader";
import InvoiceInformation from "@/components/invoice/InvoiceInformation";
import CommunicationHistory from "@/components/invoice/CommunicationHistory";
import PaymentSummary from "@/components/invoice/PaymentSummary";
import ActivityTimeline from "@/components/invoice/ActivityTimeline";
import AIAssistant from "@/components/AIAssistant";
import UploadInvoice from "@/components/UploadInvoice";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <InvoiceHeader
          invoice={invoice}
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onUploadClick={handleUploadClick}
          onSendReminder={handleSendReminder}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InvoiceInformation
              invoice={invoice}
              isEditing={isEditing}
              onCancelEdit={handleCancelEdit}
              onSaveChanges={handleSaveChanges}
              onMarkAsPaid={handleMarkAsPaid}
              onSendReminder={handleSendReminder}
            />

            {!isEditing && (
              <CommunicationHistory
                messages={messages}
                isLoading={isLoadingMessages}
              />
            )}
          </div>

          {!isEditing && (
            <div className="lg:col-span-1">
              <PaymentSummary invoice={invoice} />
              <ActivityTimeline invoice={invoice} />
            </div>
          )}
        </div>
      </div>
      
      {/* Dialogs for Upload and AI Assistant */}
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
