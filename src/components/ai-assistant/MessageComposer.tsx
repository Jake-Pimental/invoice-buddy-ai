
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrainIcon, RefreshCcwIcon } from "lucide-react";
import { Invoice } from "@/types";

interface MessageComposerProps {
  invoice: Invoice | null | undefined;
  message: string;
  setMessage: (message: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  isLoading: boolean;
  onGenerateMessage: () => void;
}

const MessageComposer = ({
  invoice,
  message,
  setMessage,
  tone,
  setTone,
  isLoading,
  onGenerateMessage,
}: MessageComposerProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Message Tone</h3>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="firm">Firm</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button
        onClick={onGenerateMessage}
        disabled={isLoading || !invoice}
        className="w-full"
      >
        {isLoading ? (
          <>
            <RefreshCcwIcon className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <BrainIcon className="h-4 w-4 mr-2" />
            Generate AI Message
          </>
        )}
      </Button>
      
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message will appear here..."
        className="min-h-[200px] resize-none mt-2"
      />
    </div>
  );
};

export default MessageComposer;
