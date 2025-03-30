
import React, { useState, useEffect } from 'react';
import { HeaderNav } from '@/components/HeaderNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, AlertCircle, FileText, Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { StoredNote, getNotes, saveNote, clearAllNotes } from '@/lib/noteStorage';
import { NoteCard } from '@/components/NoteCard';
import { parseNote } from '@/lib/cryptoUtils';
import { useNavigate } from 'react-router-dom';

const NotesPage = () => {
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState<StoredNote[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [exportData, setExportData] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    refreshNotes();
  }, []);

  const refreshNotes = () => {
    setNotes(getNotes());
  };

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
      refreshNotes();
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

  const handleClearAllNotes = () => {
    clearAllNotes();
    refreshNotes();
    setShowClearDialog(false);
    toast({
      title: "All notes cleared",
      description: "All your notes have been deleted",
    });
  };

  const handleExportNotes = () => {
    try {
      const exportData = JSON.stringify(notes);
      setExportData(exportData);
      setShowExportDialog(true);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export notes",
        variant: "destructive",
      });
    }
  };

  const handleImportNotes = () => {
    try {
      const importedNotes = JSON.parse(importData);
      
      if (!Array.isArray(importedNotes)) {
        throw new Error("Invalid import data format");
      }
      
      let successCount = 0;
      for (const note of importedNotes) {
        if (note.note && typeof note.note === 'string') {
          const savedNote = saveNote(note.note);
          if (savedNote) {
            successCount++;
          }
        }
      }
      
      refreshNotes();
      setImportData('');
      setShowImportDialog(false);
      
      toast({
        title: "Import successful",
        description: `Imported ${successCount} notes`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Invalid import data format",
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter(note => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return !note.isSpent;
    if (activeTab === 'spent') return note.isSpent;
    return true;
  });

  const goToWithdraw = () => {
    navigate('/withdraw');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">My Notes</h1>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="mr-2 h-4 w-4" /> Import
            </Button>
            <Button variant="outline" onClick={handleExportNotes}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive"
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes Management</CardTitle>
                <CardDescription>
                  View, manage, and organize your mixer notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All Notes</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="spent">Spent</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6">
                    {filteredNotes.length > 0 ? (
                      <div className="space-y-4">
                        {filteredNotes.map(note => (
                          <NoteCard 
                            key={note.id} 
                            note={note} 
                            onNoteDeleted={refreshNotes}
                            onNoteSelected={() => {
                              if (!note.isSpent) {
                                goToWithdraw();
                              }
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                        <h3 className="mt-4 text-lg font-medium">No notes found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {activeTab === 'all' 
                            ? "You don't have any notes yet. Add a note or make a deposit first." 
                            : activeTab === 'active' 
                              ? "You don't have any active notes. Add a note or make a deposit."
                              : "You don't have any spent notes yet."}
                        </p>
                      </div>
                    )}
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Note</CardTitle>
                <CardDescription>
                  Enter a note to save it for later use
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
                  className="w-full bg-gradient-to-r from-mixer-primary to-mixer-secondary hover:from-mixer-primary/90 hover:to-mixer-secondary/90"
                  onClick={handleAddNote}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Note
                </Button>
                
                <Separator />
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Note Format</AlertTitle>
                  <AlertDescription>
                    Notes should be in the format <span className="font-mono text-xs">mixer-note-v1-[currency]-[amount]-[nullifier]-[secret]</span>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ready to Withdraw?</CardTitle>
                <CardDescription>
                  Use your note to withdraw funds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have an active note, you can withdraw your funds to any address of your choice.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-mixer-primary to-mixer-secondary hover:from-mixer-primary/90 hover:to-mixer-secondary/90"
                  onClick={goToWithdraw}
                >
                  Go to Withdraw
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Clear All Notes Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Notes</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all your notes? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAllNotes}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Notes Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Notes</DialogTitle>
            <DialogDescription>
              Copy the data below to save your notes. Store this data securely.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Export Data</Label>
            <div className="bg-muted p-3 rounded-md">
              <pre className="text-xs overflow-auto max-h-64 font-mono whitespace-pre-wrap break-all select-all">
                {exportData}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => {
                navigator.clipboard.writeText(exportData);
                toast({
                  title: "Copied to clipboard",
                  description: "Your notes data has been copied to the clipboard",
                });
              }}
            >
              Copy to Clipboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Notes Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Notes</DialogTitle>
            <DialogDescription>
              Paste your exported notes data below to import them.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Import Data</Label>
            <textarea
              className="w-full h-64 p-3 text-xs font-mono bg-muted rounded-md resize-none border"
              placeholder="Paste your exported notes data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportNotes}>
              Import Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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

export default NotesPage;
