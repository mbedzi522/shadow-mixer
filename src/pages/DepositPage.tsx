
import React, { useState } from 'react';
import { HeaderNav } from '@/components/HeaderNav';
import { PoolSelector } from '@/components/PoolSelector';
import { PoolStats } from '@/components/PoolStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Copy, Info, ArrowRight, Shield, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generatePrivateKey, derivePublicKey, generateNullifier, generateSecret, createCommitment, createNote } from '@/lib/cryptoUtils';
import { deposit, CURRENCY_DETAILS } from '@/lib/mockBlockchain';
import { saveNote } from '@/lib/noteStorage';
import { useNavigate } from 'react-router-dom';

const DepositPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [selectedDenomination, setSelectedDenomination] = useState('1');
  const [isDepositingState, setIsDepositing] = useState(false);
  const [isDepositComplete, setIsDepositComplete] = useState(false);
  const [noteString, setNoteString] = useState('');
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeposit = async () => {
    setIsDepositing(true);
    
    try {
      // Simulate a delay to represent blockchain interaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate cryptographic values
      const privateKey = generatePrivateKey();
      const nullifier = generateNullifier(privateKey);
      const secret = generateSecret();
      const commitment = createCommitment(nullifier, secret);
      
      // Create a deposit on the mock blockchain
      const success = deposit(selectedCurrency, selectedDenomination, commitment);
      
      if (success) {
        // Create a note for the user
        const note = createNote(selectedCurrency, selectedDenomination, nullifier, secret);
        setNoteString(note);
        
        // Save the note locally
        saveNote(note);
        
        setIsDepositComplete(true);
        setShowNoteDialog(true);
      } else {
        throw new Error("Deposit failed");
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const copyNoteToClipboard = () => {
    navigator.clipboard.writeText(noteString);
    toast({
      title: "Note copied to clipboard",
      description: "Make sure to store it securely",
    });
  };

  const handleDialogClose = () => {
    setShowNoteDialog(false);
  };

  const goToWithdraw = () => {
    navigate('/withdraw');
  };

  const goToNotes = () => {
    navigate('/notes');
  };

  const symbol = CURRENCY_DETAILS[selectedCurrency as keyof typeof CURRENCY_DETAILS]?.symbol || '';

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Deposit Funds</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>
                Learn how deposits enhance your privacy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="font-semibold">Deposit Funds</h3>
                  <p className="text-sm text-muted-foreground">
                    Deposit your funds into the mixer smart contract using a fixed denomination
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="font-semibold">Save Your Note</h3>
                  <p className="text-sm text-muted-foreground">
                    Store the secret note securely - it's the only way to withdraw your funds
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="font-semibold">Wait (Recommended)</h3>
                  <p className="text-sm text-muted-foreground">
                    For best privacy, wait before withdrawing to increase the anonymity set
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <PoolSelector 
                selectedCurrency={selectedCurrency}
                selectedDenomination={selectedDenomination}
                onCurrencyChange={setSelectedCurrency}
                onDenominationChange={setSelectedDenomination}
              />
              
              <PoolStats 
                currency={selectedCurrency} 
                denomination={selectedDenomination}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Make a Deposit</CardTitle>
                <CardDescription>
                  Deposit {symbol}{selectedDenomination} {selectedCurrency}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    You will receive a secret note after depositing. This note is required to withdraw your funds.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="font-medium">{symbol}{selectedDenomination} {selectedCurrency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fee:</span>
                    <span className="font-medium">0.001 ETH</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  By proceeding, you'll deposit funds into the mixer smart contract and receive a secret note to withdraw later.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-mixer-primary to-mixer-secondary hover:from-mixer-primary/90 hover:to-mixer-secondary/90"
                  onClick={handleDeposit}
                  disabled={isDepositingState}
                >
                  {isDepositingState ? "Processing..." : isDepositComplete ? "Deposit Complete" : "Make Deposit"} 
                  {!isDepositingState && !isDepositComplete && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Dialog open={showNoteDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Your Private Note</DialogTitle>
            <DialogDescription>
              This note is the only way to withdraw your funds. Copy and save it securely.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertTitle>Important Security Warning</AlertTitle>
              <AlertDescription>
                Never share this note with anyone. Anyone with this note can withdraw your funds.
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted p-3 rounded-md">
              <div className="font-mono text-xs break-all select-all border border-border bg-card p-3 rounded">
                {noteString}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button className="flex-1" variant="outline" onClick={copyNoteToClipboard}>
                <Copy className="mr-2 h-4 w-4" /> Copy Note
              </Button>
              <Button className="flex-1" variant="outline" onClick={goToNotes}>
                <FileText className="mr-2 h-4 w-4" /> View Saved Notes
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <DialogFooter className="sm:justify-start">
            <div className="w-full space-y-2">
              <p className="text-sm text-muted-foreground">
                For maximum privacy, wait before withdrawing your funds.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-mixer-primary to-mixer-secondary hover:from-mixer-primary/90 hover:to-mixer-secondary/90"
                onClick={goToWithdraw}
              >
                Go to Withdraw
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ShadowMixer. All rights reserved.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Disclaimer: This is a demo application for educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DepositPage;
