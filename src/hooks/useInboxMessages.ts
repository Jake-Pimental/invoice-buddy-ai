import { useState, useEffect } from 'react';
import { Message, TaskItem } from '@/types';
import mockMessages from '@/data/mockMessages';
import mockTasks from '@/data/mockTasks';
import { toast } from '@/components/ui/use-toast';

export const useInboxMessages = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number>(-1);

  // Initialize messages and tasks on component mount
  useEffect(() => {
    setMessages(mockMessages);
    setTasks(mockTasks);
  }, []);

  // Simulate refreshing messages from an API
  const refreshMessages = () => {
    setIsLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setMessages(mockMessages);
      setTasks(mockTasks);
      setIsLoading(false);
      toast({
        title: "Inbox refreshed",
        description: "Your messages and tasks have been updated.",
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
      if (activeTab === 'tagged') return message.tags && message.tags.length > 0;
      return true;
    })
    .filter(message => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        message.clientName.toLowerCase().includes(query) ||
        message.content.toLowerCase().includes(query) ||
        message.invoiceId.toLowerCase().includes(query) ||
        (message.tags && message.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    });

  // Get count of unread messages
  const unreadCount = messages.filter(msg => msg.status === 'unread').length;
  
  // Get count of pending tasks
  const pendingTasksCount = tasks.filter(task => task.status === 'pending').length;

  // Function to mark a message as read
  const markAsRead = (id: string) => {
    console.log(`Marking message ${id} as read`);
    
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === id 
          ? { ...message, status: 'read' }
          : message
      )
    );
  };

  // Function to mark all messages as read
  const markAllAsRead = () => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.status === 'unread'
          ? { ...message, status: 'read' }
          : message
      )
    );
  };

  // Function to handle message click
  const handleMessageClick = (message: Message, index: number) => {
    setSelectedMessage(message);
    setSelectedMessageIndex(index);
    
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
      tags: ['outgoing', 'sent'],
    };
    
    setMessages(prevMessages => [newMessage, ...prevMessages]);
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
  };

  // Function to handle task approval
  const handleTaskApprove = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'approved' }
          : task
      )
    );
    
    toast({
      title: "Task approved",
      description: "The task has been approved successfully.",
    });
  };

  // Function to handle task rejection
  const handleTaskReject = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'rejected' }
          : task
      )
    );
    
    toast({
      title: "Task rejected",
      description: "The task has been rejected.",
    });
  };

  // Function to add a tag to a message
  const handleAddTag = (messageId: string, tag: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId
          ? { 
              ...message, 
              tags: message.tags ? [...message.tags.filter(t => t !== tag), tag] : [tag] 
            }
          : message
      )
    );
    
    toast({
      title: "Tag added",
      description: `Tag "${tag}" has been added to the message.`,
    });
  };

  // Function to remove a tag from a message
  const handleRemoveTag = (messageId: string, tag: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId && message.tags
          ? { 
              ...message, 
              tags: message.tags.filter(t => t !== tag)
            }
          : message
      )
    );
    
    toast({
      title: "Tag removed",
      description: `Tag "${tag}" has been removed from the message.`,
    });
  };

  return {
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
  };
};
