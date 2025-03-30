
import React, { useState } from 'react';
import { HeaderNav } from '@/components/HeaderNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  getAllTotalFees, 
  DENOMINATIONS, 
  CURRENCY_DETAILS,
  FEE_PERCENTAGE,
  FEE_RECIPIENT,
  getWithdrawalEvents
} from '@/lib/mockBlockchain';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

const AdminPage = () => {
  const [recipient, setRecipient] = useState(FEE_RECIPIENT);
  const totalFees = getAllTotalFees();
  const withdrawalEvents = getWithdrawalEvents();

  const handleWithdraw = (currency: string) => {
    toast({
      title: "Fees Withdrawn",
      description: `${totalFees[currency]} ${currency} has been sent to ${recipient}`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fee Summary</CardTitle>
              <CardDescription>
                Current fees collected across all pools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-muted-foreground">Current fee percentage: <span className="font-bold">{FEE_PERCENTAGE}%</span></p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead>Total Fees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(totalFees).map(([currency, amount]) => (
                    <TableRow key={currency}>
                      <TableCell className="font-medium">
                        {currency} ({CURRENCY_DETAILS[currency as keyof typeof CURRENCY_DETAILS]?.symbol})
                      </TableCell>
                      <TableCell>{amount.toFixed(6)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWithdraw(currency)}
                          disabled={amount <= 0}
                        >
                          Withdraw
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Separator className="my-6" />
              
              <div className="space-y-2">
                <Label html-for="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Address where fees will be sent when withdrawn
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Fee Collection</CardTitle>
              <CardDescription>
                Latest fees collected from withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalEvents
                    .filter(event => event.fee !== undefined)
                    .slice(0, 10)
                    .map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{event.currency}</TableCell>
                        <TableCell>{event.denomination}</TableCell>
                        <TableCell>{event.fee?.toFixed(6)}</TableCell>
                        <TableCell>{formatDistanceToNow(event.timestamp, { addSuffix: true })}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pool Statistics</CardTitle>
              <CardDescription>
                Overview of all pools and their activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool</TableHead>
                    <TableHead>Denomination</TableHead>
                    <TableHead>Fee per Transaction</TableHead>
                    <TableHead>Anonymity Set</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(DENOMINATIONS).flatMap(currency => 
                    DENOMINATIONS[currency as keyof typeof DENOMINATIONS].map(denomination => (
                      <TableRow key={`${currency}-${denomination}`}>
                        <TableCell className="font-medium">{currency}</TableCell>
                        <TableCell>
                          {CURRENCY_DETAILS[currency as keyof typeof CURRENCY_DETAILS]?.symbol} {denomination}
                        </TableCell>
                        <TableCell>
                          {(parseFloat(denomination) * (FEE_PERCENTAGE / 100)).toFixed(6)} {currency}
                        </TableCell>
                        <TableCell>{Math.floor(Math.random() * 50) + 10}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      
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

export default AdminPage;
