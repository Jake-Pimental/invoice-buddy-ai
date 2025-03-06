
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Mail, MessageSquare } from 'lucide-react';

interface ComposeMessageProps {
  invoiceId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  isOpen: boolean;
  onClose: () => void;
  onMessageSent: () => void;
}

const ComposeMessage: React.FC<ComposeMessageProps> = ({
  invoiceId,
  clientName,
  clientEmail,
  clientPhone,
  isOpen,
  onClose,
  onMessageSent,
}) => {
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');
  const [recipient, setRecipient] = useState(messageType === 'email' ? clientEmail || '' : clientPhone || '');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update recipient when message type changes
  React.useEffect(() => {
    setRecipient(messageType === 'email' ? clientEmail || '' : clientPhone || '');
  }, [messageType, clientEmail, clientPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient) {
      toast({
        title: "Missing recipient",
        description: "Please enter a recipient",
        variant: "destructive",
      });
      return;
    }
    
    if (!content) {
      toast({
        title: "Missing content",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      console.log('Sending message:', {
        type: messageType,
        recipient,
        subject: messageType === 'email' ? subject : undefined,
        content,
        invoiceId,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent",
        description: `Your ${messageType} has been sent successfully.`,
      });
      
      // Clear form
      setSubject('');
      setContent('');
      
      // Close dialog and refresh
      onMessageSent();
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {messageType === 'email' ? (
              <Mail className="h-5 w-5" />
            ) : (
              <MessageSquare className="h-5 w-5" />
            )}
            Compose {messageType === 'email' ? 'Email' : 'SMS'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right pt-2" htmlFor="message-type">Type</Label>
            <div className="col-span-3">
              <Select 
                value={messageType} 
                onValueChange={(value: 'email' | 'sms') => setMessageType(value)}
              >
                <SelectTrigger id="message-type">
                  <SelectValue placeholder="Select a message type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right pt-2" htmlFor="recipient">
              {messageType === 'email' ? 'To' : 'Phone Number'}
            </Label>
            <div className="col-span-3">
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={messageType === 'email' ? 'email@example.com' : '+1 (555) 123-4567'}
                type={messageType === 'email' ? 'email' : 'tel'}
              />
            </div>
          </div>
          
          {messageType === 'email' && (
            <div className="grid grid-cols-4 gap-4">
              <Label className="text-right pt-2" htmlFor="subject">Subject</Label>
              <div className="col-span-3">
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Message subject"
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right pt-2" htmlFor="content">Message</Label>
            <div className="col-span-3">
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
              />
            </div>
          </div>
        </form>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading && (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            )}
            Send {messageType === 'email' ? 'Email' : 'SMS'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeMessage;
