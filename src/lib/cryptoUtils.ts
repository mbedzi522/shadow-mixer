
// This file contains utility functions for cryptographic operations

/**
 * Generates a random private key
 */
export function generatePrivateKey(): string {
  // In a real application, we would use a secure cryptographic library
  // For demo purposes, we'll simulate a private key with a random hex string
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Derives a public key from a private key
 */
export function derivePublicKey(privateKey: string): string {
  // In a real application, this would use elliptic curve cryptography
  // For demo, we'll just hash the private key
  return hashString(privateKey).substring(0, 42); // Ethereum-like address format
}

/**
 * Creates a commitment from a nullifier and a secret
 */
export function createCommitment(nullifier: string, secret: string): string {
  // In a real implementation, this would use a cryptographic hash function
  // with proper domain separation
  return hashString(nullifier + secret);
}

/**
 * Generates a nullifier from a private key and other data
 */
export function generateNullifier(privateKey: string, index = 0): string {
  // In a real implementation, this would use a specific hash construction
  return hashString(privateKey + index.toString());
}

/**
 * Generates a secret for creating a commitment
 */
export function generateSecret(): string {
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hashes a string using SHA-256
 */
export async function hashStringAsync(message: string): Promise<string> {
  // Convert the message string to a Uint8Array
  const msgUint8 = new TextEncoder().encode(message);
  // Hash the message with SHA-256
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  // Convert the hash to a hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Synchronous hash function (for demo purposes)
 */
export function hashString(message: string): string {
  // This is just for demo purposes
  // In a real app, use a proper cryptographic hash function
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Convert to hex string of 64 chars (simulating SHA-256)
  const hashHex = (hash >>> 0).toString(16);
  return "0x" + "0".repeat(64 - hashHex.length) + hashHex;
}

/**
 * Simulates a zero-knowledge proof generation
 */
export function generateProof(
  commitment: string,
  nullifier: string,
  secret: string,
  merkleProof: string[]
): { proof: string; publicSignals: string[] } {
  // In a real implementation, this would use a zk-SNARK/STARK library
  // For demo purposes, we'll just return a simulated proof
  const proof = hashString(commitment + nullifier + secret + merkleProof.join(''));
  
  return {
    proof,
    publicSignals: [commitment, nullifier]
  };
}

/**
 * Simulates a zero-knowledge proof verification
 */
export function verifyProof(
  proof: string,
  publicSignals: string[]
): boolean {
  // In a real implementation, this would use a zk-SNARK/STARK verification function
  // For demo purposes, always return true
  return true;
}

/**
 * Creates a note for the user to save after deposit
 */
export function createNote(currency: string, amount: string, nullifier: string, secret: string): string {
  // Format: mixer-note-v1-[currency]-[amount]-[nullifier]-[secret]
  return `mixer-note-v1-${currency}-${amount}-${nullifier}-${secret}`;
}

/**
 * Parses a note string into its components
 */
export function parseNote(note: string): { 
  currency: string; 
  amount: string; 
  nullifier: string; 
  secret: string 
} | null {
  try {
    const parts = note.split('-');
    if (parts.length !== 7 || parts[0] !== 'mixer' || parts[1] !== 'note' || parts[2] !== 'v1') {
      return null;
    }
    
    return {
      currency: parts[3],
      amount: parts[4],
      nullifier: parts[5],
      secret: parts[6]
    };
  } catch (error) {
    console.error('Failed to parse note:', error);
    return null;
  }
}

/**
 * Simplified Merkle tree implementation
 */
export class MerkleTree {
  private leaves: string[] = [];
  private layers: string[][] = [];
  
  constructor(leaves: string[] = []) {
    if (leaves.length > 0) {
      this.leaves = leaves;
      this.buildTree();
    }
  }
  
  addLeaf(leaf: string): void {
    this.leaves.push(leaf);
    this.buildTree();
  }
  
  getRoot(): string {
    return this.layers[this.layers.length - 1][0] || '0x0';
  }
  
  getProof(leafIndex: number): string[] {
    if (leafIndex < 0 || leafIndex >= this.leaves.length) {
      throw new Error('Leaf index out of bounds');
    }
    
    const proof: string[] = [];
    let currentIndex = leafIndex;
    
    for (let i = 0; i < this.layers.length - 1; i++) {
      const layer = this.layers[i];
      const isRightNode = currentIndex % 2 === 0;
      const siblingIndex = isRightNode ? currentIndex + 1 : currentIndex - 1;
      
      if (siblingIndex < layer.length) {
        proof.push(layer[siblingIndex]);
      }
      
      currentIndex = Math.floor(currentIndex / 2);
    }
    
    return proof;
  }
  
  private buildTree(): void {
    this.layers = [this.leaves];
    
    while (this.layers[this.layers.length - 1].length > 1) {
      this.layers.push(this.pairwiseHash(this.layers[this.layers.length - 1]));
    }
  }
  
  private pairwiseHash(elements: string[]): string[] {
    const result: string[] = [];
    
    for (let i = 0; i < elements.length; i += 2) {
      if (i + 1 < elements.length) {
        result.push(hashString(elements[i] + elements[i + 1]));
      } else {
        result.push(elements[i]);
      }
    }
    
    return result;
  }
}
