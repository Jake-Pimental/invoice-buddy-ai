
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, PhoneCall, ArrowLeft, ArrowRight, Calendar, User } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Message } from '@/types';
import { Badge } from '@/components/ui/badge';

interface MessageDetailProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (message: Message) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  isOpen,
  onClose,
  onReply,
  onNavigate,
}) => {
  if (!message) return null;

  const getMessageIcon = (type: 'email' | 'sms' | 'call') => {
    switch (type) {
      case 'email':
        return <Mail className="h-5 w-5 text-blue-500" />;
      case 'sms':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'call':
        return <PhoneCall className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getMessageIcon(message.type)}
            <span className="capitalize">{message.type}</span> from {message.clientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {message.direction === 'incoming' ? 'From' : 'To'}: {message.clientName}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {format(new Date(message.timestamp), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Message:</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {message.priority && (
              <Badge variant="outline" className={`
                ${message.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' : 
                  message.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                  'bg-green-50 text-green-700 border-green-100'}
              `}>
                {message.priority} priority
              </Badge>
            )}
            
            {message.sentiment && (
              <Badge variant="outline" className={`
                ${message.sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-100' : 
                  message.sentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-100' : 
                  'bg-blue-50 text-blue-700 border-blue-100'}
              `}>
                {message.sentiment}
              </Badge>
            )}
            
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
              {message.invoiceId}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t pt-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onNavigate('prev')}
              title="Previous message"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onNavigate('next')}
              title="Next message"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onReply(message)}>
              Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetail;
