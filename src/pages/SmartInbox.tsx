
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Search, Mail, MessageSquare, PhoneCall, Filter, Clock, AlertCircle, Star, RefreshCw, Plus } from 'lucide-react';
import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import ComposeMessage from '@/components/inbox/ComposeMessage';
import MessageDetail from '@/components/inbox/MessageDetail';

const SmartInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number>(-1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - in a real app, this would come from an API
  const mockMessages: Message[] = [
    {
      id: '1',
      invoiceId: 'INV-001',
      clientName: 'Acme Corp',
      type: 'email',
      direction: 'incoming',
      content: 'I just received your invoice and will process it this week.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      status: 'unread',
      sentiment: 'positive',
      priority: 'medium',
    },
    {
      id: '2',
      invoiceId: 'INV-002',
      clientName: 'Tech Solutions',
      type: 'sms',
      direction: 'incoming',
      content: 'Payment sent just now. Please confirm receipt.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'unread',
      sentiment: 'positive',
      priority: 'high',
    },
    {
      id: '3',
      invoiceId: 'INV-003',
      clientName: 'Global Services',
      type: 'call',
      direction: 'incoming',
      content: 'Called about invoice payment delay. Will pay by Friday.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: 'read',
      sentiment: 'neutral',
      priority: 'medium',
    },
    {
      id: '4',
      invoiceId: 'INV-004',
      clientName: 'Fresh Supplies',
      type: 'email',
      direction: 'outgoing',
      content: 'Thank you for your payment. Receipt attached.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'read',
      sentiment: 'positive',
      priority: 'low',
    },
    {
      id: '5',
      invoiceId: 'INV-005',
      clientName: 'Johnson & Co',
      type: 'sms',
      direction: 'incoming',
      content: 'Can we discuss a payment plan for this invoice?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'read',
      sentiment: 'negative',
      priority: 'high',
    },
  ];

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Inbox</h1>
          <p className="text-gray-500 mt-1">Track and manage all client communications</p>
        </div>
        
        <div className="flex mt-4 md:mt-0 w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="flex-shrink-0" 
            title="Filter messages" 
            onClick={() => toast({
              title: "Coming soon",
              description: "Advanced filtering will be available soon.",
            })}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="flex-shrink-0" 
            title="Refresh inbox"
            onClick={refreshMessages}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="default" 
            className="flex-shrink-0 gap-1"
            onClick={handleCompose}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Compose</span>
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="all" className="flex items-center gap-1">
                All
                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 rounded-full">
                  {messages.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex items-center gap-1">
                Unread
                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 rounded-full">
                  {unreadCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="calls">Calls</TabsTrigger>
              <TabsTrigger value="priorities" className="flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Priority
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="pt-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No messages found</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredMessages.map((message, index) => (
                    <div 
                      key={message.id}
                      className={`py-4 px-2 hover:bg-gray-50 transition-colors cursor-pointer ${
                        message.status === 'unread' ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => handleMessageClick(message, index)}
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
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
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
