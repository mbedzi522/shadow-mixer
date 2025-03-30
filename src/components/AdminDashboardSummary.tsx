
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTotalFees, CURRENCY_DETAILS, getWithdrawalEvents } from '@/lib/mockBlockchain';
import { formatDistanceToNow } from 'date-fns';

export const AdminDashboardSummary = () => {
  const totalFees = getAllTotalFees();
  const recentWithdrawals = getWithdrawalEvents().slice(0, 5);
  
  // Calculate total fees across all currencies
  const totalFeesSum = Object.entries(totalFees).reduce((sum, [currency, amount]) => {
    return sum + amount;
  }, 0);
  
  // Calculate last 24 hours activity
  const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
  const withdrawalsLast24Hours = getWithdrawalEvents().filter(
    event => event.timestamp > last24Hours
  ).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Business Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalFeesSum.toFixed(4)}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined fees across all currencies
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">24h Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withdrawalsLast24Hours}</div>
            <p className="text-xs text-muted-foreground">
              Withdrawals in the last 24 hours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fee Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.5%</div>
            <p className="text-xs text-muted-foreground">
              Current fee percentage
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getWithdrawalEvents().length}</div>
            <p className="text-xs text-muted-foreground">
              Total processed withdrawals
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Currency</CardTitle>
            <CardDescription>
              Total fees collected per cryptocurrency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(totalFees).map(([currency, amount]) => (
                <div key={currency} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">{currency}</span>
                    <span className="ml-2 text-muted-foreground">
                      {CURRENCY_DETAILS[currency as keyof typeof CURRENCY_DETAILS]?.symbol}
                    </span>
                  </div>
                  <span className="font-bold">{amount.toFixed(6)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest withdrawal transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWithdrawals.map((withdrawal, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {withdrawal.currency} {withdrawal.denomination}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(withdrawal.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    Fee: {(parseFloat(withdrawal.denomination) * 0.005).toFixed(6)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardSummary;
