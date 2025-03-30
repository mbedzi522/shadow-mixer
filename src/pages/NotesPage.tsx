
import React from 'react';
import { HeaderNav } from '@/components/HeaderNav';
import { NoteCard } from '@/components/NoteCard';
import { getAllNotes } from '@/lib/noteStorage';
import TorAccessInfo from '@/components/TorAccessInfo';

const NotesPage = () => {
  const notes = getAllNotes();

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNav />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Your Privacy Notes</h1>
        
        <TorAccessInfo />
        
        {notes.length === 0 ? (
          <div className="text-center p-10 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">You don't have any notes yet. Make a deposit to generate a withdrawal note.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, index) => (
              <NoteCard key={index} note={note} />
            ))}
          </div>
        )}
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

export default NotesPage;
