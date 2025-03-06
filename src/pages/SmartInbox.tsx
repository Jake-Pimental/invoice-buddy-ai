
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Message } from '@/types';
import { toast } from '@/components/ui/use-toast';
import ComposeMessage from '@/components/inbox/ComposeMessage';
import MessageDetail from '@/components/inbox/MessageDetail';
import InboxHeader from '@/components/inbox/InboxHeader';
import InboxTabs from '@/components/inbox/InboxTabs';
import mockMessages from '@/data/mockMessages';

const SmartInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number>(-1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize messages on component mount
  useEffect(() => {
    setMessages(mockMessages);
  }, []);
  
  // Simulate refreshing messages from an API
  const refreshMessages = () => {
    setIsLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setMessages(mockMessages);
      setIsLoading(false);
      toast({
        title: "Inbox refreshed",
        description: "Your messages have been updated.",
      });
    }, 1000);
  };
  
  // Filter messages based on active tab and search query
  const filteredMessages = messages
    .filter(message => {
      if (activeTab === 'all') return true;
      if (activeTab === 'unread') return message.status === 'unread';
      if (activeTab === 'email') return message.type === 'email';
      if (activeTab === 'sms') return message.type === 'sms';
      if (activeTab === 'calls') return message.type === 'call';
      if (activeTab === 'priorities') return message.priority === 'high';
      return true;
    })
    .filter(message => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        message.clientName.toLowerCase().includes(query) ||
        message.content.toLowerCase().includes(query) ||
        message.invoiceId.toLowerCase().includes(query)
      );
    });
  
  // Get count of unread messages
  const unreadCount = messages.filter(msg => msg.status === 'unread').length;
  
  // Function to mark a message as read
  const markAsRead = (id: string) => {
    // In a real app, this would update the database
    console.log(`Marking message ${id} as read`);
    
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === id 
          ? { ...message, status: 'read' }
          : message
      )
    );
  };
  
  // Function to handle message click
  const handleMessageClick = (message: Message, index: number) => {
    setSelectedMessage(message);
    setSelectedMessageIndex(index);
    setIsDetailOpen(true);
    
    if (message.status === 'unread') {
      markAsRead(message.id);
    }
  };
  
  // Function to handle navigating between messages
  const handleNavigate = (direction: 'prev' | 'next') => {
    const totalMessages = filteredMessages.length;
    
    if (totalMessages === 0 || selectedMessageIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = selectedMessageIndex > 0 ? selectedMessageIndex - 1 : totalMessages - 1;
    } else {
      newIndex = selectedMessageIndex < totalMessages - 1 ? selectedMessageIndex + 1 : 0;
    }
    
    const newMessage = filteredMessages[newIndex];
    setSelectedMessage(newMessage);
    setSelectedMessageIndex(newIndex);
    
    if (newMessage.status === 'unread') {
      markAsRead(newMessage.id);
    }
  };
  
  // Function to handle composing a new message
  const handleCompose = () => {
    setIsComposeOpen(true);
  };
  
  // Function to handle replying to a message
  const handleReply = (message: Message) => {
    setIsDetailOpen(false);
    setIsComposeOpen(true);
  };
  
  // Function to handle adding a new message after sending
  const handleMessageSent = () => {
    // In a real app, this would refresh messages from the API
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      invoiceId: selectedMessage?.invoiceId || 'INV-NEW',
      clientName: selectedMessage?.clientName || 'Client',
      type: 'email',
      direction: 'outgoing',
      content: 'Your message has been sent.',
      timestamp: new Date().toISOString(),
      status: 'read',
      sentiment: 'positive',
      priority: 'medium',
    };
    
    setMessages(prevMessages => [newMessage, ...prevMessages]);
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <InboxHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        refreshMessages={refreshMessages}
        handleCompose={handleCompose}
      />
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <InboxTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            messages={messages}
            filteredMessages={filteredMessages}
            unreadCount={unreadCount}
            handleMessageClick={handleMessageClick}
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="w-full max-w-lg"
          onClick={() => toast({
            title: "Coming soon",
            description: "Loading older messages will be available soon.",
          })}
        >
          Load More Messages
        </Button>
      </div>
      
      {/* Compose Message Dialog */}
      <ComposeMessage 
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onMessageSent={handleMessageSent}
        clientName={selectedMessage?.clientName}
        clientEmail={selectedMessage?.clientName?.toLowerCase().replace(/\s+/g, '.') + '@example.com'}
        clientPhone="+1234567890"
        invoiceId={selectedMessage?.invoiceId}
      />
      
      {/* Message Detail Dialog */}
      <MessageDetail 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        message={selectedMessage}
        onReply={handleReply}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default SmartInbox;
