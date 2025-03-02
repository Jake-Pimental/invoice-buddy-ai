
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpIcon, FileTextIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadInvoiceProps {
  onClose: () => void;
  onUploadComplete: () => void;
}

const UploadInvoice = ({ onClose, onUploadComplete }: UploadInvoiceProps) => {
  const [activeTab, setActiveTab] = useState("file");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.includes("pdf") && !file.type.includes("image")) {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF or image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newValue = prev + Math.random() * 20;
        if (newValue >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadComplete(true);
            toast({
              description: "Invoice uploaded successfully",
            });
            setTimeout(() => {
              onUploadComplete();
              onClose();
            }, 1200);
          }, 500);
          return 100;
        }
        return newValue;
      });
    }, 500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      toast({
        description: "Invoice information saved",
      });
      setTimeout(() => {
        onUploadComplete();
        onClose();
      }, 1200);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Upload Invoice</CardTitle>
        <CardDescription>
          Upload an invoice file or enter details manually
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <Separator className="my-4" />
        </div>
        
        <CardContent className="p-6 pt-2">
          <TabsContent value="file" className="mt-0">
            {!isUploading && !uploadComplete ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 transition-all duration-200 text-center",
                  isDragOver
                    ? "border-blue-400 bg-blue-50/50"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileTextIcon className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                
                <h3 className="text-lg font-medium mb-2">
                  Drag & drop your invoice file
                </h3>
                
                <p className="text-sm text-gray-500 mb-6">
                  Support for PDF, JPG, PNG files
                </p>
                
                <div className="flex flex-col items-center">
                  <Button className="mb-4" onClick={() => document.getElementById("file-upload")?.click()}>
                    <ArrowUpIcon className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                  
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  
                  <p className="text-xs text-gray-400">
                    Maximum file size: 5MB
                  </p>
                </div>
              </div>
            ) : uploadComplete ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Complete!</h3>
                <p className="text-sm text-gray-500">
                  Your invoice has been successfully uploaded
                </p>
              </div>
            ) : (
              <div className="py-8">
                <div className="flex flex-col items-center">
                  <Loader2Icon className="h-8 w-8 text-blue-500 mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Processing Invoice</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    We're extracting information from your invoice...
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-apple"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {uploadProgress < 100
                      ? "Analyzing document..."
                      : "Finalizing..."}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="manual" className="mt-0">
            <form onSubmit={handleManualSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Client Name</Label>
                    <Input id="client-name" placeholder="Client or Company Name" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <Input id="invoice-number" placeholder="INV-001" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      min="0.01" 
                      step="0.01" 
                      placeholder="0.00" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input 
                      id="due-date" 
                      type="date" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client-email">Client Email</Label>
                  <Input 
                    id="client-email" 
                    type="email" 
                    placeholder="client@example.com" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Invoice for services rendered" 
                    required 
                  />
                </div>
              </div>
            </form>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex justify-between px-6 pb-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          {activeTab === "manual" ? (
            <Button
              type="submit"
              onClick={handleManualSubmit}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Invoice"
              )}
            </Button>
          ) : (
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              disabled={isUploading || uploadComplete}
            >
              {isUploading ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : uploadComplete ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <ArrowUpIcon className="h-4 w-4 mr-2" />
                  Select File
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default UploadInvoice;
