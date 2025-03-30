
// This file handles note storage for the privacy mixer

import { parseNote } from './cryptoUtils';

const NOTES_STORAGE_KEY = 'privacy-mixer-notes';

export interface StoredNote {
  id: string;
  note: string;
  currency: string;
  amount: string;
  createdAt: number;
  isSpent: boolean;
}

// Save a note to local storage
export function saveNote(note: string): StoredNote | null {
  try {
    const noteData = parseNote(note);
    if (!noteData) {
      throw new Error('Invalid note format');
    }
    
    const { currency, amount, nullifier, secret } = noteData;
    
    const newNote: StoredNote = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      note,
      currency,
      amount,
      createdAt: Date.now(),
      isSpent: false,
    };
    
    const existingNotes = getNotes();
    const updatedNotes = [newNote, ...existingNotes];
    
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
    return newNote;
  } catch (error) {
    console.error('Failed to save note:', error);
    return null;
  }
}

// Get all notes from local storage
export function getNotes(): StoredNote[] {
  try {
    const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!notesJson) {
      return [];
    }
    return JSON.parse(notesJson);
  } catch (error) {
    console.error('Failed to retrieve notes:', error);
    return [];
  }
}

// Mark a note as spent
export function markNoteAsSpent(noteId: string): boolean {
  try {
    const notes = getNotes();
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isSpent: true } : note
    );
    
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
    return true;
  } catch (error) {
    console.error('Failed to mark note as spent:', error);
    return false;
  }
}

// Delete a note
export function deleteNote(noteId: string): boolean {
  try {
    const notes = getNotes();
    const updatedNotes = notes.filter(note => note.id !== noteId);
    
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
    return true;
  } catch (error) {
    console.error('Failed to delete note:', error);
    return false;
  }
}

// Clear all notes
export function clearAllNotes(): boolean {
  try {
    localStorage.removeItem(NOTES_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear notes:', error);
    return false;
  }
}
