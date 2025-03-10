
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskItem } from '@/types';
import { Check, X, CreditCard, MessageSquare, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TasksPanelProps {
  tasks: TaskItem[];
  onApprove: (taskId: string) => void;
  onReject: (taskId: string) => void;
}

const TasksPanel: React.FC<TasksPanelProps> = ({ tasks, onApprove, onReject }) => {
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  
  // Get task icon based on type
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'payment_plan':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'negotiation':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'discount':
        return <Badge className="text-amber-500 bg-amber-50 border-amber-200">%</Badge>;
      case 'extension':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Function to get priority style
  const getPriorityStyle = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'low':
        return 'text-green-700 bg-green-50 border-green-200';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Pending Tasks</span>
          <Badge variant="outline" className="ml-2">
            {pendingTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTasks.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No pending tasks</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTaskIcon(task.type)}
                    <div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-gray-500">{task.clientName} • {task.invoiceId}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getPriorityStyle(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-700">{task.description}</p>
                
                {task.amount && (
                  <div className="text-sm">
                    <span className="text-gray-500">Amount:</span> ${task.amount.toFixed(2)}
                  </div>
                )}
                
                {task.dueDate && (
                  <div className="text-sm">
                    <span className="text-gray-500">Due:</span> {format(new Date(task.dueDate), 'MMM d, yyyy')}
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Created {format(new Date(task.createdAt), 'MMM d, h:mm a')}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => onReject(task.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => onApprove(task.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksPanel;
