
import React from 'react';
import { HeaderNav } from '@/components/HeaderNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboardSummary from '@/components/AdminDashboardSummary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CURRENCY_DETAILS, getAllTotalFees, FEE_RECIPIENT, FEE_PERCENTAGE } from '@/lib/mockBlockchain';

const AdminPage = () => {
  const totalFees = getAllTotalFees();
  
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <AdminDashboardSummary />
          </TabsContent>
          
          <TabsContent value="revenue">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Details</CardTitle>
                  <CardDescription>
                    Comprehensive breakdown of fees collected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Fee Summary</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm font-medium mb-2">Fee Percentage</p>
                          <p className="text-2xl font-bold">{FEE_PERCENTAGE}%</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm font-medium mb-2">Fee Recipient</p>
                          <p className="text-xs font-mono break-all">{FEE_RECIPIENT}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Collected Fees by Currency</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4">Currency</th>
                              <th className="text-left py-3 px-4">Symbol</th>
                              <th className="text-left py-3 px-4">Total Fees</th>
                              <th className="text-left py-3 px-4">USD Estimate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(totalFees).map(([currency, amount]) => {
                              // Mock USD values for demonstration
                              const mockUsdRates: Record<string, number> = {
                                ETH: 2500,
                                BTC: 40000,
                                DAI: 1,
                                USDC: 1
                              };
                              const usdValue = amount * (mockUsdRates[currency] || 0);
                              
                              return (
                                <tr key={currency} className="border-b">
                                  <td className="py-3 px-4">{currency}</td>
                                  <td className="py-3 px-4">
                                    {CURRENCY_DETAILS[currency as keyof typeof CURRENCY_DETAILS]?.symbol}
                                  </td>
                                  <td className="py-3 px-4 font-mono">
                                    {amount.toFixed(6)}
                                  </td>
                                  <td className="py-3 px-4 font-mono">
                                    ${usdValue.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tor Deployment Settings</CardTitle>
                  <CardDescription>
                    Information about your Tor hidden service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Onion Address</h3>
                      <p className="font-mono text-sm break-all bg-muted p-2 rounded">
                        http://shadowmixer.onion
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        This address will be updated with your actual .onion address when deployed using the deploy-to-tor.sh script.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Deployment Commands</h3>
                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        <p>chmod +x deploy-to-tor.sh</p>
                        <p>./deploy-to-tor.sh</p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Business Setup Commands</h3>
                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        <p>chmod +x setup-shadowmixer-business.sh</p>
                        <p>sudo ./setup-shadowmixer-business.sh</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Fee Settings</CardTitle>
                  <CardDescription>
                    Configure your revenue settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Current Fee Settings</h3>
                      <p><strong>Fee Percentage:</strong> {FEE_PERCENTAGE}%</p>
                      <p className="break-all mt-2"><strong>Fee Recipient Address:</strong> {FEE_RECIPIENT}</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">How to Update Fees</h3>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Edit src/lib/mockBlockchain.ts</li>
                        <li>Modify the FEE_PERCENTAGE value</li>
                        <li>Update the FEE_RECIPIENT address if needed</li>
                        <li>Rebuild and redeploy the application</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ShadowMixer Admin Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;
