
import React from "react";
import { Workflow } from "@/types/workflow";

interface WorkflowListProps {
  workflows: Workflow[];
  selectedWorkflow: Workflow | null;
  onSelectWorkflow: (workflow: Workflow) => void;
  onCreateWorkflow: () => void;
}

const WorkflowList: React.FC<WorkflowListProps> = ({
  workflows,
  selectedWorkflow,
  onSelectWorkflow,
  onCreateWorkflow,
}) => {
  return (
    <div className="bg-white rounded-lg shadow border p-4">
      <h2 className="text-xl font-medium mb-4">Your Workflows</h2>
      {workflows.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No workflows created yet</p>
          <button 
            className="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            onClick={onCreateWorkflow}
          >
            Create Your First Workflow
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className={`p-4 rounded-md border cursor-pointer transition-all ${
                selectedWorkflow?.id === workflow.id
                  ? "border-primary bg-accent"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => onSelectWorkflow(workflow)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{workflow.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {workflow.steps.length} steps
                  </p>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${
                  workflow.active 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {workflow.active ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowList;
