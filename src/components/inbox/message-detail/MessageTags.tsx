
import React, { useState } from 'react';
import { Tag, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface MessageTagsProps {
  tags?: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const MessageTags: React.FC<MessageTagsProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = useState('');

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

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Tag className="h-4 w-4 text-gray-500" />
      {tags && tags.length > 0 ? (
        tags.map((tag, index) => (
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
  );
};

export default MessageTags;
