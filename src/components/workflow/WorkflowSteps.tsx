
import React from "react";
import { Button } from "@/components/ui/button";
import NewStepDialog from "./NewStepDialog";
import WorkflowStep from "./WorkflowStep";
import { WorkflowStep as WorkflowStepType } from "@/types/workflow";

interface WorkflowStepsProps {
  steps: WorkflowStepType[];
  isNewStepOpen: boolean;
  setIsNewStepOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newStep: Partial<WorkflowStepType>;
  setNewStep: React.Dispatch<React.SetStateAction<Partial<WorkflowStepType>>>;
  onCreateStep: () => void;
  onToggleStepActive: (stepId: string) => void;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  steps,
  isNewStepOpen,
  setIsNewStepOpen,
  newStep,
  setNewStep,
  onCreateStep,
  onToggleStepActive,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Workflow Steps</h3>
        <NewStepDialog
          isOpen={isNewStepOpen}
          onOpenChange={setIsNewStepOpen}
          newStep={newStep}
          setNewStep={setNewStep}
          onCreateStep={onCreateStep}
        />
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No steps added yet</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsNewStepOpen(true)}
          >
            Add Your First Step
          </Button>
        </div>
      ) : (
        <div className="space-y-3 relative">
          <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-gray-200"></div>
          {steps.map((step, index) => (
            <WorkflowStep 
              key={step.id}
              step={step}
              index={index}
              onToggleStepActive={onToggleStepActive}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowSteps;
