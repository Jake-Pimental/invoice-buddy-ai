
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ArrowRight, Mail, MessageSquare } from "lucide-react";
import { WorkflowStep as WorkflowStepType } from "@/types/workflow";

interface WorkflowStepProps {
  step: WorkflowStepType;
  index: number;
  onToggleStepActive: (stepId: string) => void;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step, index, onToggleStepActive }) => {
  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "reminder":
        return <Clock className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const formatTriggerDays = (days: number) => {
    if (days < 0) {
      return `${Math.abs(days)} days before due date`;
    } else if (days === 0) {
      return "On due date";
    } else {
      return `${days} days after due date`;
    }
  };

  return (
    <Card 
      className={`border-l-4 relative ${
        step.active ? "border-l-primary" : "border-l-gray-200 opacity-70"
      }`}
    >
      <div className="absolute -left-6 top-6 z-10 rounded-full bg-white p-1 border">
        {index === 0 ? (
          <Clock className="h-4 w-4 text-primary" />
        ) : (
          <ArrowRight className="h-4 w-4 text-gray-400" />
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-md font-medium flex items-center gap-2">
              {getStepTypeIcon(step.type)}
              {step.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {step.description} • {formatTriggerDays(step.triggerDays)}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className={step.active ? "text-gray-500" : "text-primary"}
            onClick={() => onToggleStepActive(step.id)}
          >
            {step.active ? "Disable" : "Enable"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-3 rounded-md text-sm font-mono text-gray-700 whitespace-pre-wrap">
          {step.messageTemplate}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkflowStep;
