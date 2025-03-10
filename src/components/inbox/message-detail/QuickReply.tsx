
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Message } from '@/types';

interface QuickReplyProps {
  message: Message;
  onReply: (content: string) => void;
}

const QuickReply: React.FC<QuickReplyProps> = ({
  message,
  onReply,
}) => {
  const [quickReply, setQuickReply] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  
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

  return (
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
      <div className="mt-2 flex justify-end">
        <Button 
          onClick={() => onReply(quickReply)} 
          disabled={!quickReply.trim()}
          size="sm"
        >
          Send Reply
        </Button>
      </div>
    </div>
  );
};

export default QuickReply;
