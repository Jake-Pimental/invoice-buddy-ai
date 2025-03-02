import { useState } from "react";
import { PlusCircle, ArrowRight, Clock, Mail, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

type WorkflowStep = {
  id: string;
  name: string;
  description: string;
  triggerDays: number;
  messageTemplate: string;
  type: "email" | "sms" | "reminder";
  active: boolean;
};

type Workflow = {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  active: boolean;
};

const defaultWorkflows: Workflow[] = [
  {
    id: "wf-001",
    name: "Standard Collection",
    description: "A standard 30-day collection process with regular reminders",
    active: true,
    steps: [
      {
        id: "step-001",
        name: "Initial Reminder",
        description: "Sent 3 days before due date",
        triggerDays: -3,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nThis is a friendly reminder that invoice {{invoiceNumber}} for {{amount}} is due in 3 days on {{dueDate}}.\n\nThank you for your business!\n\nBest regards,\n{{companyName}}",
        active: true
      },
      {
        id: "step-002",
        name: "Due Date Reminder",
        description: "Sent on the due date",
        triggerDays: 0,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nJust a reminder that invoice {{invoiceNumber}} for {{amount}} is due today.\n\nThank you for your business!\n\nBest regards,\n{{companyName}}",
        active: true
      },
      {
        id: "step-003",
        name: "First Follow-up",
        description: "Sent 7 days after due date",
        triggerDays: 7,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nOur records show that invoice {{invoiceNumber}} for {{amount}} is now 7 days overdue. If you have already made the payment, please disregard this message.\n\nIf you have any questions about this invoice, please don't hesitate to contact us.\n\nBest regards,\n{{companyName}}",
        active: true
      },
      {
        id: "step-004",
        name: "Final Notice",
        description: "Sent 14 days after due date",
        triggerDays: 14,
        type: "sms",
        messageTemplate: "IMPORTANT: Invoice {{invoiceNumber}} for {{amount}} is now 14 days past due. Please contact us immediately at {{companyPhone}} to make arrangements for payment.",
        active: true
      }
    ]
  },
  {
    id: "wf-002",
    name: "Gentle Collection",
    description: "A more lenient approach for valued clients",
    active: false,
    steps: [
      {
        id: "step-005",
        name: "Friendly Reminder",
        description: "Sent 7 days after due date",
        triggerDays: 7,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nI hope this message finds you well. I wanted to check in about invoice {{invoiceNumber}} for {{amount}} which was due on {{dueDate}}.\n\nPlease let me know if you have any questions or if there's anything I can assist with regarding this payment.\n\nWarm regards,\n{{companyName}}",
        active: true
      },
      {
        id: "step-006",
        name: "Check-in",
        description: "Sent 14 days after due date",
        triggerDays: 14,
        type: "email",
        messageTemplate: "Hello {{clientName}},\n\nI'm following up on invoice {{invoiceNumber}} for {{amount}} which was due on {{dueDate}}. We value your business and would appreciate an update on the status of this payment.\n\nIf you're experiencing any issues, please let us know how we can help.\n\nBest regards,\n{{companyName}}",
        active: true
      }
    ]
  }
];

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

  const renderPlaceholder = (placeholder: string) => {
    return (
      <span 
        key={placeholder}
        className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium"
      >
        {placeholder}
      </span>
    );
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
        <Dialog open={isNewWorkflowOpen} onOpenChange={setIsNewWorkflowOpen}>
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
              <Button variant="outline" onClick={() => setIsNewWorkflowOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white rounded-lg shadow border p-4">
            <h2 className="text-xl font-medium mb-4">Your Workflows</h2>
            {workflows.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No workflows created yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsNewWorkflowOpen(true)}
                >
                  Create Your First Workflow
                </Button>
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
                    onClick={() => handleSelectWorkflow(workflow)}
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
        </div>

        <div className="md:col-span-8">
          {selectedWorkflow ? (
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center justify-between mb-6">
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

              <Tabs defaultValue="steps">
                <TabsList className="mb-4">
                  <TabsTrigger value="steps">Steps</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="steps">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Workflow Steps</h3>
                      <Dialog open={isNewStepOpen} onOpenChange={setIsNewStepOpen}>
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
                                  value={newStep.name}
                                  onChange={(e) => setNewStep({...newStep, name: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="trigger-days">Trigger (Days)</Label>
                                <Input 
                                  id="trigger-days" 
                                  type="number"
                                  placeholder="7" 
                                  value={newStep.triggerDays}
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
                                value={newStep.description}
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
                                value={newStep.messageTemplate}
                                onChange={(e) => setNewStep({...newStep, messageTemplate: e.target.value})}
                              />
                              <p className="text-xs text-muted-foreground">
                                Available variables: {'{'}{'{'}}clientName{'}'}{'}'}, {'{'}{'{'}}invoiceNumber{'}'}{'}'}, {'{'}{'{'}}amount{'}'}{'}'}, {'{'}{'{'}}dueDate{'}'}{'}'}, {'{'}{'{'}}companyName{'}'}{'}'}
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsNewStepOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateStep}>Add Step</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {selectedWorkflow.steps.length === 0 ? (
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
                        {selectedWorkflow.steps.map((step, index) => (
                          <Card 
                            key={step.id} 
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
                                  onClick={() => handleToggleStepActive(step.id)}
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
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="settings">
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
                              value={selectedWorkflow.name}
                              readOnly
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="workflow-description">Description</Label>
                            <Textarea 
                              id="workflow-description" 
                              value={selectedWorkflow.description}
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
                              variant={selectedWorkflow.active ? "outline" : "default"}
                              onClick={() => handleToggleWorkflowActive(selectedWorkflow)}
                            >
                              {selectedWorkflow.active ? "Deactivate" : "Activate"}
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
                </TabsContent>
              </Tabs>
            </div>
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
