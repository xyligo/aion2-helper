/**
 * Aion 2 - Helper Tool Materials Database
 * Contains raw essence extraction materials, intermediate components, fluxes, and market defaults.
 */

export const MATERIALS_DB = {
  // --- RAW ORES & GATHERING (Essence Extraction) ---
  'raw_iron_ore': {
    id: 'raw_iron_ore',
    name: 'Raw Iron Ore',
    category: 'ore',
    tier: 'common',
    basePrice: 120,
    source: 'Essence Extraction (Lv. 1-20 Mining)',
    location: 'Poeta / Ishalgen / Verteron / Altgard',
    icon: '⛏️'
  },
  'raw_titanium_ore': {
    id: 'raw_titanium_ore',
    name: 'Raw Titanium Ore',
    category: 'ore',
    tier: 'superior',
    basePrice: 850,
    source: 'Essence Extraction (Lv. 50-75 Mining)',
    location: 'Heiron / Beluslan / Inggison / Gelkmaros',
    icon: '⛏️'
  },
  'raw_adamantium_ore': {
    id: 'raw_adamantium_ore',
    name: 'Raw Adamantium Ore',
    category: 'ore',
    tier: 'heroic',
    basePrice: 2200,
    source: 'Essence Extraction (Lv. 70-85 Mining)',
    location: 'Balaurea / Silentera Canyon',
    icon: '💎'
  },
  'raw_orichalcum_ore': {
    id: 'raw_orichalcum_ore',
    name: 'Raw Orichalcum Ore',
    category: 'ore',
    tier: 'fabled',
    basePrice: 5800,
    source: 'Essence Extraction (Lv. 85-95 Mining)',
    location: 'Abyss Core / Eye of Tiamaranta',
    icon: '💎'
  },
  'celestial_ore': {
    id: 'celestial_ore',
    name: 'Celestial Ore',
    category: 'ore',
    tier: 'eternal',
    basePrice: 16500,
    source: 'Essence Extraction (Lv. 95+ Mining)',
    location: 'Aether Spires / Mythic Veins',
    icon: '✨'
  },

  // --- AETHER & CRYSTALS ---
  'aether_powder': {
    id: 'aether_powder',
    name: 'Aether Powder',
    category: 'aether',
    tier: 'common',
    basePrice: 250,
    source: 'Aethertapping (Lv. 1-30)',
    location: 'Flight zones in Verteron / Altgard',
    icon: '🌀'
  },
  'aether_crystal': {
    id: 'aether_crystal',
    name: 'Aether Crystal',
    category: 'aether',
    tier: 'superior',
    basePrice: 1200,
    source: 'Aethertapping (Lv. 50-70)',
    location: 'Elten / Morheim Upper Atmosphere',
    icon: '🔹'
  },
  'pure_aether_core': {
    id: 'pure_aether_core',
    name: 'Pure Aether Core',
    category: 'aether',
    tier: 'heroic',
    basePrice: 4500,
    source: 'Aethertapping (Lv. 75-90)',
    location: 'Abyss Reshanta Vortexes',
    icon: '💠'
  },
  'luminous_aether': {
    id: 'luminous_aether',
    name: 'Luminous Aether',
    category: 'aether',
    tier: 'fabled',
    basePrice: 11000,
    source: 'Aethertapping (Lv. 90-95)',
    location: 'Balaurea Sky Fortress',
    icon: '🔮'
  },
  'prismatic_aether_crystal': {
    id: 'prismatic_aether_crystal',
    name: 'Prismatic Aether Crystal',
    category: 'aether',
    tier: 'mythic',
    basePrice: 38000,
    source: 'Mythic Aether Swarms / World Boss Drop',
    location: 'Atreia Upper Stratosphere',
    icon: '🌟'
  },

  // --- HERBS & ORGANIC (Cooking / Alchemy) ---
  'fresh_aria_herb': {
    id: 'fresh_aria_herb',
    name: 'Fresh Aria Herb',
    category: 'herb',
    tier: 'common',
    basePrice: 80,
    source: 'Essence Extraction (Lv. 1-20 Foraging)',
    location: 'Poeta / Ishalgen Riverbanks',
    icon: '🌿'
  },
  'mountain_herb': {
    id: 'mountain_herb',
    name: 'Mountain Herb',
    category: 'herb',
    tier: 'superior',
    basePrice: 400,
    source: 'Essence Extraction (Lv. 35-50 Foraging)',
    location: 'Eltnen Cliffs / Morheim Slopes',
    icon: '🌱'
  },
  'lumiels_tear_herb': {
    id: 'lumiels_tear_herb',
    name: 'Lumiel\'s Tear Herb',
    category: 'herb',
    tier: 'heroic',
    basePrice: 1800,
    source: 'Essence Extraction (Lv. 70-85 Foraging)',
    location: 'Heiron Mystic Groves / Beluslan Tundra',
    icon: '🌸'
  },
  'dragon_flower': {
    id: 'dragon_flower',
    name: 'Dragon Flower',
    category: 'herb',
    tier: 'fabled',
    basePrice: 4800,
    source: 'Essence Extraction (Lv. 85+ Foraging)',
    location: 'Balaurea Volcanic Basins',
    icon: '🌺'
  },
  'tears_of_atreia': {
    id: 'tears_of_atreia',
    name: 'Tears of Atreia',
    category: 'herb',
    tier: 'mythic',
    basePrice: 28000,
    source: 'Essence Extraction (Rare Celestial Node)',
    location: 'Aether Spire Glades',
    icon: '💧'
  },

  // --- BALAUR & MONSTER DROPS ---
  'balaur_scale': {
    id: 'balaur_scale',
    name: 'Balaur Scale',
    category: 'drop',
    tier: 'superior',
    basePrice: 900,
    source: 'Dungeon / Balaur Mob Loot',
    location: 'Draupnir Cave / Fire Temple / Abyss',
    icon: '🐉'
  },
  'balaur_sinew': {
    id: 'balaur_sinew',
    name: 'Balaur Sinew',
    category: 'drop',
    tier: 'heroic',
    basePrice: 2400,
    source: 'Elite Balaur Infiltrators',
    location: 'Dark Poeta / Beshmundir Temple',
    icon: '🧵'
  },
  'dragon_blood_flux': {
    id: 'dragon_blood_flux',
    name: 'Dragon Blood Flux',
    category: 'drop',
    tier: 'fabled',
    basePrice: 6500,
    source: 'Balaur Raid Bosses / Fortresses',
    location: 'Balaurea Siege Fortresses',
    icon: '🩸'
  },
  'ancient_dragon_heart': {
    id: 'ancient_dragon_heart',
    name: 'Ancient Dragon Heart',
    category: 'drop',
    tier: 'mythic',
    basePrice: 45000,
    source: 'World Bosses / Dragon Sovereign Lair',
    location: 'Tiamaranta Eye World Raid',
    icon: '❤️‍🔥'
  },

  // --- REFINED INTERMEDIATE COMPONENTS ---
  'iron_ingot': {
    id: 'iron_ingot',
    name: 'Iron Ingot',
    category: 'refined',
    tier: 'common',
    basePrice: 450,
    isCrafted: true,
    recipe: {
      profession: 'blacksmithing',
      materials: [
        { id: 'raw_iron_ore', count: 3 },
        { id: 'charcoal_flux', count: 1 }
      ]
    },
    icon: '🧱'
  },
  'titanium_ingot': {
    id: 'titanium_ingot',
    name: 'Titanium Ingot',
    category: 'refined',
    tier: 'superior',
    basePrice: 3200,
    isCrafted: true,
    recipe: {
      profession: 'blacksmithing',
      materials: [
        { id: 'raw_titanium_ore', count: 3 },
        { id: 'medium_flux', count: 1 },
        { id: 'aether_powder', count: 1 }
      ]
    },
    icon: '🧱'
  },
  'adamantium_ingot': {
    id: 'adamantium_ingot',
    name: 'Adamantium Ingot',
    category: 'refined',
    tier: 'heroic',
    basePrice: 8500,
    isCrafted: true,
    recipe: {
      profession: 'blacksmithing',
      materials: [
        { id: 'raw_adamantium_ore', count: 3 },
        { id: 'greater_flux', count: 1 },
        { id: 'aether_crystal', count: 2 }
      ]
    },
    icon: '🧱'
  },
  'purified_orichalcum_ingot': {
    id: 'purified_orichalcum_ingot',
    name: 'Purified Orichalcum Ingot',
    category: 'refined',
    tier: 'fabled',
    basePrice: 22000,
    isCrafted: true,
    recipe: {
      profession: 'blacksmithing',
      materials: [
        { id: 'raw_orichalcum_ore', count: 3 },
        { id: 'radiant_flux', count: 1 },
        { id: 'pure_aether_core', count: 2 }
      ]
    },
    icon: '🧱'
  },
  'celestial_ingot': {
    id: 'celestial_ingot',
    name: 'Celestial Ingot',
    category: 'refined',
    tier: 'mythic',
    basePrice: 65000,
    isCrafted: true,
    recipe: {
      profession: 'blacksmithing',
      materials: [
        { id: 'celestial_ore', count: 3 },
        { id: 'master_flux', count: 1 },
        { id: 'prismatic_aether_crystal', count: 1 }
      ]
    },
    icon: '🧱'
  },

  // --- VENDOR FLUXES & REAGENTS (NPC Merchant items) ---
  'charcoal_flux': {
    id: 'charcoal_flux',
    name: 'Charcoal Flux',
    category: 'vendor',
    tier: 'common',
    basePrice: 60,
    source: 'Crafting Merchant NPC',
    location: 'All Capital Cities',
    icon: '🧪'
  },
  'medium_flux': {
    id: 'medium_flux',
    name: 'Medium Weapon/Armor Flux',
    category: 'vendor',
    tier: 'superior',
    basePrice: 420,
    source: 'Crafting Merchant NPC',
    location: 'Sanctum / Pandaemonium',
    icon: '🧪'
  },
  'greater_flux': {
    id: 'greater_flux',
    name: 'Greater Weapon/Armor Flux',
    category: 'vendor',
    tier: 'heroic',
    basePrice: 1500,
    source: 'Crafting Merchant NPC / Mob Drop',
    location: 'Balaurea Outposts',
    icon: '🧪'
  },
  'radiant_flux': {
    id: 'radiant_flux',
    name: 'Radiant Celestial Flux',
    category: 'vendor',
    tier: 'fabled',
    basePrice: 4800,
    source: 'Advanced Crafting Merchant',
    location: 'Kaisinel / Marchutan Temples',
    icon: '🧪'
  },
  'master_flux': {
    id: 'master_flux',
    name: 'Master Crafting Flux',
    category: 'vendor',
    tier: 'mythic',
    basePrice: 12000,
    source: 'Master Crafting Guild Vendor',
    location: 'Central Aion Spires',
    icon: '🧪'
  },
  'spring_water': {
    id: 'spring_water',
    name: 'Purified Spring Water',
    category: 'vendor',
    tier: 'common',
    basePrice: 30,
    source: 'Alchemy / Cooking Merchant',
    location: 'All Cities',
    icon: '🍶'
  },
  'elemental_solvent': {
    id: 'elemental_solvent',
    name: 'Elemental Solvent',
    category: 'vendor',
    tier: 'superior',
    basePrice: 350,
    source: 'Alchemy Vendor',
    location: 'Sanctum / Pandaemonium',
    icon: '🧪'
  },
  'cooking_salt': {
    id: 'cooking_salt',
    name: 'Fine Cooking Salt',
    category: 'vendor',
    tier: 'common',
    basePrice: 20,
    source: 'Cooking Vendor',
    location: 'All Cities',
    icon: '🧂'
  },
  'pure_olive_oil': {
    id: 'pure_olive_oil',
    name: 'Pure Olive Oil',
    category: 'vendor',
    tier: 'superior',
    basePrice: 280,
    source: 'Cooking Vendor',
    location: 'Sanctum / Pandaemonium',
    icon: '🫒'
  }
};
