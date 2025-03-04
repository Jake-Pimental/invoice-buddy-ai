
import React from "react";
import { format, parseISO } from "date-fns";
import { Mail, FileText, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AIMessage } from "@/types";

interface CommunicationHistoryProps {
  messages: AIMessage[] | undefined;
  isLoading: boolean;
}

const CommunicationHistory: React.FC<CommunicationHistoryProps> = ({
  messages,
  isLoading,
}) => {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Communication History
        </CardTitle>
        <CardDescription>
          Previous reminders and messages sent to the client
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="border border-gray-100 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Avatar>
                      <Mail className="h-4 w-4" />
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Email Reminder</p>
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-100"
                        >
                          {message.sentiment}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Sent on {format(parseISO(message.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700 border-green-100"
                  >
                    {message.deliveryStatus}
                  </Badge>
                </div>
                <p className="mt-3 text-gray-700 text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="mt-4 text-gray-600">No messages have been sent for this invoice yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunicationHistory;
