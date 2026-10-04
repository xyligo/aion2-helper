/**
 * Crafting Module for Aion 2 Helper
 * Handles recipe search, bill of materials (BOM), multi-tier decomposition,
 * economic cost/profit broker calculator, and RNG proc simulation.
 */

import { RECIPES_DB } from '../data/recipes.js';
import { MATERIALS_DB } from '../data/materials.js';
import { sound } from './audio.js';

export class CraftingModule {
  constructor() {
    this.recipes = [...RECIPES_DB];
    this.materials = { ...MATERIALS_DB };
    this.customRecipes = [];
    this.selectedRecipe = null;
    this.craftQuantity = 1;
    this.playerLevel = 80;
    this.customPrices = {};
    this.checklist = {};
    this.filterProfession = 'all';
    this.filterRank = 'all';
    this.filterTier = 'all';
    this.searchQuery = '';
    this.brokerFeePercent = 3.0; // 3% broker tax

    this.initStorage();
    this.selectedRecipe = this.recipes[0];
  }

  initStorage() {
    try {
      const storedCustom = localStorage.getItem('aion2_custom_recipes');
      if (storedCustom) {
        this.customRecipes = JSON.parse(storedCustom);
        this.recipes = [...RECIPES_DB, ...this.customRecipes];
      }
      const storedPrices = localStorage.getItem('aion2_custom_prices');
      if (storedPrices) {
        this.customPrices = JSON.parse(storedPrices);
      }
      const storedChecklist = localStorage.getItem('aion2_craft_checklist');
      if (storedChecklist) {
        this.checklist = JSON.parse(storedChecklist);
      }
      const storedBrokerFee = localStorage.getItem('aion2_broker_fee');
      if (storedBrokerFee) {
        this.brokerFeePercent = parseFloat(storedBrokerFee);
      }
    } catch (e) {
      console.warn('Storage init fallback', e);
    }
  }

  saveStorage() {
    try {
      localStorage.setItem('aion2_custom_recipes', JSON.stringify(this.customRecipes));
      localStorage.setItem('aion2_custom_prices', JSON.stringify(this.customPrices));
      localStorage.setItem('aion2_craft_checklist', JSON.stringify(this.checklist));
      localStorage.setItem('aion2_broker_fee', this.brokerFeePercent.toString());
    } catch (e) {}
  }

  getMaterial(id) {
    if (this.materials[id]) return this.materials[id];
    // fallback generic
    return {
      id,
      name: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      category: 'general',
      tier: 'common',
      basePrice: 500,
      icon: '📦'
    };
  }

  getMaterialPrice(id) {
    if (this.customPrices[id] !== undefined) {
      return this.customPrices[id];
    }
    const mat = this.getMaterial(id);
    return mat.basePrice || 0;
  }

  setMaterialPrice(id, price) {
    this.customPrices[id] = Math.max(0, parseInt(price, 10) || 0);
    this.saveStorage();
  }

  resetMaterialPrices() {
    this.customPrices = {};
    this.saveStorage();
  }

  getEffectiveProcChance(recipe) {
    if (!recipe) return 0;
    let base = recipe.baseProcChance || 0.25;
    // Proficiency bonus in Aion 2: if player level exceeds recipe levelReq
    const diff = Math.max(0, this.playerLevel - recipe.levelReq);
    const bonus = Math.min(0.20, (diff * 0.008)); // up to +20% bonus
    return Math.min(0.65, base + bonus);
  }

  getFilteredRecipes() {
    return this.recipes.filter(r => {
      if (this.filterProfession !== 'all' && r.profession !== this.filterProfession) return false;
      if (this.filterRank !== 'all' && r.rank !== this.filterRank) return false;
      if (this.filterTier !== 'all' && r.tier !== this.filterTier) return false;
      if (this.searchQuery.trim() !== '') {
        const q = this.searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCategory = (r.category || '').toLowerCase().includes(q);
        const matchesMaterials = r.materials.some(m => {
          const mat = this.getMaterial(m.id);
          return mat.name.toLowerCase().includes(q);
        });
        if (!matchesName && !matchesCategory && !matchesMaterials) return false;
      }
      return true;
    });
  }

  selectRecipe(recipeId) {
    const found = this.recipes.find(r => r.id === recipeId);
    if (found) {
      this.selectedRecipe = found;
      sound.playClick();
    }
    return this.selectedRecipe;
  }

