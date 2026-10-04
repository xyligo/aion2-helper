/**
 * Aion 2 - Helper Tool Recipes Database
 * High-precision recipe data for all 5 crafting professions:
 * - Blacksmithing (Weapons & Tools)
 * - Armorsmithing (Plate, Chain, Shields)
 * - Handicrafting (Accessories, Bows, Staves)
 * - Alchemy (Potions, Scrolls, Magic Orbs)
 * - Cooking (Buff Foods & Drinks)
 */

export const RECIPES_DB = [
  // ==========================================
  // BLACKSMITHING (Weapons)
  // ==========================================
  {
    id: 'bs_radiant_guardian_greatsword',
    name: 'Greatsword of the Radiant Guardian',
    profession: 'blacksmithing',
    category: 'greatsword',
    levelReq: 85,
    rank: 'professional', // 'novice' (1-50) | 'professional' (51-100)
    tier: 'eternal', // common, superior, heroic, fabled, eternal, mythic
    icon: '⚔️',
    description: 'A colossal blade forged from purified orichalcum and infused with pure aether core. Grants immense physical critical strike and attack speed.',
    baseSellPrice: 850000,
    baseProcChance: 0.28,
    procItem: {
      name: 'Noble Greatsword of the Radiant Guardian',
      tier: 'eternal',
      baseSellPrice: 1650000,
      stats: 'Atk 480-520, Phys Crit +95, Atk Speed +19%, PvP Damage +8.5%'
    },
    materials: [
      { id: 'purified_orichalcum_ingot', count: 12 },
      { id: 'pure_aether_core', count: 8 },
      { id: 'dragon_blood_flux', count: 6 },
      { id: 'radiant_flux', count: 10 }
    ],
    pitySupplyTokens: 15
  },
  {
    id: 'bs_master_aetheric_warhammer',
    name: 'Master\'s Aetheric Warhammer',
    profession: 'blacksmithing',
    category: 'mace',
    levelReq: 100,
    rank: 'professional',
    tier: 'mythic',
    icon: '🔨',
    description: 'Peak craftsmanship weapon resonating with raw Atreian aether. Exceptional magic boost and physical attack for Clerics and Chanters.',
    baseSellPrice: 2400000,
    baseProcChance: 0.22,
    procItem: {
      name: 'Shining Master\'s Celestial Warhammer',
      tier: 'mythic',
      baseSellPrice: 5200000,
      stats: 'Atk 360-410, Magic Boost +340, Cast Speed +12%, Healing Boost +85'
    },
    materials: [
      { id: 'celestial_ingot', count: 14 },
      { id: 'prismatic_aether_crystal', count: 6 },
      { id: 'ancient_dragon_heart', count: 2 },
      { id: 'master_flux', count: 12 }
    ],
    pitySupplyTokens: 25
  },
  {
    id: 'bs_noble_aetherforged_polearm',
    name: 'Aetherforged Polearm',
    profession: 'blacksmithing',
    category: 'polearm',
    levelReq: 75,
    rank: 'professional',
    tier: 'fabled',
    icon: '🔱',
    description: 'A sweeping halberd favored by Gladiators seeking devastating burst and extended strike reach.',
    baseSellPrice: 380000,
    baseProcChance: 0.32,
    procItem: {
      name: 'Noble Aetherforged Polearm',
      tier: 'fabled',
      baseSellPrice: 780000,
      stats: 'Atk 410-530, Phys Crit +78, Accuracy +115, Knockdown Rate +12%'
    },
    materials: [
      { id: 'titanium_ingot', count: 15 },
      { id: 'aether_crystal', count: 12 },
      { id: 'greater_flux', count: 8 },
      { id: 'balaur_sinew', count: 4 }
    ],
    pitySupplyTokens: 10
  },
  {
    id: 'bs_dragonscale_dagger',
    name: 'Dragonscale Dagger',
    profession: 'blacksmithing',
    category: 'dagger',
    levelReq: 65,
    rank: 'professional',
    tier: 'heroic',
    icon: '🗡️',
    description: 'Lightweight assassin blade honed with hardened Balaur scales for lethal critical strikes.',
    baseSellPrice: 195000,
    baseProcChance: 0.35,
    procItem: {
      name: 'Noble Dragonscale Dagger',
      tier: 'heroic',
      baseSellPrice: 390000,
      stats: 'Atk 185-215, Phys Crit +120, Atk Speed +16%'
    },
    materials: [
      { id: 'adamantium_ingot', count: 8 },
      { id: 'balaur_scale', count: 12 },
      { id: 'greater_flux', count: 5 }
    ],
    pitySupplyTokens: 8
  },
  {
    id: 'bs_iron_greatsword',
    name: 'Tempered Iron Greatsword',
    profession: 'blacksmithing',
    category: 'greatsword',
    levelReq: 25,
    rank: 'novice',
    tier: 'superior',
    icon: '⚔️',
    description: 'A solid practice two-handed sword crafted from double-smelted iron.',
    baseSellPrice: 18000,
    baseProcChance: 0.40,
    procItem: {
      name: 'Shining Tempered Greatsword',
      tier: 'superior',
      baseSellPrice: 38000,
      stats: 'Atk 180-220, Phys Crit +35, Accuracy +45'
    },
    materials: [
      { id: 'iron_ingot', count: 10 },
      { id: 'charcoal_flux', count: 8 }
    ],
    pitySupplyTokens: 3
  },
  {
    id: 'bs_novice_broadsword',
    name: 'Novice Broadsword',
    profession: 'blacksmithing',
    category: 'sword',
    levelReq: 10,
    rank: 'novice',
    tier: 'common',
    icon: '🗡️',
    description: 'Basic standard-issue sword used by training Daevas.',
    baseSellPrice: 4200,
    baseProcChance: 0.45,
    procItem: {
      name: 'Polished Novice Broadsword',
      tier: 'common',
      baseSellPrice: 8500,
      stats: 'Atk 75-95, Accuracy +20'
    },
    materials: [
      { id: 'raw_iron_ore', count: 8 },
      { id: 'charcoal_flux', count: 4 }
    ],
    pitySupplyTokens: 1
  },

  // ==========================================
  // ARMORSMITHING (Plate, Chain, Shields)
  // ==========================================
  {
    id: 'as_celestial_aegis_cuirass',
    name: 'Celestial Aegis Plate Cuirass',
    profession: 'armorsmithing',
    category: 'plate_chest',
    levelReq: 90,
    rank: 'professional',
    tier: 'eternal',
    icon: '🛡️',
    description: 'Masterwork heavy armor bathed in holy light. Unyielding protection against physical and magical onslaughts.',
    baseSellPrice: 920000,
    baseProcChance: 0.26,
    procItem: {
      name: 'Noble Celestial Aegis Plate Cuirass',
      tier: 'eternal',
      baseSellPrice: 1900000,
      stats: 'Phys Def +740, Magic Resist +245, Max HP +1800, Strike Resist +85'
    },
    materials: [
      { id: 'purified_orichalcum_ingot', count: 15 },
      { id: 'pure_aether_core', count: 10 },
      { id: 'radiant_flux', count: 12 },
      { id: 'dragon_blood_flux', count: 4 }
    ],
    pitySupplyTokens: 18
  },
  {
    id: 'as_archon_divine_breastplate',
    name: 'Divine Breastplate of the Empyrean',
    profession: 'armorsmithing',
    category: 'plate_chest',
    levelReq: 100,
    rank: 'professional',
    tier: 'mythic',
    icon: '🛡️',
    description: 'The pinnacle of defensive craftsmanship. Imbued with dragon lord essences and celestial metallurgy.',
    baseSellPrice: 2800000,
    baseProcChance: 0.20,
    procItem: {
      name: 'Empyrean Lord\'s Sanctuary Breastplate',
      tier: 'mythic',
      baseSellPrice: 6200000,
      stats: 'Phys Def +980, Magic Resist +320, Max HP +2600, Damage Reduction +7.5%'
    },
    materials: [
      { id: 'celestial_ingot', count: 16 },
      { id: 'prismatic_aether_crystal', count: 8 },
      { id: 'ancient_dragon_heart', count: 2 },
      { id: 'master_flux', count: 15 }
    ],
    pitySupplyTokens: 30
  },
  {
    id: 'as_noble_balaur_hauberk',
    name: 'Balaur Chain Hauberk',
    profession: 'armorsmithing',
    category: 'chain_chest',
    levelReq: 75,
    rank: 'professional',
    tier: 'fabled',
    icon: '🎽',
    description: 'Interwoven dragon scales and aether-linked chainmail tailored for battle clerics.',
    baseSellPrice: 420000,
    baseProcChance: 0.30,
    procItem: {
      name: 'Noble Balaur Chain Hauberk',
      tier: 'fabled',
      baseSellPrice: 850000,
      stats: 'Phys Def +520, Magic Boost +140, Max HP +1200, Concentration +65'
    },
    materials: [
      { id: 'titanium_ingot', count: 14 },
      { id: 'balaur_scale', count: 18 },
      { id: 'greater_flux', count: 9 },
      { id: 'aether_crystal', count: 8 }
    ],
    pitySupplyTokens: 12
  },
  {
    id: 'as_adamantium_greaves',
    name: 'Adamantium Plate Greaves',
    profession: 'armorsmithing',
    category: 'plate_legs',
    levelReq: 60,
    rank: 'professional',
    tier: 'heroic',
    icon: '🦵',
    description: 'Reinforced leg guards forged from high-density Adamantium.',
    baseSellPrice: 175000,
    baseProcChance: 0.35,
    procItem: {
      name: 'Noble Adamantium Plate Greaves',
      tier: 'heroic',
      baseSellPrice: 340000,
      stats: 'Phys Def +390, Phys Crit Resist +45, Max HP +680'
    },
    materials: [
      { id: 'adamantium_ingot', count: 9 },
      { id: 'greater_flux', count: 6 },
      { id: 'aether_powder', count: 10 }
    ],
    pitySupplyTokens: 6
  },
  {
    id: 'as_novice_chain_tunic',
    name: 'Novice Chain Tunic',
    profession: 'armorsmithing',
    category: 'chain_chest',
    levelReq: 10,
    rank: 'novice',
    tier: 'common',
    icon: '👕',
    description: 'Basic beginner chainmail vest for aspiring Priests.',
    baseSellPrice: 3800,
    baseProcChance: 0.45,
    procItem: {
      name: 'Reinforced Novice Chain Tunic',
      tier: 'common',
      baseSellPrice: 7500,
      stats: 'Phys Def +85, Max HP +120'
    },
    materials: [
      { id: 'iron_ingot', count: 4 },
      { id: 'charcoal_flux', count: 3 }
    ],
    pitySupplyTokens: 1
  },

  // ==========================================
  // HANDICRAFTING (Accessories, Bows, Staves)
  // ==========================================
  {
    id: 'hc_ring_aether_archon',
    name: 'Ring of the Aether Archon',
    profession: 'handicrafting',
    category: 'ring',
    levelReq: 95,
    rank: 'professional',
    tier: 'eternal',
    icon: '💍',
    description: 'A flawless radiant band set with condensed aether crystals. Essential for top-tier PvP and PvE DPS.',
    baseSellPrice: 750000,
    baseProcChance: 0.25,
    procItem: {
      name: 'Noble Ring of the Aether Archon',
      tier: 'eternal',
      baseSellPrice: 1700000,
      stats: 'Phys Crit +85, Magic Boost +110, Atk +24, PvP Atk +4.2%'
    },
    materials: [
      { id: 'purified_orichalcum_ingot', count: 8 },
      { id: 'pure_aether_core', count: 12 },
      { id: 'radiant_flux', count: 8 },
      { id: 'dragon_blood_flux', count: 4 }
    ],
    pitySupplyTokens: 16
  },
  {
    id: 'hc_whispering_wind_bow',
    name: 'Whispering Wind Bow',
    profession: 'handicrafting',
    category: 'bow',
    levelReq: 75,
    rank: 'professional',
    tier: 'fabled',
    icon: '🏹',
    description: 'Carved from ancient Treant boughs and wound with Balaur sinew. Unrivaled long-range velocity.',
    baseSellPrice: 390000,
    baseProcChance: 0.30,
    procItem: {
      name: 'Noble Whispering Wind Bow',
      tier: 'fabled',
      baseSellPrice: 820000,
      stats: 'Atk 290-395, Phys Crit +110, Atk Speed +19%, Accuracy +140'
    },
    materials: [
      { id: 'titanium_ingot', count: 10 },
      { id: 'balaur_sinew', count: 8 },
      { id: 'greater_flux', count: 7 },
      { id: 'aether_crystal', count: 10 }
    ],
    pitySupplyTokens: 11
  },
  {
    id: 'hc_sovereign_celestial_crown',
    name: 'Sovereign Celestial Crown',
    profession: 'handicrafting',
    category: 'headgear',
    levelReq: 100,
    rank: 'professional',
    tier: 'mythic',
    icon: '👑',
    description: 'The crowning glory of imperial jewelry, channeling the full radiance of the celestial firmament.',
    baseSellPrice: 2600000,
    baseProcChance: 0.20,
    procItem: {
      name: 'Empress\'s Crown of Radiance',
      tier: 'mythic',
      baseSellPrice: 5800000,
      stats: 'Magic Supp +180, Strike Fortitude +90, Max HP +1500, All Stats +18'
    },
    materials: [
      { id: 'celestial_ingot', count: 12 },
      { id: 'prismatic_aether_crystal', count: 10 },
      { id: 'ancient_dragon_heart', count: 2 },
      { id: 'master_flux', count: 14 }
    ],
    pitySupplyTokens: 28
  },
  {
    id: 'hc_novice_topaz_ring',
    name: 'Novice Topaz Ring',
    profession: 'handicrafting',
    category: 'ring',
    levelReq: 20,
    rank: 'novice',
    tier: 'superior',
    icon: '💍',
    description: 'A modest copper band inset with polished topaz.',
    baseSellPrice: 12000,
    baseProcChance: 0.42,
    procItem: {
      name: 'Shining Topaz Ring',
      tier: 'superior',
      baseSellPrice: 26000,
      stats: 'Phys Crit +15, Max HP +80'
    },
    materials: [
      { id: 'iron_ingot', count: 3 },
      { id: 'charcoal_flux', count: 4 },
      { id: 'aether_powder', count: 4 }
    ],
    pitySupplyTokens: 2
  },

  // ==========================================
  // ALCHEMY (Potions, Scrolls, Serums)
  // ==========================================
  {
    id: 'alc_greater_elixir_life',
    name: 'Greater Elixir of Life & Mana (x10)',
    profession: 'alchemy',
    category: 'potion',
    levelReq: 80,
    rank: 'professional',
    tier: 'heroic',
    icon: '🧪',
    description: 'Instantly restores 4,500 HP and 3,800 MP. Crucial for end-game raid encounters and PvP sieges.',
    baseSellPrice: 65000,
    baseProcChance: 0.35,
    procItem: {
      name: 'Radiant Elixir of Life & Mana (x15)',
      tier: 'fabled',
      baseSellPrice: 135000,
      stats: 'Instantly restores 6,200 HP and 5,000 MP + 10% instant shield'
    },
    materials: [
      { id: 'lumiels_tear_herb', count: 12 },
      { id: 'pure_aether_core', count: 3 },
      { id: 'elemental_solvent', count: 6 },
      { id: 'spring_water', count: 10 }
    ],
    pitySupplyTokens: 4
  },
  {
    id: 'alc_scroll_supreme_awakening',
    name: 'Scroll of Supreme Awakening (x20)',
    profession: 'alchemy',
    category: 'scroll',
    levelReq: 85,
    rank: 'professional',
    tier: 'fabled',
    icon: '📜',
    description: 'Increases Casting Speed by 15% and Magic Boost by +90 for 15 minutes. Must-have for Sorcerers.',
    baseSellPrice: 95000,
    baseProcChance: 0.30,
    procItem: {
      name: 'Scroll of Pure Supreme Awakening (x30)',
      tier: 'fabled',
      baseSellPrice: 210000,
      stats: 'Increases Casting Speed by 18% and Magic Boost by +125 for 20m'
    },
    materials: [
      { id: 'dragon_flower', count: 14 },
      { id: 'luminous_aether', count: 4 },
      { id: 'elemental_solvent', count: 8 },
      { id: 'spring_water', count: 12 }
    ],
    pitySupplyTokens: 5
  },
  {
    id: 'alc_draught_celestial_avatar',
    name: 'Draught of the Celestial Avatar (x5)',
    profession: 'alchemy',
    category: 'potion',
    levelReq: 100,
    rank: 'professional',
    tier: 'mythic',
    icon: '✨',
    description: 'A mythic draught brewed with Tears of Atreia. Grants 30% damage absorption shield and rapid DP generation.',
    baseSellPrice: 480000,
    baseProcChance: 0.25,
    procItem: {
      name: 'Draught of the Empyrean Sovereign (x8)',
      tier: 'mythic',
      baseSellPrice: 1100000,
      stats: 'Absorbs 8,000 damage + grants 2,000 DP instantly'
    },
    materials: [
      { id: 'tears_of_atreia', count: 8 },
      { id: 'prismatic_aether_crystal', count: 3 },
      { id: 'master_flux', count: 4 },
      { id: 'elemental_solvent', count: 12 }
    ],
    pitySupplyTokens: 12
  },
  {
    id: 'alc_novice_healing_potion',
    name: 'Novice Healing Potion (x5)',
    profession: 'alchemy',
    category: 'potion',
    levelReq: 15,
    rank: 'novice',
    tier: 'common',
    icon: '🧪',
    description: 'Basic restorative brew recovering 450 HP over 6 seconds.',
    baseSellPrice: 2200,
    baseProcChance: 0.45,
    procItem: {
      name: 'Potent Novice Healing Potion (x8)',
      tier: 'common',
      baseSellPrice: 4800,
      stats: 'Restores 750 HP over 6s'
    },
    materials: [
      { id: 'fresh_aria_herb', count: 6 },
      { id: 'spring_water', count: 5 }
    ],
    pitySupplyTokens: 1
  },

  // ==========================================
  // COOKING (Buff Foods & Drinks)
  // ==========================================
  {
    id: 'ck_roast_dragon_tenderloin',
    name: 'Roast Dragon Tenderloin with Truffles (x10)',
    profession: 'cooking',
    category: 'food',
    levelReq: 90,
    rank: 'professional',
    tier: 'eternal',
    icon: '🥩',
    description: 'Exquisite culinary feast roasted over aether flame. Buff: +80 Phys Crit, +120 Attack & Magic Boost, +1500 HP for 60 min.',
    baseSellPrice: 320000,
    baseProcChance: 0.28,
    procItem: {
      name: 'Celestial Dragon Tenderloin Platter (x15)',
      tier: 'eternal',
      baseSellPrice: 680000,
      stats: '+105 Phys Crit, +150 Atk & Magic Boost, +2000 Max HP, +5% Movement Speed for 90 min'
    },
    materials: [
      { id: 'balaur_scale', count: 14 },
      { id: 'dragon_flower', count: 10 },
      { id: 'pure_olive_oil', count: 8 },
      { id: 'cooking_salt', count: 15 }
    ],
    pitySupplyTokens: 8
  },
  {
    id: 'ck_steamed_aether_fish',
    name: 'Steamed Aether Fish with White Herb (x10)',
    profession: 'cooking',
    category: 'food',
    levelReq: 75,
    rank: 'professional',
    tier: 'fabled',
    icon: '🐟',
    description: 'Fragrant steamed fish infused with aerial herbs. Buff: +65 Crit Strike, +90 Accuracy, +45 Flight Speed for 45 min.',
    baseSellPrice: 160000,
    baseProcChance: 0.32,
    procItem: {
      name: 'Crispy Steamed Aether Fish (x15)',
      tier: 'fabled',
      baseSellPrice: 340000,
      stats: '+85 Crit Strike, +120 Accuracy, +60 Flight Speed, +500 HP for 60 min'
    },
    materials: [
      { id: 'lumiels_tear_herb', count: 10 },
      { id: 'aether_crystal', count: 6 },
      { id: 'pure_olive_oil', count: 6 },
      { id: 'cooking_salt', count: 12 }
    ],
    pitySupplyTokens: 6
  },
  {
    id: 'ck_hearty_mandragora_stew',
    name: 'Hearty Mountain Herb Stew (x10)',
    profession: 'cooking',
    category: 'food',
    levelReq: 50,
    rank: 'novice',
    tier: 'superior',
    icon: '🍲',
    description: 'Wholesome thick broth seasoned with mountain greens. Buff: +45 Phys Def, +600 Max HP for 30 min.',
    baseSellPrice: 38000,
    baseProcChance: 0.40,
    procItem: {
      name: 'Savory Mountain Herb Stew (x15)',
      tier: 'superior',
      baseSellPrice: 85000,
      stats: '+60 Phys Def, +900 Max HP, +25 HP Recovery for 45 min'
    },
    materials: [
      { id: 'mountain_herb', count: 12 },
      { id: 'spring_water', count: 8 },
      { id: 'cooking_salt', count: 8 }
    ],
    pitySupplyTokens: 3
  },
  {
    id: 'ck_novice_sweet_bread',
    name: 'Novice Sweet Bread (x10)',
    profession: 'cooking',
    category: 'food',
    levelReq: 10,
    rank: 'novice',
    tier: 'common',
    icon: '🥖',
    description: 'Freshly baked starter bread. Buff: +150 HP and +150 MP for 15 min.',
    baseSellPrice: 2500,
    baseProcChance: 0.45,
    procItem: {
      name: 'Golden Sweet Bread (x15)',
      tier: 'common',
      baseSellPrice: 5500,
      stats: '+250 HP and +250 MP for 20 min'
    },
    materials: [
      { id: 'fresh_aria_herb', count: 4 },
      { id: 'spring_water', count: 4 },
      { id: 'cooking_salt', count: 4 }
    ],
    pitySupplyTokens: 1
  }
];
