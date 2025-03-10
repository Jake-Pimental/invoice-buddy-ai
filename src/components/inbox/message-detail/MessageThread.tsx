
import React from 'react';
import { CornerDownRight } from 'lucide-react';
import { Message } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface MessageThreadProps {
  message: Message;
  showThread: boolean;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  message,
  showThread,
}) => {
  // Mock thread data - in a real app, this would come from an API
  const mockThread: Message[] = [
    {
      id: `${message.id}-thread-1`,
      invoiceId: message.invoiceId,
      clientName: message.clientName,
      type: message.type,
      direction: 'outgoing',
      content: `Hello ${message.clientName}, we've sent invoice ${message.invoiceId} for your recent services. Please let me know if you have any questions.`,
      timestamp: new Date(new Date(message.timestamp).getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      status: 'read',
      sentiment: 'positive',
      priority: 'medium',
    },
    {
      id: `${message.id}-thread-2`,
      invoiceId: message.invoiceId,
      clientName: message.clientName,
      type: message.type,
      direction: 'incoming',
      content: `Thanks for sending this over. I'll review it and get back to you soon.`,
      timestamp: new Date(new Date(message.timestamp).getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'read',
      sentiment: 'positive',
      priority: 'low',
    },
    {
      id: `${message.id}-thread-3`,
      invoiceId: message.invoiceId,
      clientName: message.clientName,
      type: message.type,
      direction: 'outgoing',
      content: `Just following up on invoice ${message.invoiceId}. Have you had a chance to review it?`,
      timestamp: new Date(new Date(message.timestamp).getTime() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'read',
      sentiment: 'neutral',
      priority: 'medium',
    },
    // The current message is assumed to be the last one in the thread
  ];
  
  const allThreadMessages = [...mockThread, message];
  
  if (!showThread) {
    return (
      <div>
        <h3 className="font-medium mb-2">Current Message:</h3>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
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
    );
  }
  
  return (
    <div className="space-y-4 pt-2">
      {allThreadMessages.map((msg) => (
        <div 
          key={msg.id} 
          className={`p-4 rounded-lg ${
            msg.direction === 'incoming' 
              ? 'bg-gray-100 border border-gray-200' 
              : 'bg-blue-50 border border-blue-100 ml-4'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {msg.direction === 'incoming' ? (
                <span className="text-sm font-medium">From: {msg.clientName}</span>
              ) : (
                <span className="text-sm font-medium">From: Your Company</span>
              )}
              
              {msg.direction === 'outgoing' && (
                <CornerDownRight className="h-3 w-3 text-blue-500" />
              )}
            </div>
            <span className="text-xs text-gray-500">
              {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
          
          {msg.id === message.id && (
            <div className="flex items-center gap-2 mt-2">
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageThread;
