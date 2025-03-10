
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, PhoneCall, ArrowLeft, ArrowRight, Calendar, User, CornerDownRight, Sparkles, Tag, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Message } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

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
  const [quickReply, setQuickReply] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  if (!message) return null;

  // Mock thread data - in a real app, this would come from an API
  const mockThread: Message[] = [
    {
      id: `${message.id}-thread-1`,
      invoiceId: message.invoiceId,
      clientName: message.clientName,
      type: message.type,
      direction: 'outgoing',
      content: `Hello ${message.clientName}, we've sent invoice ${message.invoiceId} for your recent services. Please let me know if you have any questions.`,
      timestamp: new Date(new Date(message.timestamp).getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      status: 'read',
      sentiment: 'positive',
      priority: 'medium',
    },
    {
      id: `${message.id}-thread-2`,
      invoiceId: message.invoiceId,
      clientName: message.clientName,
      type: message.type,
      direction: 'incoming',
      content: `Thanks for sending this over. I'll review it and get back to you soon.`,
      timestamp: new Date(new Date(message.timestamp).getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'read',
      sentiment: 'positive',
      priority: 'low',
    },
    {
      id: `${message.id}-thread-3`,
      invoiceId: message.invoiceId,
      clientName: message.clientName,
      type: message.type,
      direction: 'outgoing',
      content: `Just following up on invoice ${message.invoiceId}. Have you had a chance to review it?`,
      timestamp: new Date(new Date(message.timestamp).getTime() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'read',
      sentiment: 'neutral',
      priority: 'medium',
    },
    // The current message is assumed to be the last one in the thread
  ];

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

  const handleQuickReply = () => {
    if (quickReply.trim()) {
      const replyMessage = {
        ...message,
        content: quickReply,
        direction: 'outgoing' as const,
      };
      onReply(replyMessage);
      setQuickReply('');
    }
  };

  // AI-assisted reply generation
  const generateAIReply = () => {
    setIsGeneratingReply(true);
    
    // In a real app, this would call an API endpoint
    setTimeout(() => {
      // Generate different replies based on sentiment and content
      let generatedReply = '';
      
      if (message.sentiment === 'positive') {
        generatedReply = `Thank you for your message, ${message.clientName}. We appreciate your positive feedback about invoice ${message.invoiceId}. Is there anything else we can help you with?`;
      } else if (message.sentiment === 'negative') {
        generatedReply = `I'm sorry to hear about your concerns regarding invoice ${message.invoiceId}, ${message.clientName}. We'd like to address any issues you're experiencing as quickly as possible. Could you please provide more details so we can find the best solution?`;
      } else {
        // For neutral sentiment or missing sentiment
        if (message.content.toLowerCase().includes('payment') || message.content.toLowerCase().includes('paid')) {
          generatedReply = `Thank you for your message about invoice ${message.invoiceId}, ${message.clientName}. We've confirmed receipt of your payment and updated our records accordingly. You should receive a payment confirmation shortly.`;
        } else if (message.content.toLowerCase().includes('question') || message.content.toLowerCase().includes('help')) {
          generatedReply = `Hello ${message.clientName}, we're happy to help with any questions you have about invoice ${message.invoiceId}. Please let us know what specific information you need, and we'll get back to you as soon as possible.`;
        } else {
          generatedReply = `Thank you for your message regarding invoice ${message.invoiceId}, ${message.clientName}. We've received your inquiry and will respond in detail shortly. In the meantime, please let us know if you need any immediate assistance.`;
        }
      }
      
      setQuickReply(generatedReply);
      setIsGeneratingReply(false);
    }, 1000);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      toast({
        title: "Tag added",
        description: `Tag "${newTag.trim()}" has been added to the message.`,
      });
    }
  };

  const allThreadMessages = [...mockThread, message];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getMessageIcon(message.type)}
            <span className="capitalize">{message.type}</span> conversation with {message.clientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6 overflow-y-auto flex-grow">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {message.clientName}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowThread(!showThread)}
                className="text-xs h-8"
              >
                {showThread ? 'Hide Thread' : 'Show Thread'}
              </Button>
            </div>
          </div>
          
          {/* Tags section */}
          <div className="flex flex-wrap gap-2 items-center">
            <Tag className="h-4 w-4 text-gray-500" />
            {message.tags && message.tags.length > 0 ? (
              message.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="px-2 py-1 flex items-center gap-1"
                >
                  {tag}
                  <button 
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    onClick={() => onRemoveTag(tag)}
                  >
                    ×
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">No tags</span>
            )}
            <div className="flex items-center gap-1 ml-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New tag"
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {showThread && (
            <div className="space-y-4 pt-2">
              {allThreadMessages.map((msg, index) => (
                <div 
                  key={msg.id} 
                  className={`p-4 rounded-lg ${
                    msg.direction === 'incoming' 
                      ? 'bg-gray-100 border border-gray-200' 
                      : 'bg-blue-50 border border-blue-100 ml-4'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {msg.direction === 'incoming' ? (
                        <span className="text-sm font-medium">From: {msg.clientName}</span>
                      ) : (
                        <span className="text-sm font-medium">From: Your Company</span>
                      )}
                      
                      {msg.direction === 'outgoing' && (
                        <CornerDownRight className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  
                  {msg.id === message.id && (
                    <div className="flex items-center gap-2 mt-2">
                      {message.priority && (
                        <Badge variant="outline" className={`
                          ${message.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' : 
                            message.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                            'bg-green-50 text-green-700 border-green-100'}
                        `}>
                          {message.priority} priority
                        </Badge>
                      )}
                      
                      {message.sentiment && (
                        <Badge variant="outline" className={`
                          ${message.sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-100' : 
                            message.sentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-100' : 
                            'bg-blue-50 text-blue-700 border-blue-100'}
                        `}>
                          {message.sentiment}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {!showThread && (
            <div>
              <h3 className="font-medium mb-2">Current Message:</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                {message.priority && (
                  <Badge variant="outline" className={`
                    ${message.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' : 
                      message.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                      'bg-green-50 text-green-700 border-green-100'}
                  `}>
                    {message.priority} priority
                  </Badge>
                )}
                
                {message.sentiment && (
                  <Badge variant="outline" className={`
                    ${message.sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-100' : 
                      message.sentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-100' : 
                      'bg-blue-50 text-blue-700 border-blue-100'}
                  `}>
                    {message.sentiment}
                  </Badge>
                )}
                
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                  {message.invoiceId}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="quick-reply" className="text-sm font-medium text-gray-700">Reply</label>
              <Button
                size="sm"
                variant="outline"
                onClick={generateAIReply}
                className="flex items-center gap-1.5 h-8 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                disabled={isGeneratingReply}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isGeneratingReply ? 'Generating...' : 'AI Reply'}
              </Button>
            </div>
            <Textarea
              id="quick-reply"
              placeholder="Type a quick reply..."
              value={quickReply}
              onChange={(e) => setQuickReply(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        
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
            <Button 
              onClick={handleQuickReply} 
              disabled={!quickReply.trim()}
            >
              Send Reply
            </Button>
            <Button onClick={() => onReply(message)}>
              Full Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetail;
