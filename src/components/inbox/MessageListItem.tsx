
import React from 'react';
import { Mail, MessageSquare, PhoneCall, Star, Clock } from 'lucide-react';
import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface MessageListItemProps {
  message: Message;
  onClick: (message: Message) => void;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message, onClick }) => {
  // Function to render the appropriate icon based on message type
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
  
  // Function to get priority indicator
  const getPriorityIndicator = (priority?: 'high' | 'medium' | 'low') => {
    if (!priority) return null;
    
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    
    return (
      <span 
        className={`inline-block w-2 h-2 rounded-full ${colors[priority]} mr-2`} 
        title={`${priority} priority`}
      />
    );
  };

  return (
    <div 
      className={`py-4 px-2 hover:bg-gray-50 transition-colors cursor-pointer ${
        message.status === 'unread' ? 'bg-blue-50/50' : ''
      }`}
      onClick={() => onClick(message)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getMessageIcon(message.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              {getPriorityIndicator(message.priority)}
              <span className="font-medium">
                {message.clientName}
              </span>
              {message.status === 'unread' && (
                <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500" />
              )}
              <span className="text-xs text-gray-500 ml-2">
                {message.invoiceId}
              </span>
            </div>
            
            <p className="text-gray-700 line-clamp-2">
              {message.content}
            </p>
            
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </div>
              
              <span className="capitalize">
                {message.direction === 'incoming' ? 'From Client' : 'To Client'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-yellow-500"
            title="Mark as important"
            onClick={(e) => {
              e.stopPropagation();
              toast({
                title: "Marked as important",
                description: "This message has been marked as important.",
              });
            }}
          >
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageListItem;
