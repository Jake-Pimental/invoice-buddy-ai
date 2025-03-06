
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Message } from '@/types';
import MessageListItem from './MessageListItem';

interface InboxTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: Message[];
  filteredMessages: Message[];
  unreadCount: number;
  handleMessageClick: (message: Message, index: number) => void;
}

const InboxTabs: React.FC<InboxTabsProps> = ({
  activeTab,
  setActiveTab,
  messages,
  filteredMessages,
  unreadCount,
  handleMessageClick,
}) => {
  return (
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
              <MessageListItem 
                key={message.id}
                message={message}
                onClick={(message) => handleMessageClick(message, index)}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default InboxTabs;
