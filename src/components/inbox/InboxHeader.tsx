
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, RefreshCw, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface InboxHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  refreshMessages: () => void;
  handleCompose: () => void;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isLoading,
  refreshMessages,
  handleCompose,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Smart Inbox</h1>
        <p className="text-gray-500 mt-1">Track and manage all client communications</p>
      </div>
      
      <div className="flex mt-4 md:mt-0 w-full md:w-auto gap-2">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="flex-shrink-0" 
          title="Filter messages" 
          onClick={() => toast({
            title: "Coming soon",
            description: "Advanced filtering will be available soon.",
          })}
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="flex-shrink-0" 
          title="Refresh inbox"
          onClick={refreshMessages}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        <Button 
          variant="default" 
          className="flex-shrink-0 gap-1"
          onClick={handleCompose}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Compose</span>
        </Button>
      </div>
    </div>
  );
};

export default InboxHeader;
