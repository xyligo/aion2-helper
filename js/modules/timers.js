/**
 * World Events & Essence Extraction Timers Module for Aion 2 Helper
 * Tracks server daily/weekly resets, dimensional rifts, world boss windows,
 * and customizable node respawn stopwatches with audio alert chimes.
 */

import { sound } from './audio.js';

export class TimersModule {
  constructor() {
    this.customTimers = [];
    this.intervalId = null;
    this.listeners = [];
    this.initStorage();
    this.startClock();
  }

  initStorage() {
    try {
      const stored = localStorage.getItem('aion2_custom_timers');
      if (stored) {
        this.customTimers = JSON.parse(stored);
      } else {
        // Defaults
        this.customTimers = [
          {
            id: 'node_mythic_aether',
            name: 'Mythic Aether Swarm (Core)',
            durationMinutes: 45,
            targetTimestamp: null,
            icon: '🌀',
            location: 'Reshanta Sky Core'
          },
          {
            id: 'node_dragon_flower',
            name: 'Dragon Flower Bloom (Balaurea)',
            durationMinutes: 30,
            targetTimestamp: null,
            icon: '🌺',
            location: 'Inggison / Gelkmaros Basins'
          },
          {
            id: 'node_adamantium_vein',
            name: 'Pure Adamantium Vein',
            durationMinutes: 20,
            targetTimestamp: null,
            icon: '⛏️',
            location: 'Silentera Canyon'
          }
        ];
      }
    } catch (e) {}
  }

  saveStorage() {
    try {
      localStorage.setItem('aion2_custom_timers', JSON.stringify(this.customTimers));
    } catch (e) {}
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  startClock() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.checkAlarms();
      this.notify();
    }, 1000);
  }

  checkAlarms() {
    const now = Date.now();
    this.customTimers.forEach(t => {
      if (t.targetTimestamp && now >= t.targetTimestamp && !t.alarmTriggered) {
        t.alarmTriggered = true;
        sound.playTimerAlarm();
      }
    });
  }

  startCustomTimer(timerId) {
    const timer = this.customTimers.find(t => t.id === timerId);
    if (timer) {
      timer.targetTimestamp = Date.now() + timer.durationMinutes * 60 * 1000;
      timer.alarmTriggered = false;
      this.saveStorage();
      sound.playClick();
      this.notify();
    }
  }

  resetCustomTimer(timerId) {
    const timer = this.customTimers.find(t => t.id === timerId);
    if (timer) {
      timer.targetTimestamp = null;
      timer.alarmTriggered = false;
      this.saveStorage();
      sound.playClick();
      this.notify();
    }
  }

  addCustomTimer(name, minutes, icon = '⏱️', location = 'Atreia') {
    const newTimer = {
      id: 'timer_' + Date.now(),
      name,
      durationMinutes: Math.max(1, parseInt(minutes, 10) || 15),
      targetTimestamp: null,
      icon,
      location,
      alarmTriggered: false
    };
    this.customTimers.push(newTimer);
    this.saveStorage();
    this.notify();
    return newTimer;
  }

  deleteCustomTimer(timerId) {
    this.customTimers = this.customTimers.filter(t => t.id !== timerId);
    this.saveStorage();
    this.notify();
  }

  // Calculates time left until UTC Daily Reset (09:00 UTC)
  getDailyReset() {
    const now = new Date();
    const target = new Date();
    target.setUTCHours(9, 0, 0, 0);
    if (now >= target) {
      target.setUTCDate(target.getUTCDate() + 1);
    }
    const diff = target - now;
    return this.formatTimeDiff(diff);
  }

  // Calculates time left until UTC Weekly Reset (Wednesday 09:00 UTC)
  getWeeklyReset() {
    const now = new Date();
    const target = new Date();
    target.setUTCHours(9, 0, 0, 0);

    const currentDay = now.getUTCDay(); // 0 is Sunday, 3 is Wednesday
    let daysUntilWed = (3 - currentDay + 7) % 7;
    if (daysUntilWed === 0 && now >= target) {
      daysUntilWed = 7;
    }
    target.setUTCDate(target.getUTCDate() + daysUntilWed);
    const diff = target - now;
    return this.formatTimeDiff(diff);
  }

  // Rift / Incursion cycle (every 2 hours starting at 00:00 UTC)
  getRiftWindow() {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const nextRiftHour = (Math.floor(currentHour / 2) * 2 + 2) % 24;
    const target = new Date();
    target.setUTCHours(nextRiftHour, 0, 0, 0);
    if (target <= now) {
      target.setUTCDate(target.getUTCDate() + 1);
    }
    const diff = target - now;
    const isRiftActive = now.getUTCMinutes() < 30 && (currentHour % 2 === 0);
    return {
      active: isRiftActive,
      timeLeft: this.formatTimeDiff(diff),
      activeDurationLeft: isRiftActive ? this.formatTimeDiff((30 - now.getUTCMinutes()) * 60 * 1000) : null
    };
  }

  // World Boss Windows
  getWorldBossSchedule() {
    const bosses = [
      {
        name: 'Avatar of Tiamat',
        tier: 'Mythic World Raid',
        intervalHours: 6,
        location: 'Tiamaranta Eye - Heart of Wrath',
        drops: 'Prismatic Aether, Mythic Armor Molds, Sovereign Horn'
      },
      {
        name: 'Stormwing Sovereign',
        tier: 'Fabled Boss',
        intervalHours: 4,
        location: 'Beshmundir Temple Spires',
        drops: 'Stormwing Greatsword, Dragon Blood Flux'
      },
      {
        name: 'Rift Overlord Zapiel',
        tier: 'Abyss Raid Boss',
        intervalHours: 8,
        location: 'Reshanta Abyss Eye',
        drops: 'Archon Accessories, Master Weapon Flux'
      }
    ];

    const now = new Date();
    return bosses.map(b => {
      const currentHour = now.getUTCHours();
      const nextHour = (Math.floor(currentHour / b.intervalHours) * b.intervalHours + b.intervalHours) % 24;
      const target = new Date();
      target.setUTCHours(nextHour, 0, 0, 0);
      if (target <= now) {
        target.setUTCDate(target.getUTCDate() + 1);
      }
      return {
        ...b,
        nextSpawnIn: this.formatTimeDiff(target - now)
      };
    });
  }

  formatTimeDiff(ms) {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }
}
