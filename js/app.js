/**
 * Aion 2 Helper - Main Application Controller
 * Handles UI coordination, tab switching, faction theming, modals, and responsive features.
 */

import { CraftingModule } from './modules/crafting.js';
import { EnchantmentModule } from './modules/enchantment.js';
import { ManastoneModule } from './modules/manastones.js';
import { TimersModule } from './modules/timers.js';
import { sound } from './modules/audio.js';

class App {
  constructor() {
    this.crafting = new CraftingModule();
    this.enchantment = new EnchantmentModule();
    this.manastones = new ManastoneModule();
    this.timers = new TimersModule();

    this.currentTab = 'crafting';
    this.currentFaction = 'aether'; // 'aether', 'elyos', 'asmodian'
    this.bomViewMode = 'direct'; // 'direct' | 'raw'
  }

  init() {
    this.initTheme();
    this.setupNavigation();
    this.setupAudioToggle();
    this.setupCraftingUI();
    this.setupEnchantmentUI();
    this.setupManastonesUI();
    this.setupTimersUI();
    this.setupModals();

    // Initial renders
    this.renderAll();

    // Subscribe timers update to UI
    this.timers.subscribe(() => {
      this.updateTimersUI();
    });
  }

  initTheme() {
    const savedFaction = localStorage.getItem('aion2_faction') || 'aether';
    this.setFaction(savedFaction, false);

    document.querySelectorAll('.faction-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const faction = e.currentTarget.dataset.faction;
        this.setFaction(faction, true);
      });
    });
  }

  setFaction(faction, playSfx = true) {
    this.currentFaction = faction;
    document.documentElement.setAttribute('data-theme', faction);
    localStorage.setItem('aion2_faction', faction);

    document.querySelectorAll('.faction-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.faction === faction);
    });

    if (playSfx) sound.playClick();
  }

  setupAudioToggle() {
    const toggleBtn = document.getElementById('audio-toggle-btn');
    if (!toggleBtn) return;

    const updateAudioIcon = () => {
      toggleBtn.innerHTML = sound.enabled
        ? '<span class="icon">🔊</span><span class="btn-text">Audio On</span>'
        : '<span class="icon">🔇</span><span class="btn-text">Audio Muted</span>';
      toggleBtn.classList.toggle('muted', !sound.enabled);
    };

    updateAudioIcon();

    toggleBtn.addEventListener('click', () => {
      sound.toggleSound();
      updateAudioIcon();
    });
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.app-section');

    const switchTab = (tabId) => {
      this.currentTab = tabId;
      navItems.forEach(n => n.classList.toggle('active', n.dataset.tab === tabId));
      sections.forEach(s => s.classList.toggle('active', s.id === `section-${tabId}`));
      window.location.hash = tabId;
      sound.playClick();
    };

    navItems.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        switchTab(tab);
      });
    });

    // Check hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash && ['crafting', 'enchantment', 'manastones', 'timers', 'guide'].includes(hash)) {
      switchTab(hash);
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('primary-nav');
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        sound.playClick();
      });
    }
  }

  // ==========================================
  // CRAFTING SECTION SETUP & RENDERING
  // ==========================================
  setupCraftingUI() {
    // Profession filters
    document.querySelectorAll('.prof-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.prof-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.crafting.filterProfession = e.currentTarget.dataset.prof;
        this.renderRecipeList();
        sound.playClick();
      });
    });

    // Rank and Tier filters
    const rankSelect = document.getElementById('craft-rank-filter');
    if (rankSelect) {
      rankSelect.addEventListener('change', (e) => {
        this.crafting.filterRank = e.target.value;
        this.renderRecipeList();
      });
    }

    const tierSelect = document.getElementById('craft-tier-filter');
    if (tierSelect) {
      tierSelect.addEventListener('change', (e) => {
        this.crafting.filterTier = e.target.value;
        this.renderRecipeList();
      });
    }

    // Search input
    const searchInput = document.getElementById('craft-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.crafting.searchQuery = e.target.value;
        this.renderRecipeList();
      });
    }

    // Quantity controls
    const qtyInput = document.getElementById('craft-qty-input');
    const qtyDec = document.getElementById('craft-qty-dec');
    const qtyInc = document.getElementById('craft-qty-inc');

    if (qtyInput) {
      qtyInput.addEventListener('change', (e) => {
        this.crafting.craftQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
        this.renderSelectedRecipe();
      });
    }
    if (qtyDec) {
      qtyDec.addEventListener('click', () => {
        if (this.crafting.craftQuantity > 1) {
          this.crafting.craftQuantity--;
          if (qtyInput) qtyInput.value = this.crafting.craftQuantity;
          this.renderSelectedRecipe();
          sound.playClick();
        }
      });
    }
    if (qtyInc) {
      qtyInc.addEventListener('click', () => {
        this.crafting.craftQuantity++;
        if (qtyInput) qtyInput.value = this.crafting.craftQuantity;
        this.renderSelectedRecipe();
        sound.playClick();
      });
    }

    // Preset quantity buttons
    document.querySelectorAll('.qty-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = parseInt(e.currentTarget.dataset.qty, 10);
        this.crafting.craftQuantity = val;
        if (qtyInput) qtyInput.value = val;
        this.renderSelectedRecipe();
        sound.playClick();
      });
    });

    // Player level proficiency slider
    const profSlider = document.getElementById('player-prof-slider');
    const profDisplay = document.getElementById('player-prof-value');
    if (profSlider) {
      profSlider.addEventListener('input', (e) => {
        this.crafting.playerLevel = parseInt(e.target.value, 10);
        if (profDisplay) profDisplay.textContent = `Lv. ${this.crafting.playerLevel}`;
        this.renderSelectedRecipe();
      });
    }

    // Broker Tax input
    const brokerTaxInput = document.getElementById('broker-tax-input');
    if (brokerTaxInput) {
      brokerTaxInput.addEventListener('change', (e) => {
        this.crafting.brokerFeePercent = Math.max(0, Math.min(20, parseFloat(e.target.value) || 3));
        this.crafting.saveStorage();
        this.renderCostProfit();
      });
    }

    // BOM View Mode toggle (Direct Ingredients vs Raw Essence Decomposed)
    const bomDirectBtn = document.getElementById('bom-mode-direct');
    const bomRawBtn = document.getElementById('bom-mode-raw');
    if (bomDirectBtn && bomRawBtn) {
      bomDirectBtn.addEventListener('click', () => {
        this.bomViewMode = 'direct';
        bomDirectBtn.classList.add('active');
        bomRawBtn.classList.remove('active');
        this.renderBOM();
        sound.playClick();
      });
      bomRawBtn.addEventListener('click', () => {
        this.bomViewMode = 'raw';
        bomRawBtn.classList.add('active');
        bomDirectBtn.classList.remove('active');
        this.renderBOM();
        sound.playClick();
      });
    }

    // Craft RNG simulation buttons
    document.querySelectorAll('.sim-craft-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const attempts = parseInt(e.currentTarget.dataset.attempts, 10);
        this.runCraftSimulation(attempts);
      });
    });
  }

  renderRecipeList() {
    const container = document.getElementById('recipe-list-container');
    if (!container) return;

    const recipes = this.crafting.getFilteredRecipes();
    if (recipes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <p>No recipes match the selected filters or search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = recipes.map(r => {
      const isSelected = this.crafting.selectedRecipe && this.crafting.selectedRecipe.id === r.id;
      return `
        <div class="recipe-card ${r.tier} ${isSelected ? 'selected' : ''}" data-recipe-id="${r.id}">
          <div class="recipe-card-header">
            <span class="recipe-icon">${r.icon}</span>
            <div class="recipe-card-info">
              <h4 class="recipe-name">${r.name}</h4>
              <div class="recipe-meta">
                <span class="tier-pill tier-${r.tier}">${r.tier.toUpperCase()}</span>
                <span class="rank-pill">${r.rank === 'professional' ? 'Professional' : 'Novice'} Lv. ${r.levelReq}</span>
              </div>
            </div>
          </div>
          <p class="recipe-summary">${r.description.slice(0, 75)}...</p>
        </div>
      `;
    }).join('');

    // Attach click events
    container.querySelectorAll('.recipe-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.recipeId;
        this.crafting.selectRecipe(id);
        this.renderRecipeList();
        this.renderSelectedRecipe();
      });
    });
  }

  renderSelectedRecipe() {
    const r = this.crafting.selectedRecipe;
    if (!r) return;

    // Header info
    const iconEl = document.getElementById('sel-recipe-icon');
    const nameEl = document.getElementById('sel-recipe-name');
    const tierPill = document.getElementById('sel-recipe-tier');
    const rankPill = document.getElementById('sel-recipe-rank');
    const descEl = document.getElementById('sel-recipe-desc');
    const procRateEl = document.getElementById('sel-recipe-proc-rate');

    if (iconEl) iconEl.textContent = r.icon;
    if (nameEl) nameEl.textContent = r.name;
    if (tierPill) {
      tierPill.className = `tier-pill tier-${r.tier}`;
      tierPill.textContent = r.tier.toUpperCase();
    }
    if (rankPill) {
      rankPill.textContent = `${r.profession.toUpperCase()} • ${r.rank.toUpperCase()} LV. ${r.levelReq}`;
    }
    if (descEl) descEl.textContent = r.description;

    const procChance = this.crafting.getEffectiveProcChance(r);
    if (procRateEl) {
      procRateEl.textContent = `${(procChance * 100).toFixed(1)}% Proc Chance`;
    }

    // Render Proc Card
    const procCard = document.getElementById('recipe-proc-card');
    if (procCard && r.procItem) {
      procCard.innerHTML = `
        <div class="proc-header">
          <span class="proc-badge">✨ CRITICAL PROC OUTCOME</span>
          <span class="tier-pill tier-${r.procItem.tier}">${r.procItem.tier.toUpperCase()}</span>
        </div>
        <h4 class="proc-item-name">${r.procItem.name}</h4>
        <p class="proc-stats">${r.procItem.stats}</p>
        <div class="proc-footer">
          <span class="proc-price">Est. Market Value: <strong>${(r.procItem.baseSellPrice || 0).toLocaleString()} Kinah</strong></span>
        </div>
      `;
    }

    this.renderBOM();
    this.renderCostProfit();
  }

  renderBOM() {
    const container = document.getElementById('bom-table-body');
    if (!container) return;

    const r = this.crafting.selectedRecipe;
    const qty = this.crafting.craftQuantity;
    const { direct, raw } = this.crafting.getDecomposedMaterials(r, qty);

    const activeList = this.bomViewMode === 'direct' ? direct : raw;

    container.innerHTML = activeList.map(m => {
      const isChecked = this.crafting.isChecklistChecked(r.id, m.id);
      return `
        <tr class="${isChecked ? 'checked-row' : ''}">
          <td class="col-check">
            <input type="checkbox" class="bom-checkbox" data-mat-id="${m.id}" ${isChecked ? 'checked' : ''} />
          </td>
          <td class="col-item">
            <div class="mat-cell">
              <span class="mat-icon">${m.icon || '📦'}</span>
              <div>
                <span class="mat-name">${m.name}</span>
                <span class="mat-source">${m.source || m.location || ''}</span>
              </div>
            </div>
          </td>
          <td class="col-count font-bold">${m.requiredCount.toLocaleString()}</td>
          <td class="col-unit-price">
            <div class="price-input-wrapper">
              <input type="number" class="mat-price-input" data-mat-id="${m.id}" value="${m.unitPrice}" min="0" step="50" />
              <span class="currency">Kinah</span>
            </div>
          </td>
          <td class="col-subtotal font-mono">${m.subtotalPrice.toLocaleString()} Kinah</td>
        </tr>
      `;
    }).join('');

    // Checkbox listeners
    container.querySelectorAll('.bom-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const matId = e.currentTarget.dataset.matId;
        this.crafting.toggleChecklist(r.id, matId);
        this.renderBOM();
        sound.playClick();
      });
    });

    // Price input listeners
    container.querySelectorAll('.mat-price-input').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const matId = e.currentTarget.dataset.matId;
        this.crafting.setMaterialPrice(matId, e.target.value);
        this.renderBOM();
        this.renderCostProfit();
      });
    });
  }

  renderCostProfit() {
    const r = this.crafting.selectedRecipe;
    const qty = this.crafting.craftQuantity;
    const calc = this.crafting.getCostAndProfit(r, qty);
    if (!calc) return;

    const costEl = document.getElementById('calc-total-cost');
    const revenueEl = document.getElementById('calc-expected-revenue');
    const taxEl = document.getElementById('calc-broker-tax');
    const profitEl = document.getElementById('calc-net-profit');
    const roiEl = document.getElementById('calc-roi-percent');

    if (costEl) costEl.textContent = `${Math.round(calc.totalMaterialCost).toLocaleString()} Kinah`;
    if (revenueEl) revenueEl.textContent = `${Math.round(calc.expectedRevenue).toLocaleString()} Kinah`;
    if (taxEl) taxEl.textContent = `-${Math.round(calc.brokerCut).toLocaleString()} Kinah (${this.crafting.brokerFeePercent}%)`;

    if (profitEl) {
      profitEl.textContent = `${Math.round(calc.netExpectedProfit).toLocaleString()} Kinah`;
      profitEl.className = calc.netExpectedProfit >= 0 ? 'profit-val positive' : 'profit-val negative';
    }

    if (roiEl) {
      roiEl.textContent = `${calc.roiPercent >= 0 ? '+' : ''}${calc.roiPercent.toFixed(1)}% ROI`;
      roiEl.className = calc.roiPercent >= 0 ? 'roi-pill positive' : 'roi-pill negative';
    }
  }

  runCraftSimulation(attempts) {
    const r = this.crafting.selectedRecipe;
    const res = this.crafting.simulateCraft(r, attempts);
    if (!res) return;

    const statsContainer = document.getElementById('sim-craft-stats');
    const logContainer = document.getElementById('sim-craft-log');

    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-card">
          <span class="stat-label">Simulated Batches</span>
          <span class="stat-value font-mono">${res.attempts}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Critical Procs ✨</span>
          <span class="stat-value text-accent font-mono">${res.procCount}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Standard Crafts</span>
          <span class="stat-value font-mono">${res.normalCount}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Actual Proc Rate</span>
          <span class="stat-value font-mono">${res.procRateAchieved.toFixed(1)}%</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pity Supply Tokens</span>
          <span class="stat-value text-gold font-mono">+${res.tokensGained}</span>
        </div>
      `;
    }

    if (logContainer) {
      logContainer.innerHTML = res.results.map(item => `
        <div class="craft-log-entry ${item.isProc ? 'is-proc' : 'is-normal'}">
          <span class="log-badge">${item.isProc ? '✨ PROC!' : '✓ CRAFT'}</span>
          <span class="log-text">${item.item}</span>
          ${item.tokensGained ? `<span class="log-tokens">+${item.tokensGained} Pity Tokens</span>` : ''}
        </div>
      `).join('');
    }
  }

  // ==========================================
  // ENCHANTMENT SECTION SETUP & RENDERING
  // ==========================================
  setupEnchantmentUI() {
    // Gear Type
    document.querySelectorAll('.gear-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.gear-type-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.enchantment.selectedGearType = e.currentTarget.dataset.type;
        this.renderEnchantmentDisplay();
        sound.playClick();
      });
    });

    // Gear Tier
    const tierSelect = document.getElementById('ench-tier-select');
    if (tierSelect) {
      tierSelect.addEventListener('change', (e) => {
        this.enchantment.selectedTier = e.target.value;
        this.renderEnchantmentDisplay();
      });
    }

    // Supplement
    document.querySelectorAll('.supp-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.supp-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.enchantment.supplementType = e.currentTarget.dataset.supp;
        this.renderEnchantmentDisplay();
        sound.playClick();
      });
    });

    // Breakpoint checkbox
    const breakCheck = document.getElementById('ench-protection-check');
    if (breakCheck) {
      breakCheck.addEventListener('change', (e) => {
        this.enchantment.useBreakProtection = e.target.checked;
      });
    }

    // Enchant Once button
    const enchOnceBtn = document.getElementById('ench-once-btn');
    if (enchOnceBtn) {
      enchOnceBtn.addEventListener('click', () => {
        this.enchantment.enchantOnce();
        this.renderEnchantmentDisplay();
      });
    }

    // Auto Enchant button
    const autoEnchBtn = document.getElementById('ench-auto-btn');
    const autoTargetSelect = document.getElementById('ench-auto-target');
    if (autoEnchBtn && autoTargetSelect) {
      autoEnchBtn.addEventListener('click', () => {
        const target = parseInt(autoTargetSelect.value, 10);
        this.enchantment.autoEnchant(target, 250);
        this.renderEnchantmentDisplay();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('ench-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.enchantment.reset();
        this.renderEnchantmentDisplay();
      });
    }

    // Monte Carlo Simulator
    const monteBtn = document.getElementById('ench-monte-carlo-btn');
    if (monteBtn) {
      monteBtn.addEventListener('click', () => {
        const target = parseInt(document.getElementById('ench-monte-target').value, 10) || 15;
        const res = this.enchantment.runMonteCarlo(500, 0, target);
        this.renderMonteCarloResults(res);
        sound.playCraftProc();
      });
    }
  }

  renderEnchantmentDisplay() {
    const lvl = this.enchantment.currentLevel;
    const tier = this.enchantment.selectedTier;
    const gearType = this.enchantment.selectedGearType;
    const rate = this.enchantment.getEffectiveSuccessRate();
    const stats = this.enchantment.getStatBonus();

    // Visual Aura Level
    const gearVisual = document.getElementById('ench-visual-card');
    const levelBadge = document.getElementById('ench-level-badge');
    const itemName = document.getElementById('ench-gear-name');
    const gearIcon = document.getElementById('ench-gear-icon');

    const gearNames = {
      weapon: 'Radiant Guardian Greatsword',
      armor: 'Celestial Aegis Cuirass',
      accessory: 'Ring of the Aether Archon'
    };
    const gearIcons = { weapon: '⚔️', armor: '🛡️', accessory: '💍' };

    if (itemName) itemName.textContent = `+${lvl} ${gearNames[gearType]}`;
    if (gearIcon) gearIcon.textContent = gearIcons[gearType];
    if (levelBadge) levelBadge.textContent = `+${lvl}`;

    if (gearVisual) {
      gearVisual.className = `gear-visual-display tier-${tier}`;
      if (lvl >= 20) gearVisual.classList.add('aura-mythic');
      else if (lvl >= 15) gearVisual.classList.add('aura-radiant');
      else if (lvl >= 10) gearVisual.classList.add('aura-electric');
      else if (lvl >= 5) gearVisual.classList.add('aura-glow');
    }

    // Rate bar
    const rateBar = document.getElementById('ench-rate-bar');
    const rateLabel = document.getElementById('ench-rate-label');
    if (rateBar) rateBar.style.width = `${(rate * 100).toFixed(0)}%`;
    if (rateLabel) rateLabel.textContent = `${(rate * 100).toFixed(1)}% Success Chance (Next: +${lvl + 1})`;

    // Stats
    const statsEl = document.getElementById('ench-stat-bonuses');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat-row"><strong>Primary:</strong> <span>${stats.main}</span></div>
        ${stats.sub ? `<div class="stat-row"><strong>Breakpoint (+10):</strong> <span class="text-accent">${stats.sub}</span></div>` : ''}
        ${stats.bonus ? `<div class="stat-row"><strong>Resonance (+15):</strong> <span class="text-gold">${stats.bonus}</span></div>` : ''}
      `;
    }

    // Counters
    const stonesEl = document.getElementById('ench-total-stones');
    const suppsEl = document.getElementById('ench-total-supps');
    const costEl = document.getElementById('ench-total-kinah');

    if (stonesEl) stonesEl.textContent = this.enchantment.totalStonesUsed.toLocaleString();
    if (suppsEl) suppsEl.textContent = this.enchantment.totalSupplementsUsed.toLocaleString();
    if (costEl) costEl.textContent = `${this.enchantment.totalKinahCost.toLocaleString()} Kinah`;

    // History log
    const logEl = document.getElementById('ench-history-log');
    if (logEl) {
      logEl.innerHTML = this.enchantment.history.map(item => `
        <div class="ench-log-entry ${item.isSuccess ? 'success' : 'fail'}">
          <span class="log-badge">${item.isSuccess ? 'SUCCESS' : 'FAIL'}</span>
          <span class="log-info">+${item.fromLevel} ➔ +${item.toLevel}</span>
          <span class="log-meta">Roll: ${item.roll}% (Rate: ${item.rate}%)</span>
          <span class="log-msg">${item.message}</span>
        </div>
      `).join('');
    }
  }

  renderMonteCarloResults(res) {
    const container = document.getElementById('monte-results-container');
    if (!container) return;

    container.innerHTML = `
      <div class="monte-stats-grid">
        <div class="stat-card">
          <span class="stat-label">Simulated Daevas</span>
          <span class="stat-value font-mono">${res.simulationsCount}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Average Stones Needed</span>
          <span class="stat-value text-accent font-mono">${res.avgStones}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Median Stones</span>
          <span class="stat-value font-mono">${res.medianStones}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Top 10% Lucky Run</span>
          <span class="stat-value text-gold font-mono">${res.p10Stones} stones</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Bottom 10% Hard Pity</span>
          <span class="stat-value text-danger font-mono">${res.p90Stones} stones</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Est. Total Kinah Budget</span>
          <span class="stat-value font-mono">${res.avgCost.toLocaleString()} Kinah</span>
        </div>
      </div>
      <p class="monte-explanation">
        Based on 500 Monte Carlo simulated attempts reaching target <strong>+${res.toLvl}</strong> from +${res.fromLvl} with threshold safeguards.
      </p>
    `;
  }

  // ==========================================
  // MANASTONES & TRANSFER CRAFTING SETUP
  // ==========================================
  setupManastonesUI() {
    // Mode toggle: modern safe vs classic strict
    const modeModern = document.getElementById('ms-mode-modern');
    const modeClassic = document.getElementById('ms-mode-classic');

    if (modeModern && modeClassic) {
      modeModern.addEventListener('click', () => {
        this.manastones.mode = 'modern';
        modeModern.classList.add('active');
        modeClassic.classList.remove('active');
        sound.playClick();
      });
      modeClassic.addEventListener('click', () => {
        this.manastones.mode = 'classic';
        modeClassic.classList.add('active');
        modeModern.classList.remove('active');
        sound.playClick();
      });
    }

    // Stone type select
    const stoneTypeSelect = document.getElementById('ms-stone-type');
    if (stoneTypeSelect) {
      stoneTypeSelect.addEventListener('change', (e) => {
        this.manastones.selectedStoneType = e.target.value;
      });
    }

    // Stone tier select
    const stoneTierSelect = document.getElementById('ms-stone-tier');
    if (stoneTierSelect) {
      stoneTierSelect.addEventListener('change', (e) => {
        this.manastones.selectedStoneTier = e.target.value;
      });
    }

    // Socket Once button
    const socketBtn = document.getElementById('ms-socket-btn');
    if (socketBtn) {
      socketBtn.addEventListener('click', () => {
        this.manastones.socketStone();
        this.renderManastonesDisplay();
      });
    }

    // Auto-Socket button
    const autoSocketBtn = document.getElementById('ms-auto-socket-btn');
    if (autoSocketBtn) {
      autoSocketBtn.addEventListener('click', () => {
        this.manastones.autoSocketToTarget(6, 100);
        this.renderManastonesDisplay();
      });
    }

    // Reset Sockets button
    const resetSocketsBtn = document.getElementById('ms-reset-btn');
    if (resetSocketsBtn) {
      resetSocketsBtn.addEventListener('click', () => {
        this.manastones.resetSockets();
        this.renderManastonesDisplay();
        sound.playClick();
      });
    }

    // Transfer Crafting controls
    const transferSourceLvl = document.getElementById('transfer-source-lvl');
    const transferTargetTier = document.getElementById('transfer-target-tier');
    const transferPreserve = document.getElementById('transfer-preserve-substats');

    const updateTransferCalc = () => {
      const src = parseInt(transferSourceLvl ? transferSourceLvl.value : 15, 10);
      const tier = transferTargetTier ? transferTargetTier.value : 'eternal';
      const pres = transferPreserve ? transferPreserve.checked : true;
      const res = this.manastones.calculateTransferCraft(src, tier, pres);
      this.renderTransferCraftDisplay(res);
    };

    if (transferSourceLvl) transferSourceLvl.addEventListener('input', updateTransferCalc);
    if (transferTargetTier) transferTargetTier.addEventListener('change', updateTransferCalc);
    if (transferPreserve) transferPreserve.addEventListener('change', updateTransferCalc);

    updateTransferCalc();
  }

  renderManastonesDisplay() {
    const slotsContainer = document.getElementById('manastone-slots-grid');
    if (slotsContainer) {
      slotsContainer.innerHTML = this.manastones.sockets.map((s, idx) => {
        const rate = (this.manastones.getSuccessRate(idx) * 100).toFixed(0);
        if (s.filled) {
          const typeDef = this.manastones.stoneTypes[s.stoneType];
          return `
            <div class="socket-slot filled tier-${s.stoneTier}">
              <span class="slot-idx">#${idx + 1}</span>
              <span class="slot-jewel">${typeDef ? typeDef.icon : '💎'}</span>
              <div class="slot-info">
                <span class="slot-name">${typeDef ? typeDef.name : 'Manastone'}</span>
                <span class="slot-stat">+${s.statValue}</span>
              </div>
            </div>
          `;
        } else {
          const isNext = idx === this.manastones.getCurrentSlotIndex();
          return `
            <div class="socket-slot empty ${isNext ? 'next-target' : ''}">
              <span class="slot-idx">#${idx + 1}</span>
              <span class="slot-placeholder">○</span>
              <span class="slot-chance">${rate}% Chance</span>
            </div>
          `;
        }
      }).join('');
    }

    // Totals
    const spentEl = document.getElementById('ms-stones-spent');
    const attemptsEl = document.getElementById('ms-attempts-count');
    if (spentEl) spentEl.textContent = this.manastones.totalStonesSpent;
    if (attemptsEl) attemptsEl.textContent = this.manastones.totalAttempts;

    // Total stats
    const statsContainer = document.getElementById('ms-accumulated-stats');
    if (statsContainer) {
      const stats = this.manastones.getTotalSocketedStats();
      if (stats.length === 0) {
        statsContainer.innerHTML = '<span class="empty-text">No manastones socketed yet.</span>';
      } else {
        statsContainer.innerHTML = stats.map(st => `
          <div class="stat-badge">
            <span>${st.icon} ${st.name}:</span>
            <strong class="text-accent">+${st.totalValue}</strong>
          </div>
        `).join('');
      }
    }

    // Log
    const logEl = document.getElementById('ms-history-log');
    if (logEl) {
      logEl.innerHTML = this.manastones.history.map(item => `
        <div class="ms-log-entry ${item.isSuccess ? 'success' : 'fail'}">
          <span class="log-badge">${item.isSuccess ? 'SUCCESS' : 'FAIL'}</span>
          <span class="log-msg">${item.message}</span>
        </div>
      `).join('');
    }
  }

  renderTransferCraftDisplay(res) {
    const resEl = document.getElementById('transfer-results-card');
    if (!resEl) return;

    resEl.innerHTML = `
      <div class="transfer-summary-grid">
        <div class="stat-card">
          <span class="stat-label">Source Gear Level</span>
          <span class="stat-value font-mono">+${res.sourceAmpLevel}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Inherited Amp Level</span>
          <span class="stat-value text-accent font-mono">+${res.transferredAmp}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Transfer Catalysts</span>
          <span class="stat-value text-gold font-mono">${res.catalysts}x</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Transfer Scrolls</span>
          <span class="stat-value font-mono">${res.transferScrolls}x</span>
        </div>
        <div class="stat-card wide">
          <span class="stat-label">Total Kinah Fee</span>
          <span class="stat-value text-accent font-mono">${res.totalKinah.toLocaleString()} Kinah</span>
        </div>
      </div>
    `;
  }

  // ==========================================
  // TIMERS SECTION SETUP & RENDERING
  // ==========================================
  setupTimersUI() {
    // Add custom timer form
    const addBtn = document.getElementById('add-timer-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const name = prompt('Enter Gathering Node or Mob Name (e.g. Mythic Titanium Node):');
        if (!name) return;
        const mins = prompt('Enter Respawn Cooldown in minutes (e.g. 25):', '25');
        if (!mins) return;
        this.timers.addCustomTimer(name, mins);
      });
    }
  }

  updateTimersUI() {
    // Server Resets
    const dailyEl = document.getElementById('timer-daily-reset');
    const weeklyEl = document.getElementById('timer-weekly-reset');
    const utcClockEl = document.getElementById('header-utc-clock');

    if (dailyEl) dailyEl.textContent = this.timers.getDailyReset();
    if (weeklyEl) weeklyEl.textContent = this.timers.getWeeklyReset();
    if (utcClockEl) {
      const now = new Date();
      utcClockEl.textContent = `${now.toUTCString().slice(17, 25)} UTC`;
    }

    // Rift Status
    const rift = this.timers.getRiftWindow();
    const riftBadge = document.getElementById('rift-status-badge');
    const riftTimer = document.getElementById('rift-time-left');

    if (riftBadge) {
      riftBadge.textContent = rift.active ? 'DIMENSIONAL RIFT OPEN' : 'RIFT DORMANT';
      riftBadge.className = rift.active ? 'status-pill active-rift' : 'status-pill dormant-rift';
    }
    if (riftTimer) {
      riftTimer.textContent = rift.active
        ? `Closing in: ${rift.activeDurationLeft}`
        : `Next Incursion in: ${rift.timeLeft}`;
    }

    // World Bosses
    const bosses = this.timers.getWorldBossSchedule();
    const bossContainer = document.getElementById('world-bosses-grid');
    if (bossContainer) {
      bossContainer.innerHTML = bosses.map(b => `
        <div class="boss-card">
          <div class="boss-header">
            <span class="boss-icon">🐉</span>
            <div>
              <h4 class="boss-name">${b.name}</h4>
              <span class="boss-tier">${b.tier}</span>
            </div>
          </div>
          <div class="boss-body">
            <div class="boss-timer">
              <span class="timer-label">Next Spawn Window:</span>
              <span class="timer-clock font-mono">${b.nextSpawnIn}</span>
            </div>
            <p class="boss-loc">📍 ${b.location}</p>
            <p class="boss-drops">🎁 <strong>Key Drops:</strong> ${b.drops}</p>
          </div>
        </div>
      `).join('');
    }

    // Custom Gathering Node Timers
    const nodeContainer = document.getElementById('custom-timers-grid');
    if (nodeContainer) {
      const now = Date.now();
      nodeContainer.innerHTML = this.timers.customTimers.map(t => {
        const isActive = t.targetTimestamp && now < t.targetTimestamp;
        const isReady = t.targetTimestamp && now >= t.targetTimestamp;
        const diffMs = isActive ? t.targetTimestamp - now : 0;
        const formatted = this.timers.formatTimeDiff(diffMs);

        return `
          <div class="timer-card ${isReady ? 'is-ready' : ''}">
            <div class="timer-header">
              <span class="timer-icon">${t.icon}</span>
              <div class="timer-title-box">
                <h4 class="timer-title">${t.name}</h4>
                <span class="timer-loc">${t.location || 'Atreia'}</span>
              </div>
              <button class="delete-timer-btn" data-id="${t.id}" title="Delete Timer">✕</button>
            </div>
            <div class="timer-clock-display">
              ${isActive ? `<span class="countdown-clock font-mono">${formatted}</span>` : ''}
              ${isReady ? `<span class="ready-badge">✦ NODE RESPAWNED!</span>` : ''}
              ${!isActive && !isReady ? `<span class="idle-clock font-mono">${t.durationMinutes}:00</span>` : ''}
            </div>
            <div class="timer-actions">
              <button class="btn btn-secondary start-node-timer" data-id="${t.id}">
                ${isActive ? 'Restart (' + t.durationMinutes + 'm)' : 'Harvest / Start (' + t.durationMinutes + 'm)'}
              </button>
              ${isActive || isReady ? `
                <button class="btn btn-outline reset-node-timer" data-id="${t.id}">Reset</button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      // Attach button events
      nodeContainer.querySelectorAll('.start-node-timer').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.timers.startCustomTimer(e.currentTarget.dataset.id);
        });
      });
      nodeContainer.querySelectorAll('.reset-node-timer').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.timers.resetCustomTimer(e.currentTarget.dataset.id);
        });
      });
      nodeContainer.querySelectorAll('.delete-timer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.timers.deleteCustomTimer(e.currentTarget.dataset.id);
        });
      });
    }
  }

  // ==========================================
  // MODALS & DATA IMPORT/EXPORT
  // ==========================================
  setupModals() {
    // Custom Recipe Modal
    const addRecipeModal = document.getElementById('add-recipe-modal');
    const openAddRecipeBtn = document.getElementById('open-add-recipe-btn');
    const closeAddRecipeBtn = document.getElementById('close-add-recipe-btn');
    const customRecipeForm = document.getElementById('custom-recipe-form');

    if (openAddRecipeBtn && addRecipeModal) {
      openAddRecipeBtn.addEventListener('click', () => {
        addRecipeModal.classList.add('open');
        sound.playClick();
      });
    }
    if (closeAddRecipeBtn && addRecipeModal) {
      closeAddRecipeBtn.addEventListener('click', () => {
        addRecipeModal.classList.remove('open');
      });
    }

    if (customRecipeForm) {
      customRecipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cr-name').value;
        const profession = document.getElementById('cr-prof').value;
        const levelReq = parseInt(document.getElementById('cr-level').value, 10);
        const tier = document.getElementById('cr-tier').value;
        const baseSellPrice = parseInt(document.getElementById('cr-price').value, 10);
        const description = document.getElementById('cr-desc').value || 'Custom crafted equipment.';

        // Parse ingredients text (e.g. "titanium_ingot: 10, radiant_flux: 4")
        const ingredientsRaw = document.getElementById('cr-materials').value;
        const materials = ingredientsRaw.split(',').map(part => {
          const [id, count] = part.split(':').map(s => s.trim());
          return { id: id || 'raw_iron_ore', count: parseInt(count, 10) || 1 };
        }).filter(m => m.id);

        const newRec = this.crafting.addCustomRecipe({
          name,
          profession,
          levelReq,
          tier,
          baseSellPrice,
          description,
          icon: profession === 'cooking' ? '🍲' : profession === 'alchemy' ? '🧪' : '⚔️',
          materials,
          baseProcChance: 0.30
        });

        this.crafting.selectRecipe(newRec.id);
        this.renderRecipeList();
        this.renderSelectedRecipe();
        addRecipeModal.classList.remove('open');
        sound.playCraftProc();
        customRecipeForm.reset();
      });
    }

    // Export/Import Modal
    const dataModal = document.getElementById('data-modal');
    const openDataBtn = document.getElementById('open-data-modal-btn');
    const closeDataBtn = document.getElementById('close-data-modal-btn');
    const dataTextarea = document.getElementById('data-textarea');
    const exportBtn = document.getElementById('export-data-btn');
    const importBtn = document.getElementById('import-data-btn');
    const resetPricesBtn = document.getElementById('reset-prices-btn');

    if (openDataBtn && dataModal) {
      openDataBtn.addEventListener('click', () => {
        dataModal.classList.add('open');
        if (dataTextarea) dataTextarea.value = this.crafting.exportData();
        sound.playClick();
      });
    }
    if (closeDataBtn && dataModal) {
      closeDataBtn.addEventListener('click', () => {
        dataModal.classList.remove('open');
      });
    }
    if (exportBtn && dataTextarea) {
      exportBtn.addEventListener('click', () => {
        dataTextarea.value = this.crafting.exportData();
        navigator.clipboard?.writeText(dataTextarea.value);
        alert('Data copied to clipboard!');
      });
    }
    if (importBtn && dataTextarea) {
      importBtn.addEventListener('click', () => {
        const res = this.crafting.importData(dataTextarea.value);
        if (res.success) {
          alert('Data imported successfully!');
          dataModal.classList.remove('open');
          this.renderAll();
        } else {
          alert('Import failed: ' + res.error);
        }
      });
    }
    if (resetPricesBtn) {
      resetPricesBtn.addEventListener('click', () => {
        if (confirm('Reset all custom material prices back to default values?')) {
          this.crafting.resetMaterialPrices();
          this.renderBOM();
          this.renderCostProfit();
          sound.playClick();
        }
      });
    }
  }

  renderAll() {
    this.renderRecipeList();
    this.renderSelectedRecipe();
    this.renderEnchantmentDisplay();
    this.renderManastonesDisplay();
    this.updateTimersUI();
  }
}

// Instantiate on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
