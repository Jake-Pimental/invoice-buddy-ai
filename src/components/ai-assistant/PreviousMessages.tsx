
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AIMessage } from "@/types";

interface PreviousMessagesProps {
  messages: AIMessage[];
}

const PreviousMessages = ({ messages }: PreviousMessagesProps) => {
  if (messages.length === 0) return null;

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case "friendly":
        return "bg-green-50 text-green-600 border-green-100";
      case "firm":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "urgent":
        return "bg-orange-50 text-orange-600 border-orange-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center my-3">
        <Separator className="flex-1" />
        <span className="mx-2 text-xs text-gray-400">PREVIOUS MESSAGES</span>
        <Separator className="flex-1" />
      </div>
      <div className="space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm p-3 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleDateString()} • {msg.deliveryStatus}
              </span>
              <Badge 
                variant="outline" 
                className={getSentimentStyles(msg.sentiment)}
              >
                {msg.sentiment}
              </Badge>
            </div>
            <p className="text-gray-600 line-clamp-2">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviousMessages;
