/**
 * Enchantment & Amplification Module for Aion 2 Helper
 * Features interactive single-attempt enchanting, auto-enchant to target,
 * supplement boosts, breakpoint protection, and Monte Carlo probability batch analysis.
 */

import { sound } from './audio.js';

export class EnchantmentModule {
  constructor() {
    this.currentLevel = 0;
    this.targetLevel = 15;
    this.maxLevel = 20;
    this.selectedTier = 'eternal'; // 'superior', 'heroic', 'fabled', 'eternal', 'mythic'
    this.selectedGearType = 'weapon'; // 'weapon', 'armor', 'accessory'
    this.supplementType = 'none'; // 'none', 'lesser', 'regular', 'greater'
    this.useBreakProtection = true; // Safe thresholds at +10 and +15
    this.history = [];
    this.totalStonesUsed = 0;
    this.totalSupplementsUsed = 0;
    this.totalKinahCost = 0;

    this.baseStoneCosts = {
      superior: 15000,
      heroic: 45000,
      fabled: 120000,
      eternal: 350000,
      mythic: 950000
    };

    this.supplementCosts = {
      none: 0,
      lesser: 25000,
      regular: 75000,
      greater: 190000
    };

    this.supplementBonus = {
      none: 0,
      lesser: 0.05,
      regular: 0.10,
      greater: 0.15
    };
  }

  getBaseSuccessRate(level, tier) {
    // Aion 2 Enchantment probability curve
    let base = 0.85;
    if (level < 5) {
      base = 0.85 - (level * 0.03); // 85% -> 73%
    } else if (level < 10) {
      base = 0.70 - ((level - 5) * 0.05); // 70% -> 50%
    } else if (level < 15) {
      base = 0.45 - ((level - 10) * 0.04); // 45% -> 29%
    } else {
      base = 0.22 - ((level - 15) * 0.025); // 22% -> 10%
    }

    // Tier modifiers
    const tierMod = {
      superior: 0.08,
      heroic: 0.04,
      fabled: 0.0,
      eternal: -0.05,
      mythic: -0.10
    };

    return Math.max(0.08, Math.min(0.95, base + (tierMod[tier] || 0)));
  }

  getEffectiveSuccessRate(level = this.currentLevel, tier = this.selectedTier, supplement = this.supplementType) {
    const base = this.getBaseSuccessRate(level, tier);
    const bonus = this.supplementBonus[supplement] || 0;
    return Math.min(0.98, base + bonus);
  }

  enchantOnce() {
    if (this.currentLevel >= this.maxLevel) {
      return { status: 'max_reached', level: this.currentLevel };
    }

    const prevLevel = this.currentLevel;
    const rate = this.getEffectiveSuccessRate();
    const roll = Math.random();
    const isSuccess = roll < rate;

    const stoneCost = this.baseStoneCosts[this.selectedTier] || 100000;
    const suppCost = this.supplementCosts[this.supplementType] || 0;
    const attemptCost = stoneCost + suppCost;

    this.totalStonesUsed++;
    if (this.supplementType !== 'none') {
      this.totalSupplementsUsed++;
    }
    this.totalKinahCost += attemptCost;

    let newLevel = prevLevel;
    let message = '';

    if (isSuccess) {
      newLevel = prevLevel + 1;
      this.currentLevel = newLevel;
      message = `Success! Enchanted to +${newLevel}`;
      sound.playEnchantSuccess();
    } else {
      // Failure logic
      if (this.useBreakProtection && (prevLevel === 10 || prevLevel === 15)) {
        newLevel = prevLevel; // protected threshold
        message = `Failed! Threshold protection preserved +${prevLevel}`;
      } else if (prevLevel > 10 && this.useBreakProtection && (prevLevel - 1 < 10)) {
        newLevel = 10;
        message = `Failed! Dropped to checkpoint +10`;
      } else {
        newLevel = Math.max(0, prevLevel - 1);
        message = `Failed! Dropped from +${prevLevel} to +${newLevel}`;
      }
      this.currentLevel = newLevel;
      sound.playEnchantFail();
    }

    const logEntry = {
      attempt: this.totalStonesUsed,
      fromLevel: prevLevel,
      toLevel: newLevel,
      isSuccess,
      roll: (roll * 100).toFixed(1),
      rate: (rate * 100).toFixed(1),
      supplement: this.supplementType,
      cost: attemptCost,
      message,
      timestamp: new Date().toLocaleTimeString()
    };

    this.history.unshift(logEntry);
    if (this.history.length > 50) this.history.pop();

    return logEntry;
  }

