
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Workflow, WorkflowStep } from '@/types/workflow';
import { Badge } from '@/components/ui/badge';
import { Clock, Mail, MessageSquare, AlertTriangle } from 'lucide-react';

interface WorkflowFlowProps {
  workflow: Workflow;
}

// Custom node for workflow steps
const StepNode = ({ data }: { data: WorkflowStep }) => {
  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'reminder':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatTriggerDays = (days: number) => {
    if (days < 0) {
      return `${Math.abs(days)} days before due date`;
    } else if (days === 0) {
      return 'On due date';
    } else {
      return `${days} days after due date`;
    }
  };

  return (
    <div className={`p-3 rounded-lg border shadow bg-white ${data.active ? 'border-primary' : 'border-gray-200 opacity-70'}`}>
      <div className="flex items-center gap-2 font-medium mb-1">
        {getStepTypeIcon(data.type)}
        {data.name}
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {formatTriggerDays(data.triggerDays)}
      </div>
      <div className="text-xs">{data.description}</div>
      {!data.active && (
        <Badge variant="outline" className="mt-2 text-gray-500">
          Disabled
        </Badge>
      )}
      <Handle type="target" position={Position.Left} className="!bg-gray-300 !w-3 !h-3 !border-gray-400" />
      <Handle type="source" position={Position.Right} className="!bg-gray-300 !w-3 !h-3 !border-gray-400" />
    </div>
  );
};

const WorkflowFlow: React.FC<WorkflowFlowProps> = ({ workflow }) => {
  // Create nodes from workflow steps
  const initialNodes: Node[] = useMemo(() => 
    workflow.steps.map((step, index) => ({
      id: step.id,
      data: step,
      position: { x: index * 250 + 50, y: 100 },
      type: 'step'
    })), [workflow]);

  // Create edges connecting the nodes in sequence
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    for (let i = 0; i < workflow.steps.length - 1; i++) {
      edges.push({
        id: `e${workflow.steps[i].id}-${workflow.steps[i + 1].id}`,
        source: workflow.steps[i].id,
        target: workflow.steps[i + 1].id,
        animated: true,
        style: { stroke: '#9333ea' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#9333ea',
        },
      });
    }
    return edges;
  }, [workflow]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  const nodeTypes = useMemo(() => ({ step: StepNode }), []);

  return (
    <div className="h-[400px] border rounded-md overflow-hidden bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls position="bottom-right" />
        <Background color="#e2e8f0" gap={16} size={1} />
        <Panel position="top-right">
          <div className="bg-white p-2 rounded shadow text-xs">
            {workflow.active ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Active Workflow
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                Inactive Workflow
              </Badge>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default WorkflowFlow;
