
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Invoice } from "@/types";
import { formatCurrency } from "@/utils/invoiceUtils";

interface PaymentSummaryProps {
  invoice: Invoice;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ invoice }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="font-medium">{formatCurrency(invoice.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Tax</span>
            <span className="font-medium">$0.00</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-base font-medium">Total</span>
            <span className="text-lg font-semibold">{formatCurrency(invoice.amount)}</span>
          </div>
          
          {invoice.status === 'partial' && (
            <>
              <Separator />
              <div className="flex justify-between text-green-600">
                <span className="text-sm font-medium">Paid</span>
                <span className="font-medium">{formatCurrency(invoice.amount * 0.5)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span className="text-sm font-medium">Remaining</span>
                <span className="font-medium">{formatCurrency(invoice.amount * 0.5)}</span>
              </div>
            </>
          )}
        </div>

        {invoice.status !== 'paid' && (
          <div className="mt-6">
            <Button className="w-full">Send Payment Link</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