  autoEnchant(target = this.targetLevel, maxAttempts = 200) {
    let attempts = 0;
    const startLevel = this.currentLevel;
    while (this.currentLevel < target && attempts < maxAttempts) {
      attempts++;
      this.enchantOnce();
    }
    return {
      startLevel,
      endLevel: this.currentLevel,
      targetReached: this.currentLevel >= target,
      attemptsInRun: attempts,
      totalStones: this.totalStonesUsed,
      totalCost: this.totalKinahCost
    };
  }

  reset() {
    this.currentLevel = 0;
    this.history = [];
    this.totalStonesUsed = 0;
    this.totalSupplementsUsed = 0;
    this.totalKinahCost = 0;
    sound.playClick();
  }

  // Monte Carlo Simulation: Run 500 virtual trials to calculate realistic probability distribution
  runMonteCarlo(simulationsCount = 500, fromLvl = 0, toLvl = 15, tier = this.selectedTier, supplement = this.supplementType, protectedBreakpoints = true) {
    const trials = [];
    const stoneCost = this.baseStoneCosts[tier] || 100000;
    const suppCost = this.supplementCosts[supplement] || 0;
    const costPerAttempt = stoneCost + suppCost;

    for (let s = 0; s < simulationsCount; s++) {
      let lvl = fromLvl;
      let stones = 0;
      let fails = 0;
      let successes = 0;
      const maxTries = 1000;

      while (lvl < toLvl && stones < maxTries) {
        stones++;
        const base = this.getBaseSuccessRate(lvl, tier);
        const rate = Math.min(0.98, base + (this.supplementBonus[supplement] || 0));
        const roll = Math.random();

        if (roll < rate) {
          lvl++;
          successes++;
        } else {
          fails++;
          if (protectedBreakpoints && (lvl === 10 || lvl === 15)) {
            // protected
          } else if (protectedBreakpoints && lvl > 10 && (lvl - 1 < 10)) {
            lvl = 10;
          } else {
            lvl = Math.max(0, lvl - 1);
          }
        }
      }

      trials.push({
        stones,
        successes,
        fails,
        cost: stones * costPerAttempt,
        reachedTarget: lvl >= toLvl
      });
    }

    // Statistics
    trials.sort((a, b) => a.stones - b.stones);
    const totalStones = trials.reduce((sum, t) => sum + t.stones, 0);
    const avgStones = Math.round(totalStones / simulationsCount);
    const medianStones = trials[Math.floor(simulationsCount / 2)].stones;
    const p10Stones = trials[Math.floor(simulationsCount * 0.1)].stones; // Lucky 10%
    const p90Stones = trials[Math.floor(simulationsCount * 0.9)].stones; // Unlucky 90%
    const minStones = trials[0].stones;
    const maxStones = trials[trials.length - 1].stones;
    const avgCost = avgStones * costPerAttempt;

    return {
      simulationsCount,
      fromLvl,
      toLvl,
      tier,
      supplement,
      avgStones,
      medianStones,
      p10Stones,
      p90Stones,
      minStones,
      maxStones,
      avgCost,
      costPerAttempt
    };
  }

  getStatBonus(level = this.currentLevel, gearType = this.selectedGearType) {
    if (gearType === 'weapon') {
      const atk = level * 14;
      const crit = level >= 10 ? (level - 9) * 8 : 0;
      const pvpAtk = level >= 15 ? ((level - 14) * 1.5).toFixed(1) : 0;
      return {
        main: `+${atk} Attack / +${atk * 2.5} Magic Boost`,
        sub: level >= 10 ? `+${crit} Phys Crit / Magic Acc` : null,
        bonus: level >= 15 ? `+${pvpAtk}% PvP Attack Bonus` : null
      };
    } else if (gearType === 'armor') {
      const def = level * 18;
      const hp = level * 95;
      const fortitude = level >= 10 ? (level - 9) * 12 : 0;
      return {
        main: `+${def} Phys Def / +${hp} Max HP`,
        sub: level >= 10 ? `+${fortitude} Strike Fortitude` : null,
        bonus: level >= 15 ? `+${((level - 14) * 1.2).toFixed(1)}% PvP Damage Reduction` : null
      };
    } else {
      const hp = level * 80;
      const res = level * 10;
      return {
        main: `+${hp} Max HP / +${res} Magic Resist`,
        sub: level >= 10 ? `+${(level - 9) * 10} Critical Resist` : null,
        bonus: null
      };
    }
  }
}
