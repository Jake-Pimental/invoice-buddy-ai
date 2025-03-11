
import React, { useState, useEffect } from 'react';
import { useInboxMessages } from '@/hooks/useInboxMessages';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import InboxHeader from '@/components/inbox/InboxHeader';
import InboxLayout from '@/components/inbox/InboxLayout';
import InboxDialogs from '@/components/inbox/InboxDialogs';
import { Message } from '@/types';

const SmartInbox: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    handleRemoveTag,
    markAllAsRead
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process shortcuts when not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'c':
          // Compose new message
          if (!isComposeOpen && !isDetailOpen) {
            handleCompose();
          }
          break;
        case 'j':
          // Navigate to next message
          if (selectedMessage && !isComposeOpen) {
            handleNavigate('next');
          }
          break;
        case 'k':
          // Navigate to previous message
          if (selectedMessage && !isComposeOpen) {
            handleNavigate('prev');
          }
          break;
        case 'Escape':
          // Close open dialogs
          if (isDetailOpen) {
            setIsDetailOpen(false);
            setShowMessageSummary(false);
          } else if (isComposeOpen) {
            setIsComposeOpen(false);
          }
          break;
        case 'r':
          // Refresh inbox
          if (!isComposeOpen && !isDetailOpen) {
            refreshMessages();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isComposeOpen, isDetailOpen, selectedMessage, handleNavigate, refreshMessages]);

  // Handle marking all messages as read
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "All messages marked as read",
      description: `${unreadCount} messages have been marked as read.`,
    });
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
      
      {unreadCount > 0 && (
        <div className="mb-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Mark all as read ({unreadCount})
          </Button>
        </div>
      )}
      
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

      {/* Keyboard shortcuts helper */}
      <div className="mt-8 text-xs text-gray-500 border-t pt-4">
        <p className="font-medium mb-1">Keyboard shortcuts:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div><kbd className="px-1 bg-gray-100 rounded">c</kbd> Compose message</div>
          <div><kbd className="px-1 bg-gray-100 rounded">j</kbd> Next message</div>
          <div><kbd className="px-1 bg-gray-100 rounded">k</kbd> Previous message</div>
          <div><kbd className="px-1 bg-gray-100 rounded">r</kbd> Refresh inbox</div>
          <div><kbd className="px-1 bg-gray-100 rounded">Esc</kbd> Close dialog</div>
        </div>
      </div>
    </div>
  );
};

export default SmartInbox;
