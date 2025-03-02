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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Invoice, AIMessage } from "@/types";
import { BrainIcon, SendIcon, RefreshCcwIcon, ClipboardCheckIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
        {invoice && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4 animate-slide-up">
            <h3 className="font-medium mb-1">Context</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Client</span>
                <span className="font-medium">{invoice.clientName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Invoice</span>
                <span className="font-medium">#{invoice.invoiceNumber}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">${invoice.amount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Message Tone</h3>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="firm">Firm</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleGenerateMessage}
            disabled={isLoading || !invoice}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCcwIcon className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BrainIcon className="h-4 w-4 mr-2" />
                Generate AI Message
              </>
            )}
          </Button>
          
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message will appear here..."
            className="min-h-[200px] resize-none mt-2"
          />
        </div>
        
        {suggestions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Quick Suggestions</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-sm p-3 border rounded-lg cursor-pointer transition-all duration-200",
                    "hover:border-blue-300 hover:bg-blue-50/50"
                  )}
                  onClick={() => handleCopySuggestion(suggestion)}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-600 line-clamp-2">{suggestion}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-gray-400 hover:text-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySuggestion(suggestion);
                      }}
                    >
                      <ClipboardCheckIcon className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {previousMessages.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center my-3">
              <Separator className="flex-1" />
              <span className="mx-2 text-xs text-gray-400">PREVIOUS MESSAGES</span>
              <Separator className="flex-1" />
            </div>
            <div className="space-y-2">
              {previousMessages.map((msg) => (
                <div key={msg.id} className="text-sm p-3 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString()} • {msg.deliveryStatus}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={
                        msg.sentiment === "friendly" 
                          ? "bg-green-50 text-green-600" 
                          : msg.sentiment === "firm" 
                          ? "bg-blue-50 text-blue-600" 
                          : "bg-orange-50 text-orange-600"
                      }
                    >
                      {msg.sentiment}
                    </Badge>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
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
