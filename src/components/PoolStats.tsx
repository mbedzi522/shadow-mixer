
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, ShieldCheck, Users } from 'lucide-react';
import { getPoolSize, getMerkleRoot, CURRENCY_DETAILS } from '@/lib/mockBlockchain';

interface PoolStatsProps {
  currency: string;
  denomination: string;
}

export function PoolStats({ currency, denomination }: PoolStatsProps) {
  const poolSize = getPoolSize(currency, denomination);
  const merkleRoot = getMerkleRoot(currency, denomination);
  const anonymityLevel = calculateAnonymityLevel(poolSize);
  const symbol = CURRENCY_DETAILS[currency as keyof typeof CURRENCY_DETAILS]?.symbol || '';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pool Size</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{poolSize} deposits</div>
          <p className="text-xs text-muted-foreground">
            Total value: {symbol}{Number(denomination) * poolSize}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Anonymity Level</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-1">
            <span className="text-2xl font-bold">{anonymityLevel.level}</span>
            <span className="text-xs text-muted-foreground mt-2">{anonymityLevel.score}/100</span>
          </div>
          <Progress value={anonymityLevel.score} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {anonymityLevel.description}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Merkle Root</CardTitle>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium truncate">{merkleRoot}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function calculateAnonymityLevel(poolSize: number) {
  if (poolSize >= 100) {
    return { 
      level: "Excellent", 
      score: 95, 
      description: "Very strong anonymity with a large number of participants" 
    };
  } else if (poolSize >= 50) {
    return { 
      level: "Very Good", 
      score: 80, 
      description: "Strong anonymity set, suitable for most privacy needs" 
    };
  } else if (poolSize >= 20) {
    return { 
      level: "Good", 
      score: 65, 
      description: "Decent anonymity protection for typical uses" 
    };
  } else if (poolSize >= 10) {
    return { 
      level: "Moderate", 
      score: 45, 
      description: "Basic anonymity protection, use with caution" 
    };
  } else if (poolSize >= 5) {
    return { 
      level: "Low", 
      score: 25, 
      description: "Limited anonymity, suitable only for small transactions" 
    };
  } else {
    return { 
      level: "Very Low", 
      score: 10, 
      description: "Minimal anonymity protection, not recommended" 
    };
  }
}
