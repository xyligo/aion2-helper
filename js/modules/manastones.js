/**
 * Manastone Socketing & Transfer Crafting Module for Aion 2 Helper
 * Features:
 * - Interactive Manastone Socketing Simulator (Slots 1 to 6)
 * - Modes: "Modern Safe" (stone lost on fail) vs "Classic Strict" (all sockets wipe on fail)
 * - Stat calculation (Crit Strike, Magic Boost, Attack, HP, etc.)
 * - Transfer Crafting Calculator (preserving gear amplification & substats)
 */

import { sound } from './audio.js';

export class ManastoneModule {
  constructor() {
    this.totalSlots = 6;
    this.sockets = []; // array of { filled: boolean, type: string, tier: string }
    this.mode = 'modern'; // 'modern' | 'classic'
    this.selectedStoneType = 'crit_strike';
    this.selectedStoneTier = 'heroic';
    this.totalAttempts = 0;
    this.totalStonesSpent = 0;
    this.history = [];

    this.stoneTypes = {
      crit_strike: { name: 'Critical Strike', baseValue: 17, unit: '', icon: '🎯' },
      attack: { name: 'Physical Attack', baseValue: 5, unit: '', icon: '⚔️' },
      magic_boost: { name: 'Magic Boost', baseValue: 27, unit: '', icon: '🔮' },
      max_hp: { name: 'Max Health (HP)', baseValue: 95, unit: '', icon: '❤️' },
      magical_acc: { name: 'Magical Accuracy', baseValue: 14, unit: '', icon: '✨' },
      block: { name: 'Shield Block', baseValue: 27, unit: '', icon: '🛡️' },
      accuracy: { name: 'Physical Accuracy', baseValue: 27, unit: '', icon: '🏹' }
    };

    this.stoneTiers = {
      superior: { name: 'Superior (Green)', multiplier: 1.0, stonePrice: 35000 },
      heroic: { name: 'Heroic (Blue)', multiplier: 1.35, stonePrice: 120000 },
      fabled: { name: 'Fabled (Gold)', multiplier: 1.75, stonePrice: 450000 },
      eternal: { name: 'Eternal (Purple)', multiplier: 2.2, stonePrice: 1500000 }
    };

    // Slot success chances (1st slot easiest, 6th slot hardest)
    this.slotChances = [0.85, 0.75, 0.65, 0.50, 0.40, 0.30];

    this.resetSockets();
  }

  resetSockets() {
    this.sockets = Array(this.totalSlots).fill(null).map(() => ({
      filled: false,
      stoneType: null,
      stoneTier: null,
      statValue: 0
    }));
  }

  getFilledCount() {
    return this.sockets.filter(s => s.filled).length;
  }

  getCurrentSlotIndex() {
    return this.sockets.findIndex(s => !s.filled);
  }

  getSuccessRate(slotIdx) {
    if (slotIdx < 0 || slotIdx >= this.totalSlots) return 0;
    return this.slotChances[slotIdx];
  }

  socketStone() {
    const slotIdx = this.getCurrentSlotIndex();
    if (slotIdx === -1) {
      return { status: 'all_filled' };
    }

    this.totalAttempts++;
    this.totalStonesSpent++;

    const chance = this.getSuccessRate(slotIdx);
    const roll = Math.random();
    const isSuccess = roll < chance;

    const stoneDef = this.stoneTypes[this.selectedStoneType];
    const tierDef = this.stoneTiers[this.selectedStoneTier];
    const statVal = Math.round(stoneDef.baseValue * tierDef.multiplier);

    let message = '';

    if (isSuccess) {
      this.sockets[slotIdx] = {
        filled: true,
        stoneType: this.selectedStoneType,
        stoneTier: this.selectedStoneTier,
        statValue: statVal
      };
      message = `Success! Socketed ${tierDef.name} ${stoneDef.name} into Slot #${slotIdx + 1} (+${statVal})`;
      sound.playCraftSuccess();
    } else {
      if (this.mode === 'classic') {
        // Classic mode wipes all prior sockets!
        const wipedCount = slotIdx;
        this.resetSockets();
        message = `FAILURE! Socket shattered and purged all ${wipedCount} previous manastones!`;
        sound.playEnchantFail();
      } else {
        // Modern mode loses only current stone
        message = `Failed! Manastone dissipated on Slot #${slotIdx + 1}. Existing sockets preserved.`;
        sound.playEnchantFail();
      }
    }

    const logEntry = {
      attempt: this.totalAttempts,
      slot: slotIdx + 1,
      isSuccess,
      roll: (roll * 100).toFixed(1),
      chance: (chance * 100).toFixed(1),
      message,
      timestamp: new Date().toLocaleTimeString()
    };

    this.history.unshift(logEntry);
    if (this.history.length > 40) this.history.pop();

    return {
      isSuccess,
      slot: slotIdx + 1,
      sockets: this.sockets,
      message
    };
  }

  autoSocketToTarget(targetSlots = this.totalSlots, maxStones = 200) {
    let stonesUsedInRun = 0;
    while (this.getFilledCount() < targetSlots && stonesUsedInRun < maxStones) {
      stonesUsedInRun++;
      this.socketStone();
    }
    return {
      reachedTarget: this.getFilledCount() >= targetSlots,
      stonesUsedInRun,
      totalStonesSpent: this.totalStonesSpent,
      filledCount: this.getFilledCount()
    };
  }

  getTotalSocketedStats() {
    const summary = {};
    this.sockets.forEach(s => {
      if (s.filled && s.stoneType) {
        if (!summary[s.stoneType]) {
          summary[s.stoneType] = {
            name: this.stoneTypes[s.stoneType].name,
            icon: this.stoneTypes[s.stoneType].icon,
            totalValue: 0
          };
        }
        summary[s.stoneType].totalValue += s.statValue;
      }
    });
    return Object.values(summary);
  }

  // Transfer Crafting Calculation:
  // Transferring gear to a higher tier gear item preserves substats & amp levels
  calculateTransferCraft(sourceAmpLevel, targetTier, preserveSubstats = true) {
    // Amplification retention:
    // e.g. +15 gear transfers to +13 or +14 depending on tier gap
    let transferredAmp = Math.max(0, sourceAmpLevel - (targetTier === 'mythic' ? 2 : 1));
    if (sourceAmpLevel < 5) transferredAmp = Math.max(0, sourceAmpLevel - 1);

    const baseKinah = 500000;
    const ampKinah = sourceAmpLevel * 250000;
    const substatKinah = preserveSubstats ? 800000 : 0;
    const totalKinah = baseKinah + ampKinah + substatKinah;

    // Catalysts
    const catalysts = Math.max(2, Math.floor(sourceAmpLevel * 1.5));
    const transferScrolls = targetTier === 'mythic' ? 3 : 1;

    return {
      sourceAmpLevel,
      transferredAmp,
      totalKinah,
      catalysts,
      transferScrolls,
      substatsPreserved: preserveSubstats
    };
  }
}
