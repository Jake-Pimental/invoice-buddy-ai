
import React, { useState } from 'react';
import { useInboxMessages } from '@/hooks/useInboxMessages';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InboxHeader from '@/components/inbox/InboxHeader';
import InboxLayout from '@/components/inbox/InboxLayout';
import InboxDialogs from '@/components/inbox/InboxDialogs';
import { Message } from '@/types';

const SmartInbox: React.FC = () => {
  const navigate = useNavigate();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showTasksPanel, setShowTasksPanel] = useState(true);
  const [showMessageSummary, setShowMessageSummary] = useState(false);
  
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    messages,
    tasks,
    isLoading,
    selectedMessage,
    setSelectedMessage,
    selectedMessageIndex,
    filteredMessages,
    unreadCount,
    pendingTasksCount,
    refreshMessages,
    handleMessageClick,
    handleNavigate,
    handleMessageSent,
    handleTaskApprove,
    handleTaskReject,
    handleAddTag,
    handleRemoveTag
  } = useInboxMessages();
  
  // Function to handle composing a new message
  const handleCompose = () => {
    setIsComposeOpen(true);
  };
  
  // Function to handle replying to a message
  const handleReply = (message: Message) => {
    setIsDetailOpen(false);
    setIsComposeOpen(true);
  };

  // Handle message click with summary panel
  const handleMessageClickWithSummary = (message: Message, index: number) => {
    handleMessageClick(message, index);
    setIsDetailOpen(true);
    setShowMessageSummary(true);
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-700 -ml-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
      </div>
      
      <InboxHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
        refreshMessages={refreshMessages}
        handleCompose={handleCompose}
        pendingTasksCount={pendingTasksCount}
        toggleTasksPanel={() => setShowTasksPanel(!showTasksPanel)}
        showTasksPanel={showTasksPanel}
      />
      
      <InboxLayout 
        showTasksPanel={showTasksPanel}
        tasks={tasks}
        onTaskApprove={handleTaskApprove}
        onTaskReject={handleTaskReject}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messages={messages}
        filteredMessages={filteredMessages}
        unreadCount={unreadCount}
        onMessageClick={handleMessageClickWithSummary}
        showMessageSummary={showMessageSummary}
        selectedMessage={selectedMessage}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />
      
      <InboxDialogs 
        isComposeOpen={isComposeOpen}
        onComposeClose={() => setIsComposeOpen(false)}
        onMessageSent={handleMessageSent}
        isDetailOpen={isDetailOpen}
        onDetailClose={() => {
          setIsDetailOpen(false);
          setShowMessageSummary(false);
        }}
        selectedMessage={selectedMessage}
        onReply={handleReply}
        onNavigate={handleNavigate}
        onAddTag={(tag) => selectedMessage && handleAddTag(selectedMessage.id, tag)}
        onRemoveTag={(tag) => selectedMessage && handleRemoveTag(selectedMessage.id, tag)}
      />
    </div>
  );
};

export default SmartInbox;
