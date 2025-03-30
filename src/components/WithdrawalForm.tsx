
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight, CircleOff, ShieldAlert, Key, CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StoredNote } from '@/lib/noteStorage';
import { parseNote, generateProof, createCommitment } from '@/lib/cryptoUtils';
import { withdraw, getMerkleProof, FEE_PERCENTAGE } from '@/lib/mockBlockchain';

interface WithdrawalFormProps {
  selectedNote: StoredNote | null;
  onWithdrawalComplete: (success: boolean) => void;
}

export function WithdrawalForm({ selectedNote, onWithdrawalComplete }: WithdrawalFormProps) {
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [relayerMode, setRelayerMode] = useState<boolean>(false);
  const { toast } = useToast();

  const handleWithdrawal = async () => {
    if (!selectedNote) {
      toast({
        title: "No note selected",
        description: "Please select a note to withdraw",
        variant: "destructive",
      });
      return;
    }

    if (!recipientAddress || !recipientAddress.startsWith('0x')) {
      toast({
        title: "Invalid recipient address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const noteData = parseNote(selectedNote.note);
      if (!noteData) {
        throw new Error("Invalid note format");
      }

      const { currency, amount, nullifier, secret } = noteData;
      
      // Generate commitment from nullifier and secret
      const commitment = createCommitment(nullifier, secret);
      
      // Get the Merkle proof for the commitment
      const merkleProof = getMerkleProof(currency, amount, commitment);
      
      // Generate the zero-knowledge proof
      const { proof, publicSignals } = generateProof(
        commitment,
        nullifier,
        secret,
        merkleProof
      );
      
      // Perform the withdrawal
      const success = withdraw(
        currency,
        amount,
        proof,
        publicSignals,
        recipientAddress
      );
      
      if (success) {
        // Calculate fee amount
        const amountNumber = parseFloat(amount);
        const feeAmount = amountNumber * (FEE_PERCENTAGE / 100);
        const netAmount = amountNumber - feeAmount;
        
        toast({
          title: "Withdrawal successful",
          description: `${netAmount.toFixed(6)} ${currency} has been sent to your address (${FEE_PERCENTAGE}% fee applied)`,
        });
        onWithdrawalComplete(true);
      } else {
        throw new Error("Withdrawal failed");
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      onWithdrawalComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedNote) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdraw from Mixer</CardTitle>
          <CardDescription>Select a note to withdraw your funds</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col items-center justify-center text-center">
          <CircleOff className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
          <p className="text-muted-foreground">No note selected</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please select a note from your list of saved notes
          </p>
        </CardContent>
      </Card>
    );
  }

  const noteData = parseNote(selectedNote.note);
  
  // Calculate fee if note data is valid
  let feeAmount = 0;
  let netAmount = 0;
  
  if (noteData) {
    const amountNumber = parseFloat(noteData.amount);
    feeAmount = amountNumber * (FEE_PERCENTAGE / 100);
    netAmount = amountNumber - feeAmount;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw from Mixer</CardTitle>
        <CardDescription>
          Complete the form to withdraw your funds privately
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Privacy Information</AlertTitle>
          <AlertDescription>
            {relayerMode 
              ? "Using a relayer for better privacy. Transaction gas will be paid by the relayer service."
              : "You're withdrawing directly, which may link your withdrawal to your address. Consider using a relayer for better privacy."}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Selected Note</h3>
          <div className="bg-muted p-3 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Currency:</span>
              <span className="font-medium">{noteData?.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-medium">{noteData?.amount}</span>
            </div>
            
            {/* Fee information */}
            <Separator className="my-1" />
            <div className="flex justify-between text-amber-500">
              <span className="text-sm">Service Fee ({FEE_PERCENTAGE}%):</span>
              <span className="font-medium">-{feeAmount.toFixed(6)} {noteData?.currency}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-sm">You will receive:</span>
              <span>{netAmount.toFixed(6)} {noteData?.currency}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="recipient" className="text-sm font-medium">
            Recipient Address
          </label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The address where you want to receive the funds
          </p>
        </div>

        <Separator />

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className={`flex-1 ${relayerMode ? 'bg-gradient-to-r from-mixer-primary to-mixer-secondary text-white' : ''}`}
            onClick={() => setRelayerMode(true)}
          >
            <Key className="h-4 w-4 mr-2" />
            Use Relayer
          </Button>
          <Button 
            variant="outline" 
            className={`flex-1 ${!relayerMode ? 'bg-gradient-to-r from-mixer-primary to-mixer-secondary text-white' : ''}`}
            onClick={() => setRelayerMode(false)}
          >
            <ShieldAlert className="h-4 w-4 mr-2" />
            Direct Withdrawal
          </Button>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-mixer-primary to-mixer-secondary hover:from-mixer-primary/90 hover:to-mixer-secondary/90"
          disabled={isLoading}
          onClick={handleWithdrawal}
        >
          {isLoading ? "Processing..." : "Withdraw Funds"} 
          {!isLoading && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>
      </CardContent>
    </Card>
  );
}
