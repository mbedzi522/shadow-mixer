
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DENOMINATIONS, CURRENCY_DETAILS, getPoolSize } from '@/lib/mockBlockchain';

interface PoolSelectorProps {
  selectedCurrency: string;
  selectedDenomination: string;
  onCurrencyChange: (currency: string) => void;
  onDenominationChange: (denomination: string) => void;
}

export function PoolSelector({
  selectedCurrency,
  selectedDenomination,
  onCurrencyChange,
  onDenominationChange
}: PoolSelectorProps) {
  return (
    <Card className="border-2 border-opacity-50">
      <CardContent className="p-5 space-y-5">
        <div>
          <h3 className="text-sm text-muted-foreground mb-3">Select Currency</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(DENOMINATIONS).map(currency => (
              <Button 
                key={currency}
                variant={selectedCurrency === currency ? "default" : "outline"}
                className={`h-12 font-bold ${selectedCurrency === currency ? 'bg-gradient-to-r from-mixer-primary to-mixer-secondary text-white' : ''}`}
                onClick={() => onCurrencyChange(currency)}
              >
                {currency}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm text-muted-foreground mb-3">Select Denomination</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DENOMINATIONS[selectedCurrency as keyof typeof DENOMINATIONS].map(denom => {
              const poolSize = getPoolSize(selectedCurrency, denom);
              return (
                <Button 
                  key={denom}
                  variant={selectedDenomination === denom ? "default" : "outline"}
                  className={`h-12 font-bold flex flex-col items-center justify-center ${selectedDenomination === denom ? 'bg-gradient-to-r from-mixer-primary to-mixer-secondary text-white' : ''}`}
                  onClick={() => onDenominationChange(denom)}
                >
                  <span>{CURRENCY_DETAILS[selectedCurrency as keyof typeof CURRENCY_DETAILS].symbol}{denom}</span>
                  <span className="text-xs opacity-80">{poolSize} deposits</span>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
