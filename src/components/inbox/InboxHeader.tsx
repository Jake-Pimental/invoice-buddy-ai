
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, RefreshCw, Plus, Layout } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface InboxHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  refreshMessages: () => void;
  handleCompose: () => void;
  pendingTasksCount: number;
  toggleTasksPanel: () => void;
  showTasksPanel: boolean;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  isLoading,
  refreshMessages,
  handleCompose,
  pendingTasksCount,
  toggleTasksPanel,
  showTasksPanel,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight dark:text-white">Smart Inbox</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage all client communications</p>
      </div>
      
      <div className="flex mt-4 md:mt-0 w-full md:w-auto gap-2">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-8 dark:bg-gray-800 dark:border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-shrink-0 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700" 
                onClick={() => toast({
                  title: "Coming soon",
                  description: "Advanced filtering will be available soon.",
                })}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter messages</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-shrink-0 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700" 
                onClick={refreshMessages}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh inbox</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-shrink-0 relative dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700" 
                onClick={toggleTasksPanel}
              >
                <Layout className="h-4 w-4" />
                {pendingTasksCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                  >
                    {pendingTasksCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showTasksPanel ? "Hide tasks panel" : "Show tasks panel"}</p>
            </TooltipContent>
          </Tooltip>
          
          <Button 
            variant="default" 
            className="flex-shrink-0 gap-1"
            onClick={handleCompose}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Compose</span>
          </Button>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default InboxHeader;
