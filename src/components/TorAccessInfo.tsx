
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, ExternalLink } from "lucide-react";

export const TorAccessInfo = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Alert className="mb-4 border-amber-500">
        <Shield className="h-4 w-4 text-amber-500" />
        <AlertTitle>Enhanced Privacy Available</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          <span>This mixer is accessible through the Tor network for maximum privacy.</span>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Learn more
          </Button>
        </AlertDescription>
      </Alert>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Access ShadowMixer through Tor</DialogTitle>
            <DialogDescription>
              For maximum privacy protection, access this service through the Tor network.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p>
              Accessing ShadowMixer through Tor provides additional layers of privacy:
            </p>
            
            <ul className="list-disc pl-5 space-y-1">
              <li>Your IP address remains hidden</li>
              <li>Your browsing activity cannot be tracked</li>
              <li>You bypass potential network surveillance</li>
              <li>Your location remains private</li>
            </ul>
            
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-mono break-all">
                http://shadowmixer.onion
                <span className="text-muted-foreground ml-2">(Example Onion Address)</span>
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Replace with your actual .onion address after setting up the hidden service.
            </p>
            
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              
              <a href="https://www.torproject.org/download/" target="_blank" rel="noopener noreferrer">
                <Button variant="default" className="flex items-center gap-2">
                  <span>Download Tor Browser</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TorAccessInfo;
