
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Invoice, AIMessage } from "@/types";
import { BrainIcon, SendIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import our new component
import InvoiceContext from "./ai-assistant/InvoiceContext";
import MessageComposer from "./ai-assistant/MessageComposer";
import QuickSuggestions from "./ai-assistant/QuickSuggestions";
import PreviousMessages from "./ai-assistant/PreviousMessages";

export interface AIAssistantProps {
  invoice?: Invoice | null;
  previousMessages?: AIMessage[];
  onClose: () => void;
  onSendMessage?: (message: Omit<AIMessage, "id" | "createdAt">) => void;
}

const AIAssistant = ({ invoice, previousMessages = [], onClose, onSendMessage }: AIAssistantProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [tone, setTone] = useState<string>("friendly");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (invoice) {
      setSuggestions([
        `Hi ${invoice.clientName}, just a friendly reminder that invoice #${invoice.invoiceNumber} for $${invoice.amount} is due on ${new Date(invoice.dueDate).toLocaleDateString()}. Please let me know if you have any questions.`,
        `${invoice.clientName}, your payment for invoice #${invoice.invoiceNumber} ($${invoice.amount}) is now overdue. Please arrange payment at your earliest convenience.`,
        `We haven't received payment for invoice #${invoice.invoiceNumber} which was due on ${new Date(invoice.dueDate).toLocaleDateString()}. Please contact us if you're experiencing any issues with payment.`
      ]);
    }
  }, [invoice]);

  const handleGenerateMessage = () => {
    if (!invoice) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      let generatedMessage = "";
      
      switch (tone) {
        case "friendly":
          generatedMessage = `Hi ${invoice.clientName},\n\nI hope this message finds you well. Just a friendly reminder that invoice #${invoice.invoiceNumber} for $${invoice.amount} is due on ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nPlease let me know if you have any questions or need assistance with the payment process.\n\nBest regards,\nYour Company`;
          break;
        case "firm":
          generatedMessage = `Dear ${invoice.clientName},\n\nThis is a reminder that invoice #${invoice.invoiceNumber} for $${invoice.amount} is due on ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nWe kindly request that you process this payment by the due date to maintain your good standing.\n\nSincerely,\nYour Company`;
          break;
        case "urgent":
          generatedMessage = `Dear ${invoice.clientName},\n\nYour payment for invoice #${invoice.invoiceNumber} in the amount of $${invoice.amount} is now OVERDUE.\n\nPlease process your payment immediately to avoid any additional fees or actions.\n\nUrgently,\nYour Company`;
          break;
        default:
          generatedMessage = `Hello ${invoice.clientName},\n\nThis is a reminder about invoice #${invoice.invoiceNumber} for $${invoice.amount} due on ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nPlease arrange for payment.\n\nRegards,\nYour Company`;
      }
      
      setMessage(generatedMessage);
      setIsLoading(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        description: "Please generate or write a message first",
      });
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      if (onSendMessage && invoice) {
        onSendMessage({
          invoiceId: invoice.id,
          content: message,
          sentiment: tone as 'neutral' | 'friendly' | 'firm' | 'urgent',
          deliveryStatus: 'sent'
        });
      }
      
      toast({
        description: "Message scheduled for delivery",
      });
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const handleCopySuggestion = (suggestion: string) => {
    setMessage(suggestion);
    toast({
      description: "Suggestion copied to editor",
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BrainIcon className="h-5 w-5 mr-2 text-blue-500" />
            <CardTitle className="text-xl">AI Communication Assistant</CardTitle>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
            Beta
          </Badge>
        </div>
        <CardDescription>
          Generate personalized communications for invoice collection
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <InvoiceContext invoice={invoice} />
        
        <MessageComposer 
          invoice={invoice}
          message={message}
          setMessage={setMessage}
          tone={tone}
          setTone={setTone}
          isLoading={isLoading}
          onGenerateMessage={handleGenerateMessage}
        />
        
        <QuickSuggestions 
          suggestions={suggestions}
          onCopySuggestion={handleCopySuggestion}
        />
        
        <PreviousMessages messages={previousMessages} />
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()}>
          <SendIcon className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
