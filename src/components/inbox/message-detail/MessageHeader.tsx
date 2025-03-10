
import React from 'react';
import { Mail, MessageSquare, PhoneCall, User } from 'lucide-react';
import { Message } from '@/types';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

interface MessageHeaderProps {
  message: Message;
  showThread: boolean;
  onToggleThread: () => void;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  message,
  showThread,
  onToggleThread,
}) => {
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
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {getMessageIcon(message.type)}
          <span className="capitalize">{message.type}</span> conversation with {message.clientName}
        </DialogTitle>
      </DialogHeader>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            {message.clientName}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleThread}
            className="text-xs h-8"
          >
            {showThread ? 'Hide Thread' : 'Show Thread'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default MessageHeader;
