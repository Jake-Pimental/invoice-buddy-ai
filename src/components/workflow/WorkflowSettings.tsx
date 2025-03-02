
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { Workflow } from "@/types/workflow";

interface WorkflowSettingsProps {
  workflow: Workflow;
  onToggleWorkflowActive: (workflow: Workflow) => void;
}

const WorkflowSettings: React.FC<WorkflowSettingsProps> = ({ workflow, onToggleWorkflowActive }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Workflow Settings</CardTitle>
            <CardDescription>
              Configure general settings for this workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input 
                id="workflow-name" 
                value={workflow.name}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea 
                id="workflow-description" 
                value={workflow.description}
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Workflow Status</h4>
                <p className="text-sm text-muted-foreground">
                  Activate or deactivate this workflow
                </p>
              </div>
              <Button
                variant={workflow.active ? "outline" : "default"}
                onClick={() => onToggleWorkflowActive(workflow)}
              >
                {workflow.active ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Actions that cannot be undone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3 border border-red-200 rounded-md bg-red-50">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-red-800">Delete this workflow</h4>
                  <p className="text-sm text-red-600">
                    This action cannot be undone
                  </p>
                </div>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowSettings;
