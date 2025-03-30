
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Jan', deposits: 400, withdrawals: 240 },
  { name: 'Feb', deposits: 300, withdrawals: 138 },
  { name: 'Mar', deposits: 520, withdrawals: 350 },
  { name: 'Apr', deposits: 270, withdrawals: 220 },
  { name: 'May', deposits: 530, withdrawals: 480 },
  { name: 'Jun', deposits: 800, withdrawals: 640 },
  { name: 'Jul', deposits: 980, withdrawals: 820 },
];

export function NetworkStats() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Network Activity</CardTitle>
        <CardDescription>
          Deposits and withdrawals over time
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: 'rgba(107, 114, 128, 0.2)' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value > 0 ? `${value}` : ''}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                borderRadius: '0.5rem',
                border: 'none',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
              itemStyle={{ color: 'white' }}
              labelStyle={{ marginBottom: '0.25rem', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="deposits" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorDeposits)" 
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="withdrawals" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorWithdrawals)" 
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
