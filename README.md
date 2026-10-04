# Aion 2 Helper (Workshop of Atreia) ⚔️✨

A high-performance, visually stunning companion web application designed for **Aion 2** players. Features a comprehensive crafting recipe database, multi-tier Bill of Materials (BOM) calculator with recursive raw essence breakdown, gear enchantment probability simulator with Monte Carlo analysis, manastone socketing, transfer crafting calculator, and live world event timers.

Hosted on GitHub Pages: **[xyligo.github.io/aion2-helper](https://xyligo.github.io/aion2-helper/)**

---

## 🌟 Key Features

### 1. ⚒️ Master Crafting & Multi-Tier BOM Calculator
- **5 Core Professions**: Blacksmithing, Armorsmithing, Handicrafting, Alchemy, and Cooking.
- **Novice (Lv. 1–50) & Professional (Lv. 51–100)** recipe catalog across all item rarities (Common to Mythic).
- **Multi-Tier Bill of Materials (BOM)**:
  - Toggle between **Direct Ingredients** and **Decomposed (Raw Essence)** view to see exact requirements of raw ores, aether crystals, and herbs.
  - Interactive "Have / Need" checklist stored in `localStorage`.
  - Editable unit prices in Kinah with instant recalculated totals.
- **Economic & Broker Profit Analysis**:
  - Live calculations for total production costs, expected market revenue, broker commission tax (0%–20%), and Net Profit / ROI %.
- **Critical Proc Simulator**:
  - Simulates crafting RNG for *Noble*, *Shining*, and *Masterwork* procs with audio chimes.
  - Pity System tracker: Accrues Supply Tokens for exchange.
- **Custom Recipe Builder**: Add and save custom recipes locally, with JSON export and import support.

### 2. ✨ Gear Enchantment & Amplification Simulator
- Realistic Aion 2 probability curve from **+1 to +20**.
- **Visual Equipment Display**: Dynamic animated aura effects (+5 soft glow, +10 electric aura, +15 radiant celestial flare, +20 mythic prismatic corona).
- **Supplements**: Test Lesser (+5%), Regular (+10%), and Greater (+15%) supplement boosts.
- **Threshold Safeguards**: Safety checkpoints at +10 and +15.
- **500-Daeva Monte Carlo Simulator**: Evaluates 500 virtual players to calculate average stones needed, lucky 10% runs, worst-case 90% runs, and required Kinah budget.

### 3. 💎 Manastones & Transfer Crafting
- **6-Slot Socket Board**: Supports Critical Strike, Physical Attack, Magic Boost, Max HP, Accuracy, and Shield Block.
- **Dual Mechanics**: Switch between **Modern Safe Mode** and **Classic Strict Mode** (where failing a socket purges all previous stones).
- **Transfer Crafting Calculator**: Computes amplification retention (+15 gear -> +13/+14 transferred), transfer catalysts, scrolls, and fee.

### 4. ⏱️ World Timers & Gathering Node Tracker
- **Universal Game Clocks**: Live UTC Game Clock, Daily Reset (09:00 UTC), and Weekly Reset (Wednesdays 09:00 UTC).
- **Dimensional Rift Incursions**: Tracks active/dormant status for Elysea ⇄ Asmodae portals.
- **World Raid Boss Schedule**: Tracks Avatar of Tiamat, Stormwing Sovereign, and Rift Overlord Zapiel.
- **Essence Extraction Stopwatches**: Custom respawn timers for rare herb/ore nodes with Web Audio alert sound when ready.

### 5. 🎨 Celestial Faction Theming & Sound
- **3 Dynamic Themes**:
  - **Aether Void**: Glowing cyan, celestial spires, midnight obsidian.
  - **Elyos**: Radiant amber, sunlit gold, angelic ivory.
  - **Asmodian**: Twilight violet, shadow crimson, abyss slate.
- **Synthesized Web Audio Effects**: Pleasant celestial chimes for procs, button clicks, enchantment fanfares, and timer alerts (with toggle).

---

## 🚀 How to Enable GitHub Pages (1-Click Deployment)

This repository is 100% client-side and requires **no build step**:
1. Open your repository on GitHub: `https://github.com/xyligo/aion2-helper`.
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Branch**:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**.
5. Your site will be live at `https://xyligo.github.io/aion2-helper/` within ~1 minute!

---

## 🛠️ Local Development & Testing

You can run this project locally without any dependencies:
```bash
# Using Python
python -m http.server 8000

# Or using Node http-server / npx serve
npx serve .
```
Then visit `http://localhost:8000` in your web browser.

---

## 📜 Credits & Disclaimer
Aion and Aion 2 are registered trademarks of NCSoft Corporation. This application is an unofficial, fan-made community resource created for player convenience.
