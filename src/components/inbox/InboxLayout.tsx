
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Message, TaskItem } from '@/types';
import InboxTabs from './InboxTabs';
import TasksPanel from './TasksPanel';
import MessageSummary from './MessageSummary';

interface InboxLayoutProps {
  showTasksPanel: boolean;
  tasks: TaskItem[];
  onTaskApprove: (taskId: string) => void;
  onTaskReject: (taskId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  messages: Message[];
  filteredMessages: Message[];
  unreadCount: number;
  onMessageClick: (message: Message, index: number) => void;
  showMessageSummary: boolean;
  selectedMessage: Message | null;
  onAddTag: (messageId: string, tag: string) => void;
  onRemoveTag: (messageId: string, tag: string) => void;
}

const InboxLayout: React.FC<InboxLayoutProps> = ({
  showTasksPanel,
  tasks,
  onTaskApprove,
  onTaskReject,
  activeTab,
  setActiveTab,
  messages,
  filteredMessages,
  unreadCount,
  onMessageClick,
  showMessageSummary,
  selectedMessage,
  onAddTag,
  onRemoveTag,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {showTasksPanel && (
          <div className="md:col-span-1">
            <TasksPanel 
              tasks={tasks} 
              onApprove={onTaskApprove} 
              onReject={onTaskReject}
            />
          </div>
        )}
        
        <div className={showTasksPanel ? "md:col-span-2" : "md:col-span-3"}>
          <Card>
            <CardContent className="pt-6">
              <InboxTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                messages={messages}
                filteredMessages={filteredMessages}
                unreadCount={unreadCount}
                handleMessageClick={onMessageClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {showMessageSummary && selectedMessage && (
        <div className="mb-8">
          <MessageSummary 
            message={selectedMessage}
            onAddTag={(tag) => onAddTag(selectedMessage.id, tag)}
            onRemoveTag={(tag) => onRemoveTag(selectedMessage.id, tag)}
          />
        </div>
      )}
      
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
    </>
  );
};

export default InboxLayout;
