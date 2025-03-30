
import React, { useState } from 'react';
import { HeaderNav } from '@/components/HeaderNav';
import { WithdrawalForm } from '@/components/WithdrawalForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plus, ArrowRight, Info, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { StoredNote, getNotes, markNoteAsSpent, saveNote } from '@/lib/noteStorage';
import { NoteCard } from '@/components/NoteCard';
import { parseNote } from '@/lib/cryptoUtils';
import { useNavigate } from 'react-router-dom';

const WithdrawPage = () => {
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState<StoredNote[]>(getNotes());
  const [selectedNote, setSelectedNote] = useState<StoredNote | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddNote = () => {
    if (!noteInput.trim()) {
      toast({
        title: "Empty note",
        description: "Please enter a note",
        variant: "destructive",
      });
      return;
    }

    // Validate note format
    const noteData = parseNote(noteInput);
    if (!noteData) {
      toast({
        title: "Invalid note format",
        description: "The note you entered is not valid",
        variant: "destructive",
      });
      return;
    }

    const savedNote = saveNote(noteInput);
    if (savedNote) {
      setNotes([savedNote, ...notes]);
      setNoteInput('');
      toast({
        title: "Note added",
        description: "Your note has been saved",
      });
    } else {
      toast({
        title: "Failed to add note",
        description: "There was an error saving your note",
        variant: "destructive",
      });
    }
  };

  const handleNoteSelected = (note: StoredNote) => {
    setSelectedNote(note);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWithdrawalComplete = (success: boolean) => {
    if (success && selectedNote) {
      markNoteAsSpent(selectedNote.id);
      setNotes(getNotes());
      setSelectedNote(null);
    }
  };

  const refreshNotes = () => {
    setNotes(getNotes());
    setSelectedNote(null);
  };

  const goToNotes = () => {
    navigate('/notes');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Withdraw Funds</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <WithdrawalForm 
              selectedNote={selectedNote}
              onWithdrawalComplete={handleWithdrawalComplete}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
                <CardDescription>
                  Understanding the withdrawal process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Private Withdrawals</h3>
                    <p className="text-sm text-muted-foreground">
                      When you withdraw, you're using zero-knowledge proofs to prove you have the right to withdraw without revealing which deposit is yours.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Relayer Option</h3>
                    <p className="text-sm text-muted-foreground">
                      For enhanced privacy, you can use a relayer to submit your withdrawal transaction, preventing direct wallet links.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Note</CardTitle>
                <CardDescription>
                  Enter a note to withdraw your funds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="note">Note</Label>
                  <Input
                    id="note"
                    placeholder="mixer-note-v1-..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={handleAddNote}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Note
                </Button>
                
                <Separator />
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Need more management?</AlertTitle>
                  <AlertDescription className="flex items-center justify-between">
                    <span>Go to Notes page</span>
                    <Button variant="link" onClick={goToNotes} className="p-0 h-auto">
                      Notes <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Notes</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={goToNotes}
                >
                  <FileText className="h-4 w-4" />
                  View All
                </Button>
              </div>
              
              {notes.length > 0 ? (
                <div className="space-y-4">
                  {notes.filter(note => !note.isSpent).slice(0, 3).map(note => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      onNoteDeleted={refreshNotes}
                      onNoteSelected={handleNoteSelected}
                    />
                  ))}
                  
                  {notes.filter(note => !note.isSpent).length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={goToNotes}
                    >
                      View All Notes
                    </Button>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No notes found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add a note above or make a deposit first
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
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

export default WithdrawPage;
