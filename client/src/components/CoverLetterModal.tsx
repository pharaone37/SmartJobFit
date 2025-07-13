import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  coverLetter: string;
  jobTitle: string;
  company: string;
  isGenerating: boolean;
}

export default function CoverLetterModal({
  isOpen,
  onClose,
  coverLetter,
  jobTitle,
  company,
  isGenerating
}: CoverLetterModalProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    toast({
      title: "Copied to clipboard",
      description: "Cover letter copied successfully!",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${company}-${jobTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Cover letter downloaded successfully!",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>AI Cover Letter for {jobTitle} at {company}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Generating personalized cover letter...</span>
            </div>
          ) : coverLetter ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {coverLetter}
                </pre>
              </div>
              
              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <Button onClick={onClose}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No cover letter generated yet.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}