
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowSettings from "./WorkflowSettings";
import WorkflowSteps from "./WorkflowSteps";
import { Workflow, WorkflowStep } from "@/types/workflow";

interface WorkflowDetailProps {
  workflow: Workflow;
  isNewStepOpen: boolean;
  setIsNewStepOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newStep: Partial<WorkflowStep>;
  setNewStep: React.Dispatch<React.SetStateAction<Partial<WorkflowStep>>>;
  onCreateStep: () => void;
  onToggleStepActive: (stepId: string) => void;
  onToggleWorkflowActive: (workflow: Workflow) => void;
}

const WorkflowDetail: React.FC<WorkflowDetailProps> = ({
  workflow,
  isNewStepOpen,
  setIsNewStepOpen,
  newStep,
  setNewStep,
  onCreateStep,
  onToggleStepActive,
  onToggleWorkflowActive,
}) => {
  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-medium">{workflow.name}</h2>
          <p className="text-muted-foreground mt-1">
            {workflow.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={workflow.active ? "outline" : "default"}
            onClick={() => onToggleWorkflowActive(workflow)}
          >
            {workflow.active ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="steps">
        <TabsList className="mb-4">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <WorkflowSteps
            steps={workflow.steps}
            isNewStepOpen={isNewStepOpen}
            setIsNewStepOpen={setIsNewStepOpen}
            newStep={newStep}
            setNewStep={setNewStep}
            onCreateStep={onCreateStep}
            onToggleStepActive={onToggleStepActive}
          />
        </TabsContent>
        <TabsContent value="settings">
          <WorkflowSettings
            workflow={workflow}
            onToggleWorkflowActive={onToggleWorkflowActive}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowDetail;
