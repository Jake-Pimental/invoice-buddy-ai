
import React from "react";
import { format, parseISO } from "date-fns";
import { FileText, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice } from "@/types";

interface ActivityTimelineProps {
  invoice: Invoice;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ invoice }) => {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
          
          <div className="space-y-6">
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-3 w-3 text-blue-600" />
              </div>
              <p className="text-sm font-medium">Invoice created</p>
              <p className="text-xs text-gray-500">{format(parseISO(invoice.issueDate), "MMMM d, yyyy")}</p>
            </div>
            
            {invoice.remindersSent > 0 && (
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Mail className="h-3 w-3 text-yellow-600" />
                </div>
                <p className="text-sm font-medium">First reminder sent</p>
                <p className="text-xs text-gray-500">{format(parseISO(invoice.lastContactDate || invoice.dueDate), "MMMM d, yyyy")}</p>
              </div>
            )}
            
            {invoice.status === 'paid' && (
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <p className="text-sm font-medium">Payment received</p>
                <p className="text-xs text-gray-500">August 30, 2023</p>
              </div>
            )}
            
            {invoice.status === 'overdue' && (
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-3 w-3 text-red-600" />
                </div>
                <p className="text-sm font-medium">Invoice overdue</p>
                <p className="text-xs text-gray-500">{format(parseISO(invoice.dueDate), "MMMM d, yyyy")}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
