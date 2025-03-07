
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { WorkflowStep } from "@/types/workflow";

interface NewStepDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newStep: Partial<WorkflowStep>;
  setNewStep: React.Dispatch<React.SetStateAction<Partial<WorkflowStep>>>;
  onCreateStep: () => void;
}

const NewStepDialog: React.FC<NewStepDialogProps> = ({
  isOpen,
  onOpenChange,
  newStep,
  setNewStep,
  onCreateStep,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Step
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Workflow Step</DialogTitle>
          <DialogDescription>
            Create a new step for your collection workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="step-name">Step Name</Label>
              <Input 
                id="step-name" 
                placeholder="e.g., Final Reminder" 
                value={newStep.name || ''}
                onChange={(e) => setNewStep({...newStep, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trigger-days">Trigger (Days)</Label>
              <Input 
                id="trigger-days" 
                type="number"
                placeholder="7" 
                value={newStep.triggerDays || 0}
                onChange={(e) => setNewStep({...newStep, triggerDays: parseInt(e.target.value)})}
              />
              <p className="text-xs text-muted-foreground">
                Use negative values for days before due date (e.g., -3)
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="step-description">Description</Label>
            <Input 
              id="step-description" 
              placeholder="e.g., Sent 7 days after due date" 
              value={newStep.description || ''}
              onChange={(e) => setNewStep({...newStep, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="step-type">Message Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="type-email" 
                  name="step-type" 
                  className="mr-2"
                  checked={newStep.type === "email"}
                  onChange={() => setNewStep({...newStep, type: "email"})}
                />
                <Label htmlFor="type-email" className="cursor-pointer">Email</Label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="type-sms" 
                  name="step-type" 
                  className="mr-2"
                  checked={newStep.type === "sms"}
                  onChange={() => setNewStep({...newStep, type: "sms"})}
                />
                <Label htmlFor="type-sms" className="cursor-pointer">SMS</Label>
              </div>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="type-reminder" 
                  name="step-type" 
                  className="mr-2"
                  checked={newStep.type === "reminder"}
                  onChange={() => setNewStep({...newStep, type: "reminder"})}
                />
                <Label htmlFor="type-reminder" className="cursor-pointer">Reminder</Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message-template">Message Template</Label>
            <Textarea 
              id="message-template" 
              placeholder="Hello {{clientName}}, This is a reminder about invoice {{invoiceNumber}}..."
              className="h-32"
              value={newStep.messageTemplate || ''}
              onChange={(e) => setNewStep({...newStep, messageTemplate: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">
              Available variables: &#123;&#123;clientName&#125;&#125;, &#123;&#123;invoiceNumber&#125;&#125;, &#123;&#123;amount&#125;&#125;, &#123;&#123;dueDate&#125;&#125;, &#123;&#123;companyName&#125;&#125;
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onCreateStep}>Add Step</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewStepDialog;
