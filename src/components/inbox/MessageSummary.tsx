
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Message } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface MessageSummaryProps {
  message: Message;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const MessageSummary: React.FC<MessageSummaryProps> = ({
  message,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  // Generate a summary based on the message content
  const generateSummary = (message: Message) => {
    if (message.summary) return message.summary;
    
    // Simple summary logic, in a real app this would use AI
    const words = message.content.split(' ');
    let summary = '';
    
    if (message.content.toLowerCase().includes('payment')) {
      summary = 'Message about payment';
    } else if (message.content.toLowerCase().includes('invoice')) {
      summary = 'Message about invoice';
    } else if (message.content.toLowerCase().includes('question')) {
      summary = 'Client has questions';
    } else if (message.content.toLowerCase().includes('delay') || message.content.toLowerCase().includes('late')) {
      summary = 'Payment delay discussion';
    } else if (words.length > 20) {
      summary = `${words.slice(0, 10).join(' ')}...`;
    } else {
      summary = message.content;
    }
    
    return summary;
  };

  // Determine key topics from the message
  const getKeyTopics = (message: Message) => {
    const topics = [];
    
    if (message.content.toLowerCase().includes('payment')) topics.push('payment');
    if (message.content.toLowerCase().includes('invoice')) topics.push('invoice');
    if (message.content.toLowerCase().includes('question')) topics.push('question');
    if (message.content.toLowerCase().includes('delay') || message.content.toLowerCase().includes('late')) topics.push('delay');
    if (message.content.toLowerCase().includes('discount')) topics.push('discount');
    if (message.content.toLowerCase().includes('thank')) topics.push('gratitude');
    
    return topics.length > 0 ? topics : ['general'];
  };

  // Suggested tags based on message content
  const suggestedTags = [
    'follow-up',
    'important',
    'payment',
    'question',
    'resolved',
    'negotiation',
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Message Summary</span>
          <span className="text-sm text-gray-500 font-normal">
            {format(new Date(message.timestamp), 'MMM d, yyyy h:mm a')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Summary</h3>
          <p className="text-sm bg-gray-50 p-3 rounded-md border">
            {generateSummary(message)}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Key Topics</h3>
          <div className="flex flex-wrap gap-2">
            {getKeyTopics(message).map((topic, index) => (
              <Badge key={index} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2 items-center mb-3">
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
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a new tag"
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddTag}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="mt-3">
            <h4 className="text-xs text-gray-500 mb-2">Suggested Tags</h4>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  onClick={() => onAddTag(tag)}
                >
                  {tag}
                  <Plus className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageSummary;
