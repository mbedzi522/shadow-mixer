
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitBranch, Clock } from 'lucide-react';
import { getWithdrawalEvents, CURRENCY_DETAILS } from '@/lib/mockBlockchain';

export function RecentActivity() {
  const events = getWithdrawalEvents().slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <CardDescription>Latest withdrawals from the mixer</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event, index) => {
              const symbol = CURRENCY_DETAILS[event.currency as keyof typeof CURRENCY_DETAILS]?.symbol || '';
              const timeAgo = getTimeAgo(event.timestamp);
              
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <GitBranch className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      Withdrawal of {symbol}{event.denomination}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{timeAgo}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      Recipient: {event.recipient}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No recent activity
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  
  return 'Just now';
}
