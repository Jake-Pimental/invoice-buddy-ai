
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/types';

interface MessageFooterProps {
  message: Message;
  onNavigate: (direction: 'prev' | 'next') => void;
  onClose: () => void;
  onFullReply: () => void;
}

const MessageFooter: React.FC<MessageFooterProps> = ({
  message,
  onNavigate,
  onClose,
  onFullReply,
}) => {
  return (
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
        <Button onClick={onFullReply}>
          Full Reply
        </Button>
      </div>
    </div>
  );
};

export default MessageFooter;
