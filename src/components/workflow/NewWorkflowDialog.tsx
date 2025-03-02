
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import { Workflow } from "@/types/workflow";

interface NewWorkflowDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newWorkflow: Partial<Workflow>;
  setNewWorkflow: React.Dispatch<React.SetStateAction<Partial<Workflow>>>;
  onCreateWorkflow: () => void;
}

const NewWorkflowDialog: React.FC<NewWorkflowDialogProps> = ({
  isOpen,
  onOpenChange,
  newWorkflow,
  setNewWorkflow,
  onCreateWorkflow,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Workflow
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Set up a new automated collection process for your invoices.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Workflow Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., 30-Day Collection Process" 
              value={newWorkflow.name}
              onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the purpose of this workflow"
              value={newWorkflow.description}
              onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onCreateWorkflow}>Create Workflow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkflowDialog;
