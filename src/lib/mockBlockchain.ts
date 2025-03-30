
// This file simulates blockchain interactions for the privacy mixer

import { MerkleTree, createCommitment, verifyProof } from './cryptoUtils';

// Mock denomination values available
export const DENOMINATIONS = {
  ETH: ['0.1', '1', '10', '100'],
  BTC: ['0.01', '0.1', '1', '10'],
  DAI: ['100', '1000', '10000', '100000'],
  USDC: ['100', '1000', '10000', '100000'],
};

// Currency symbols and decimals
export const CURRENCY_DETAILS = {
  ETH: { symbol: 'Ξ', decimals: 18 },
  BTC: { symbol: '₿', decimals: 8 },
  DAI: { symbol: '◈', decimals: 18 },
  USDC: { symbol: '$', decimals: 6 },
};

// Mock blockchain state
export interface MixerPool {
  currency: string;
  denomination: string;
  commitments: string[];
  nullifiers: Set<string>;
  merkleTree: MerkleTree;
}

export interface WithdrawalEvent {
  currency: string;
  denomination: string;
  nullifierHash: string;
  recipient: string;
  timestamp: number;
}

// A map of currency-denomination to mixer pools
const mixerPools: Record<string, MixerPool> = {};
const withdrawalEvents: WithdrawalEvent[] = [];

// Initialize mixer pools
export function initializeMixerPools(): void {
  Object.keys(DENOMINATIONS).forEach(currency => {
    DENOMINATIONS[currency as keyof typeof DENOMINATIONS].forEach(denomination => {
      const key = `${currency}-${denomination}`;
      mixerPools[key] = {
        currency,
        denomination,
        commitments: [],
        nullifiers: new Set<string>(),
        merkleTree: new MerkleTree(),
      };
    });
  });
}

// Get a mixer pool by currency and denomination
export function getMixerPool(currency: string, denomination: string): MixerPool {
  const key = `${currency}-${denomination}`;
  if (!mixerPools[key]) {
    throw new Error(`Mixer pool ${key} does not exist`);
  }
  return mixerPools[key];
}

// Deposit into a mixer pool
export function deposit(currency: string, denomination: string, commitment: string): boolean {
  try {
    const pool = getMixerPool(currency, denomination);
    pool.commitments.push(commitment);
    pool.merkleTree.addLeaf(commitment);
    return true;
  } catch (error) {
    console.error('Deposit failed:', error);
    return false;
  }
}

// Withdraw from a mixer pool
export function withdraw(
  currency: string,
  denomination: string,
  proof: string,
  publicSignals: string[],
  recipient: string
): boolean {
  try {
    const pool = getMixerPool(currency, denomination);
    const [commitment, nullifierHash] = publicSignals;
    
    // Check if the nullifier has been used
    if (pool.nullifiers.has(nullifierHash)) {
      throw new Error('Nullifier has already been spent');
    }
    
    // Verify the proof
    const isValid = verifyProof(proof, publicSignals);
    if (!isValid) {
      throw new Error('Invalid proof');
    }
    
    // Record the withdrawal
    pool.nullifiers.add(nullifierHash);
    withdrawalEvents.push({
      currency,
      denomination,
      nullifierHash,
      recipient,
      timestamp: Date.now(),
    });
    
    return true;
  } catch (error) {
    console.error('Withdrawal failed:', error);
    return false;
  }
}

// Get all withdrawal events
export function getWithdrawalEvents(): WithdrawalEvent[] {
  return [...withdrawalEvents].sort((a, b) => b.timestamp - a.timestamp);
}

// Get the current pool size
export function getPoolSize(currency: string, denomination: string): number {
  try {
    const pool = getMixerPool(currency, denomination);
    return pool.commitments.length;
  } catch {
    return 0;
  }
}

// Get the root of a merkle tree for a specific pool
export function getMerkleRoot(currency: string, denomination: string): string {
  try {
    const pool = getMixerPool(currency, denomination);
    return pool.merkleTree.getRoot();
  } catch {
    return '0x0';
  }
}

// Get a merkle proof for a commitment in a specific pool
export function getMerkleProof(currency: string, denomination: string, commitment: string): string[] {
  try {
    const pool = getMixerPool(currency, denomination);
    const index = pool.commitments.findIndex(c => c === commitment);
    if (index === -1) {
      throw new Error('Commitment not found in pool');
    }
    return pool.merkleTree.getProof(index);
  } catch (error) {
    console.error('Failed to get Merkle proof:', error);
    return [];
  }
}

// Initialize the mixer pools
initializeMixerPools();

// Add some initial commitments for demonstration
const prefilledPools = [
  { currency: 'ETH', denomination: '0.1', count: 15 },
  { currency: 'ETH', denomination: '1', count: 8 },
  { currency: 'ETH', denomination: '10', count: 3 },
  { currency: 'BTC', denomination: '0.01', count: 12 },
  { currency: 'BTC', denomination: '0.1', count: 6 },
  { currency: 'DAI', denomination: '100', count: 20 },
  { currency: 'DAI', denomination: '1000', count: 10 },
  { currency: 'USDC', denomination: '100', count: 18 },
  { currency: 'USDC', denomination: '1000', count: 9 },
];

// Fill the pools with dummy commitments
prefilledPools.forEach(({ currency, denomination, count }) => {
  for (let i = 0; i < count; i++) {
    const dummyCommitment = `0x${i}${Math.random().toString(16).slice(2, 10)}${'0'.repeat(56)}`;
    deposit(currency, denomination, dummyCommitment);
  }
});

// Add some withdrawal events for demonstration
const demoWithdrawals = [
  { currency: 'ETH', denomination: '0.1', timestamp: Date.now() - 3600000 * 2 },
  { currency: 'BTC', denomination: '0.01', timestamp: Date.now() - 3600000 * 8 },
  { currency: 'DAI', denomination: '100', timestamp: Date.now() - 3600000 * 12 },
  { currency: 'USDC', denomination: '100', timestamp: Date.now() - 3600000 * 24 },
  { currency: 'ETH', denomination: '1', timestamp: Date.now() - 3600000 * 36 },
];

demoWithdrawals.forEach(({ currency, denomination, timestamp }) => {
  withdrawalEvents.push({
    currency,
    denomination,
    nullifierHash: `0x${Math.random().toString(16).slice(2)}${'0'.repeat(40)}`,
    recipient: `0x${Math.random().toString(16).slice(2)}${'0'.repeat(40)}`,
    timestamp,
  });
});
