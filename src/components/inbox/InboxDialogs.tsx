
import React from 'react';
import { Message } from '@/types';
import ComposeMessage from './ComposeMessage';
import MessageDetail from './MessageDetail';

interface InboxDialogsProps {
  isComposeOpen: boolean;
  onComposeClose: () => void;
  onMessageSent: () => void;
  isDetailOpen: boolean;
  onDetailClose: () => void;
  selectedMessage: Message | null;
  onReply: (message: Message) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const InboxDialogs: React.FC<InboxDialogsProps> = ({
  isComposeOpen,
  onComposeClose,
  onMessageSent,
  isDetailOpen,
  onDetailClose,
  selectedMessage,
  onReply,
  onNavigate,
  onAddTag,
  onRemoveTag,
}) => {
  return (
    <>
      {/* Compose Message Dialog */}
      <ComposeMessage 
        isOpen={isComposeOpen}
        onClose={onComposeClose}
        onMessageSent={onMessageSent}
        clientName={selectedMessage?.clientName}
        clientEmail={selectedMessage?.clientName?.toLowerCase().replace(/\s+/g, '.') + '@example.com'}
        clientPhone="+1234567890"
        invoiceId={selectedMessage?.invoiceId}
      />
      
      {/* Message Detail Dialog */}
      <MessageDetail 
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        message={selectedMessage}
        onReply={onReply}
        onNavigate={onNavigate}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />
    </>
  );
};

export default InboxDialogs;