  // Decomposes materials into raw base components (e.g. Iron Ingot -> Raw Iron Ore + Flux)
  getDecomposedMaterials(recipe, quantity = 1) {
    if (!recipe) return { direct: [], raw: [] };

    // 1. Direct materials
    const direct = recipe.materials.map(m => {
      const mat = this.getMaterial(m.id);
      const totalCount = m.count * quantity;
      const unitPrice = this.getMaterialPrice(m.id);
      return {
        ...mat,
        requiredCount: totalCount,
        unitPrice,
        subtotalPrice: unitPrice * totalCount,
        isCrafted: !!mat.isCrafted
      };
    });

    // 2. Recursive raw breakdown
    const rawMap = {};
    const decompose = (matId, multiplier) => {
      const mat = this.getMaterial(matId);
      if (mat.isCrafted && mat.recipe && mat.recipe.materials) {
        mat.recipe.materials.forEach(sub => {
          decompose(sub.id, multiplier * sub.count);
        });
      } else {
        if (!rawMap[matId]) {
          rawMap[matId] = {
            material: mat,
            count: 0
          };
        }
        rawMap[matId].count += multiplier;
      }
    };

    recipe.materials.forEach(m => {
      decompose(m.id, m.count * quantity);
    });

    const raw = Object.keys(rawMap).map(id => {
      const item = rawMap[id];
      const unitPrice = this.getMaterialPrice(id);
      return {
        ...item.material,
        requiredCount: item.count,
        unitPrice,
        subtotalPrice: unitPrice * item.count
      };
    });

    return { direct, raw };
  }

  getCostAndProfit(recipe, quantity = 1) {
    if (!recipe) return null;
    const { direct } = this.getDecomposedMaterials(recipe, quantity);
    const totalMaterialCost = direct.reduce((acc, cur) => acc + cur.subtotalPrice, 0);

    const normalSellPrice = recipe.baseSellPrice * quantity;
    const procSellPrice = (recipe.procItem ? recipe.procItem.baseSellPrice : recipe.baseSellPrice * 1.8) * quantity;

    const procChance = this.getEffectiveProcChance(recipe);
    const expectedRevenue = (1 - procChance) * normalSellPrice + procChance * procSellPrice;
    const brokerCut = expectedRevenue * (this.brokerFeePercent / 100);
    const netExpectedProfit = expectedRevenue - brokerCut - totalMaterialCost;
    const roiPercent = totalMaterialCost > 0 ? (netExpectedProfit / totalMaterialCost) * 100 : 0;

    return {
      totalMaterialCost,
      normalSellPrice,
      procSellPrice,
      procChance,
      expectedRevenue,
      brokerCut,
      netExpectedProfit,
      roiPercent
    };
  }

  toggleChecklist(recipeId, materialId) {
    const key = `${recipeId}::${materialId}`;
    this.checklist[key] = !this.checklist[key];
    this.saveStorage();
    return this.checklist[key];
  }

  isChecklistChecked(recipeId, materialId) {
    const key = `${recipeId}::${materialId}`;
    return !!this.checklist[key];
  }

  simulateCraft(recipe, attempts = 1) {
    if (!recipe) return null;
    const procChance = this.getEffectiveProcChance(recipe);
    let normalCount = 0;
    let procCount = 0;
    let tokensGained = 0;
    const results = [];

    for (let i = 0; i < attempts; i++) {
      const roll = Math.random();
      const isProc = roll < procChance;
      if (isProc) {
        procCount++;
        results.push({
          attempt: i + 1,
          success: true,
          isProc: true,
          item: recipe.procItem ? recipe.procItem.name : `Noble ${recipe.name}`,
          tier: recipe.procItem ? recipe.procItem.tier : recipe.tier
        });
      } else {
        normalCount++;
        const tokens = recipe.pitySupplyTokens || 1;
        tokensGained += tokens;
        results.push({
          attempt: i + 1,
          success: true,
          isProc: false,
          item: recipe.name,
          tier: recipe.tier,
          tokensGained: tokens
        });
      }
    }

    if (procCount > 0) {
      sound.playCraftProc();
    } else {
      sound.playCraftSuccess();
    }

    return {
      attempts,
      normalCount,
      procCount,
      procRateAchieved: (procCount / attempts) * 100,
      tokensGained,
      results: results.slice(-20) // return last 20 for log rendering
    };
  }

  addCustomRecipe(newRecipe) {
    const id = 'custom_' + Date.now();
    const recipeObj = {
      ...newRecipe,
      id,
      rank: newRecipe.levelReq >= 51 ? 'professional' : 'novice',
      isCustom: true
    };
    this.customRecipes.push(recipeObj);
    this.recipes.push(recipeObj);
    this.saveStorage();
    return recipeObj;
  }

  deleteCustomRecipe(id) {
    this.customRecipes = this.customRecipes.filter(r => r.id !== id);
    this.recipes = [...RECIPES_DB, ...this.customRecipes];
    if (this.selectedRecipe && this.selectedRecipe.id === id) {
      this.selectedRecipe = this.recipes[0];
    }
    this.saveStorage();
  }

  exportData() {
    return JSON.stringify({
      customRecipes: this.customRecipes,
      customPrices: this.customPrices,
      brokerFeePercent: this.brokerFeePercent,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.customRecipes) this.customRecipes = data.customRecipes;
      if (data.customPrices) this.customPrices = data.customPrices;
      if (data.brokerFeePercent !== undefined) this.brokerFeePercent = data.brokerFeePercent;
      this.recipes = [...RECIPES_DB, ...this.customRecipes];
      this.saveStorage();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
