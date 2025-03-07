
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Workflow as WorkflowType, WorkflowStep } from "@/types/workflow";
import WorkflowList from "@/components/workflow/WorkflowList";
import WorkflowDetail from "@/components/workflow/WorkflowDetail";
import NewWorkflowDialog from "@/components/workflow/NewWorkflowDialog";
import WorkflowFlow from "@/components/workflow/WorkflowFlow";

const Workflow = () => {
  const [workflows, setWorkflows] = useState<WorkflowType[]>([
    {
      id: "1",
      name: "Invoice Processing",
      description: "Process new invoices automatically",
      active: true,
      steps: [
        {
          id: "step1",
          name: "Extract Data",
          description: "Extract data from invoice using OCR",
          type: "ocr",
          active: true,
          triggerDays: 0,
          messageTemplate: "Starting invoice data extraction process..."
        },
        {
          id: "step2",
          name: "Validate Information",
          description: "Validate extracted information against client database",
          type: "validation",
          active: true,
          triggerDays: 0,
          messageTemplate: "Validating invoice data against records..."
        },
        {
          id: "step3",
          name: "Archive Document",
          description: "Store processed invoice in document management system",
          type: "storage",
          active: true,
          triggerDays: 1,
          messageTemplate: "Archiving invoice to secure storage..."
        },
      ],
    },
    {
      id: "2",
      name: "Client Onboarding",
      description: "Automated client welcome and setup",
      active: false,
      steps: [
        {
          id: "step1",
          name: "Welcome Email",
          description: "Send automated welcome email to new client",
          type: "email",
          active: true,
          triggerDays: 0,
          messageTemplate: "Hello {{clientName}},\n\nWelcome to our service! We're excited to have you on board."
        },
        {
          id: "step2",
          name: "Setup Client Profile",
          description: "Create client profile in system",
          type: "profile",
          active: true,
          triggerDays: 1,
          messageTemplate: "Setting up new client profile..."
        },
      ],
    },
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(
    workflows[0]
  );
  const [isNewWorkflowOpen, setIsNewWorkflowOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<Partial<WorkflowType>>({
    name: "",
    description: "",
  });
  const [isNewStepOpen, setIsNewStepOpen] = useState(false);
  const [newStep, setNewStep] = useState<Partial<WorkflowStep>>({
    name: "",
    description: "",
    type: "email",
    triggerDays: 0,
    messageTemplate: ""
  });

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name) return;
    
    const createdWorkflow: WorkflowType = {
      id: uuidv4(),
      name: newWorkflow.name || "",
      description: newWorkflow.description || "",
      active: false,
      steps: [],
    };

    setWorkflows([...workflows, createdWorkflow]);
    setSelectedWorkflow(createdWorkflow);
    setNewWorkflow({ name: "", description: "" });
    setIsNewWorkflowOpen(false);
  };

  const handleCreateStep = () => {
    if (!selectedWorkflow || !newStep.name) return;

    const createdStep: WorkflowStep = {
      id: uuidv4(),
      name: newStep.name || "",
      description: newStep.description || "",
      type: newStep.type || "email",
      triggerDays: newStep.triggerDays || 0,
      messageTemplate: newStep.messageTemplate || "",
      active: true,
    };

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, createdStep],
    };

    setWorkflows(
      workflows.map((w) =>
        w.id === selectedWorkflow.id ? updatedWorkflow : w
      )
    );
    setSelectedWorkflow(updatedWorkflow);
    setNewStep({
      name: "",
      description: "",
      type: "email",
      triggerDays: 0,
      messageTemplate: ""
    });
    setIsNewStepOpen(false);
  };

  const handleToggleStepActive = (stepId: string) => {
    if (!selectedWorkflow) return;

    const updatedSteps = selectedWorkflow.steps.map((step) =>
      step.id === stepId ? { ...step, active: !step.active } : step
    );

    const updatedWorkflow = {
      ...selectedWorkflow,
      steps: updatedSteps,
    };

    setWorkflows(
      workflows.map((w) =>
        w.id === selectedWorkflow.id ? updatedWorkflow : w
      )
    );
    setSelectedWorkflow(updatedWorkflow);
  };

  const handleToggleWorkflowActive = (workflow: WorkflowType) => {
    const updatedWorkflow = {
      ...workflow,
      active: !workflow.active,
    };

    setWorkflows(
      workflows.map((w) => (w.id === workflow.id ? updatedWorkflow : w))
    );

    if (selectedWorkflow && selectedWorkflow.id === workflow.id) {
      setSelectedWorkflow(updatedWorkflow);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {/* Navigation header */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Workflow Automation</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage automated workflows for your invoices
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => setIsNewWorkflowOpen(true)}
              className="mb-4 w-full"
            >
              <Plus size={16} className="mr-2" />
              New Workflow
            </Button>
            <WorkflowList
              workflows={workflows}
              selectedWorkflow={selectedWorkflow}
              onSelectWorkflow={setSelectedWorkflow}
              onCreateWorkflow={() => setIsNewWorkflowOpen(true)}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          {selectedWorkflow ? (
            <>
              <div className="bg-white rounded-lg shadow border p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-medium">{selectedWorkflow.name}</h2>
                    <p className="text-muted-foreground mt-1">
                      {selectedWorkflow.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedWorkflow.active ? "outline" : "default"}
                      onClick={() => handleToggleWorkflowActive(selectedWorkflow)}
                    >
                      {selectedWorkflow.active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
                
                {/* React Flow Visualization */}
                {selectedWorkflow.steps.length > 0 ? (
                  <WorkflowFlow workflow={selectedWorkflow} />
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-lg bg-gray-50">
                    <p className="text-muted-foreground">No steps added yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setIsNewStepOpen(true)}
                    >
                      Add Your First Step
                    </Button>
                  </div>
                )}
              </div>
              
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
            </>
          ) : (
            <div className="bg-white rounded-lg shadow border p-6 text-center">
              <h2 className="text-xl font-medium mb-2">No Workflow Selected</h2>
              <p className="text-muted-foreground mb-4">
                Select a workflow from the list or create a new one
              </p>
              <Button onClick={() => setIsNewWorkflowOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create Workflow
              </Button>
            </div>
          )}
        </div>
      </div>

      <NewWorkflowDialog
        isOpen={isNewWorkflowOpen}
        onOpenChange={setIsNewWorkflowOpen}
        newWorkflow={newWorkflow}
        setNewWorkflow={setNewWorkflow}
        onCreateWorkflow={handleCreateWorkflow}
      />
    </div>
  );
};

export default Workflow;
