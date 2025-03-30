
import React, { useState } from 'react';
import { HeaderNav } from '@/components/HeaderNav';
import { PoolSelector } from '@/components/PoolSelector';
import { PoolStats } from '@/components/PoolStats';
import { RecentActivity } from '@/components/RecentActivity';
import { NetworkStats } from '@/components/NetworkStats';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [selectedDenomination, setSelectedDenomination] = useState('1');
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid gap-6">
          <PoolSelector 
            selectedCurrency={selectedCurrency}
            selectedDenomination={selectedDenomination}
            onCurrencyChange={setSelectedCurrency}
            onDenominationChange={setSelectedDenomination}
          />
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              <PoolStats 
                currency={selectedCurrency} 
                denomination={selectedDenomination} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Deposit</h2>
                  <p className="text-muted-foreground">
                    Send your funds to the mixer to break the link between source and destination addresses.
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-mixer-primary to-mixer-secondary hover:from-mixer-primary/90 hover:to-mixer-secondary/90 w-full md:w-auto"
                    onClick={() => navigate('/deposit')}
                  >
                    Make a Deposit <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Withdraw</h2>
                  <p className="text-muted-foreground">
                    Withdraw your funds to any address without revealing the source of the funds.
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-mixer-primary to-mixer-secondary hover:from-mixer-primary/90 hover:to-mixer-secondary/90 w-full md:w-auto"
                    onClick={() => navigate('/withdraw')}
                  >
                    Make a Withdrawal <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <RecentActivity />
          </div>
          
          <NetworkStats />
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

export default Dashboard;
