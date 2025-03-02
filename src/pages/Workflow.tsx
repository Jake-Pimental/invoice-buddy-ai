
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import WorkflowList from "@/components/workflow/WorkflowList";
import WorkflowDetail from "@/components/workflow/WorkflowDetail";
import NewWorkflowDialog from "@/components/workflow/NewWorkflowDialog";
import { Workflow, WorkflowStep, defaultWorkflows } from "@/types/workflow";

const WorkflowPage = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(defaultWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isNewWorkflowOpen, setIsNewWorkflowOpen] = useState(false);
  const [isNewStepOpen, setIsNewStepOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<Partial<Workflow>>({
    name: "",
    description: "",
    active: true,
    steps: []
  });
  const [newStep, setNewStep] = useState<Partial<WorkflowStep>>({
    name: "",
    description: "",
    triggerDays: 0,
    type: "email",
    messageTemplate: "",
    active: true
  });

  const handleSelectWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name) {
      toast({
        title: "Error",
        description: "Workflow name is required",
        variant: "destructive"
      });
      return;
    }

    const workflowToAdd: Workflow = {
      id: `wf-${Date.now()}`,
      name: newWorkflow.name || "",
      description: newWorkflow.description || "",
      active: newWorkflow.active || true,
      steps: []
    };

    setWorkflows([...workflows, workflowToAdd]);
    setNewWorkflow({
      name: "",
      description: "",
      active: true,
      steps: []
    });
    setIsNewWorkflowOpen(false);
    
    setSelectedWorkflow(workflowToAdd);
    
    toast({
      title: "Success",
      description: "Workflow created successfully",
    });
  };

  const handleCreateStep = () => {
    if (!selectedWorkflow) return;
    if (!newStep.name || !newStep.messageTemplate) {
      toast({
        title: "Error",
        description: "Step name and message template are required",
        variant: "destructive"
      });
      return;
    }

    const stepToAdd: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: newStep.name || "",
      description: newStep.description || "",
      triggerDays: newStep.triggerDays || 0,
      type: newStep.type || "email",
      messageTemplate: newStep.messageTemplate || "",
      active: newStep.active || true
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, stepToAdd]
    };

    setWorkflows(workflows.map(wf => 
      wf.id === selectedWorkflow.id ? updatedWorkflow : wf
    ));
    
    setSelectedWorkflow(updatedWorkflow);
    setNewStep({
      name: "",
      description: "",
      triggerDays: 0,
      type: "email",
      messageTemplate: "",
      active: true
    });
    setIsNewStepOpen(false);
    
    toast({
      title: "Success",
      description: "Step added to workflow",
    });
  };

  const handleToggleWorkflowActive = (workflow: Workflow) => {
    const updatedWorkflows = workflows.map(wf => {
      if (wf.id === workflow.id) {
        return { ...wf, active: !wf.active };
      }
      return wf;
    });
    
    setWorkflows(updatedWorkflows);
    
    if (selectedWorkflow && selectedWorkflow.id === workflow.id) {
      setSelectedWorkflow({ ...selectedWorkflow, active: !selectedWorkflow.active });
    }
    
    toast({
      title: workflow.active ? "Workflow deactivated" : "Workflow activated",
      description: `"${workflow.name}" has been ${workflow.active ? "deactivated" : "activated"}.`,
    });
  };

  const handleToggleStepActive = (stepId: string) => {
    if (!selectedWorkflow) return;

    const updatedSteps = selectedWorkflow.steps.map(step => {
      if (step.id === stepId) {
        return { ...step, active: !step.active };
      }
      return step;
    });

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: updatedSteps
    };

    setWorkflows(workflows.map(wf => 
      wf.id === selectedWorkflow.id ? updatedWorkflow : wf
    ));
    
    setSelectedWorkflow(updatedWorkflow);
    
    const step = selectedWorkflow.steps.find(s => s.id === stepId);
    
    toast({
      title: step?.active ? "Step deactivated" : "Step activated",
      description: `"${step?.name}" has been ${step?.active ? "deactivated" : "activated"}.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage automated collection processes
          </p>
        </div>
        <NewWorkflowDialog
          isOpen={isNewWorkflowOpen}
          onOpenChange={setIsNewWorkflowOpen}
          newWorkflow={newWorkflow}
          setNewWorkflow={setNewWorkflow}
          onCreateWorkflow={handleCreateWorkflow}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-4">
          <WorkflowList
            workflows={workflows}
            selectedWorkflow={selectedWorkflow}
            onSelectWorkflow={handleSelectWorkflow}
            onCreateWorkflow={() => setIsNewWorkflowOpen(true)}
          />
        </div>

        <div className="md:col-span-8">
          {selectedWorkflow ? (
            <WorkflowDetail
              workflow={selectedWorkflow}
              isNewStepOpen={isNewStepOpen}
              setIsNewStepOpen={setIsNewStepOpen}
              newStep={newStep}
              setNewStep={setNewStep}
              onCreateStep={handleCreateStep}
              onToggleStepActive={handleToggleStepActive}
              onToggleWorkflowActive={handleToggleWorkflowActive}
            />
          ) : (
            <div className="bg-white rounded-lg shadow border p-6 text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-medium mb-2">
                  Select or Create a Workflow
                </h3>
                <p className="text-muted-foreground mb-6">
                  Workflows help you automate your invoice collection process with
                  pre-defined steps and reminders.
                </p>
                <Button onClick={() => setIsNewWorkflowOpen(true)}>
                  Create New Workflow
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
