
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Message } from '@/types';
import { Button } from '@/components/ui/button';

// Import the new component files
import MessageHeader from './message-detail/MessageHeader';
import MessageTags from './message-detail/MessageTags';
import MessageThread from './message-detail/MessageThread';
import QuickReply from './message-detail/QuickReply';
import MessageFooter from './message-detail/MessageFooter';

interface MessageDetailProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (message: Message) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const MessageDetail: React.FC<MessageDetailProps> = ({
  message,
  isOpen,
  onClose,
  onReply,
  onNavigate,
  onAddTag,
  onRemoveTag,
}) => {
  const [showThread, setShowThread] = useState(true);
  
  if (!message) return null;

  const handleQuickReply = (content: string) => {
    if (content.trim()) {
      const replyMessage = {
        ...message,
        content: content,
        direction: 'outgoing' as const,
      };
      onReply(replyMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <MessageHeader 
          message={message} 
          showThread={showThread} 
          onToggleThread={() => setShowThread(!showThread)} 
        />
        
        <div className="py-4 space-y-6 overflow-y-auto flex-grow">
          <MessageTags 
            tags={message.tags} 
            onAddTag={onAddTag} 
            onRemoveTag={onRemoveTag} 
          />
          
          <MessageThread 
            message={message} 
            showThread={showThread} 
          />
          
          <QuickReply 
            message={message} 
            onReply={handleQuickReply} 
          />
        </div>
        
        <MessageFooter 
          message={message}
          onNavigate={onNavigate}
          onClose={onClose}
          onFullReply={() => onReply(message)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetail;
