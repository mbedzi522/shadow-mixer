
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, EyeOff, Copy, ArrowRight, Trash } from 'lucide-react';
import { StoredNote, deleteNote } from '@/lib/noteStorage';
import { parseNote } from '@/lib/cryptoUtils';
import { useToast } from '@/components/ui/use-toast';
import { CURRENCY_DETAILS } from '@/lib/mockBlockchain';

interface NoteCardProps {
  note: StoredNote;
  onNoteDeleted: () => void;
  onNoteSelected: (note: StoredNote) => void;
}

export function NoteCard({ note, onNoteDeleted, onNoteSelected }: NoteCardProps) {
  const [showNote, setShowNote] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  
  const symbol = CURRENCY_DETAILS[note.currency as keyof typeof CURRENCY_DETAILS]?.symbol || '';
  const date = new Date(note.createdAt).toLocaleDateString();
  
  const copyNoteToClipboard = () => {
    navigator.clipboard.writeText(note.note);
    toast({
      title: "Note copied to clipboard",
      description: "You can paste it elsewhere for backup",
    });
  };
  
  const handleDeleteNote = () => {
    deleteNote(note.id);
    setShowDeleteDialog(false);
    onNoteDeleted();
    toast({
      title: "Note deleted",
      description: "The note has been permanently removed",
    });
  };
  
  const truncatedNote = note.note.substring(0, 15) + '...' + note.note.substring(note.note.length - 15);
  
  return (
    <Card className={`${note.isSpent ? 'opacity-70 border-dashed' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {symbol}{note.amount} {note.currency}
            </CardTitle>
            <CardDescription>Created on {date}</CardDescription>
          </div>
          {note.isSpent && (
            <div className="bg-muted px-2 py-1 rounded-md text-xs font-medium text-muted-foreground">
              Spent
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-xs font-mono bg-muted p-2 rounded overflow-hidden whitespace-nowrap flex-1">
            {showNote ? note.note : truncatedNote}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowNote(!showNote)}>
            {showNote ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={copyNoteToClipboard}>
            <Copy className="h-3 w-3 mr-1" /> Copy
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash className="h-3 w-3 mr-1" /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Note</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this note? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteNote}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {!note.isSpent && (
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-mixer-primary to-mixer-secondary hover:from-mixer-primary/90 hover:to-mixer-secondary/90"
            onClick={() => onNoteSelected(note)}
          >
            Withdraw <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
