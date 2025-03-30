
import React, { useState } from 'react';
import { Shield, Menu, X, GitBranch, TrendingUp, History, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-mixer-secondary" />
          <span className="text-lg font-bold bg-gradient-to-r from-mixer-primary to-mixer-secondary bg-clip-text text-transparent">
            ShadowMixer
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Button 
            variant="ghost" 
            className="text-sm font-medium"
            onClick={() => handleNavigation('/')}
          >
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="text-sm font-medium"
            onClick={() => handleNavigation('/deposit')}
          >
            Deposit
          </Button>
          <Button 
            variant="ghost" 
            className="text-sm font-medium"
            onClick={() => handleNavigation('/withdraw')}
          >
            Withdraw
          </Button>
          <Button 
            variant="ghost" 
            className="text-sm font-medium"
            onClick={() => handleNavigation('/notes')}
          >
            My Notes
          </Button>
        </nav>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-6 w-6 text-mixer-secondary" />
              <span className="text-lg font-bold bg-gradient-to-r from-mixer-primary to-mixer-secondary bg-clip-text text-transparent">
                ShadowMixer
              </span>
            </div>
            <Separator className="mb-6" />
            <nav className="flex flex-col gap-4">
              <Button 
                variant="ghost" 
                className="justify-start gap-2" 
                onClick={() => handleNavigation('/')}
              >
                <TrendingUp className="h-5 w-5" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start gap-2" 
                onClick={() => handleNavigation('/deposit')}
              >
                <Wallet className="h-5 w-5" />
                Deposit
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start gap-2" 
                onClick={() => handleNavigation('/withdraw')}
              >
                <GitBranch className="h-5 w-5" />
                Withdraw
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start gap-2" 
                onClick={() => handleNavigation('/notes')}
              >
                <History className="h-5 w-5" />
                My Notes
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
