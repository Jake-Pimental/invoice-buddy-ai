
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
  illustration?: React.ReactNode;
}

const EmptyState = ({
  title,
  description,
  buttonText,
  buttonIcon = <PlusIcon className="h-4 w-4 mr-2" />,
  onButtonClick,
  illustration,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {illustration && (
        <div className="mb-6 opacity-90">
          {illustration}
        </div>
      )}
      
      <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
      
      <p className="text-gray-500 max-w-md mb-6">
        {description}
      </p>
      
      {buttonText && onButtonClick && (
        <Button
          onClick={onButtonClick}
          className="flex items-center transition-all duration-300 ease-apple"
        >
          {buttonIcon}
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
