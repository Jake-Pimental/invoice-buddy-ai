
import { Button } from "@/components/ui/button";
import { ClipboardCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface QuickSuggestionsProps {
  suggestions: string[];
  onCopySuggestion: (suggestion: string) => void;
}

const QuickSuggestions = ({ suggestions, onCopySuggestion }: QuickSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Quick Suggestions</h3>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={cn(
              "text-sm p-3 border rounded-lg cursor-pointer transition-all duration-200",
              "hover:border-blue-300 hover:bg-blue-50/50"
            )}
            onClick={() => onCopySuggestion(suggestion)}
          >
            <div className="flex justify-between items-start">
              <p className="text-gray-600 line-clamp-2">{suggestion}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-gray-400 hover:text-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopySuggestion(suggestion);
                }}
              >
                <ClipboardCheckIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;
