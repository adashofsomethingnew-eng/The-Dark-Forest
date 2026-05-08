/* ================= GAME STATE ================= */

let step = 0;

const steps = ["profession","ability","race","traits","skills","cybernetics","techniques","weapons","armor","summary"];

const state = {
  traits:{},
  techniques: [],
  skills: {},
  professionSkills: [],
  professionChoice: null,
  mimicProfession: null,
  hostRace: null,
  mtMode: false,
  mtTraitBonus:{},
  abilityUpgrades: [],

  cybernetics: {
    pairLevel: null,
    picks: {},
    skillEchoTargets: {}
  },

  // ✅ ADD THIS
  weapons: {
    melee: null,
    ranged: null,
    thrown: null
  },
  armor: {
    armor: null,
    shield: null,
    cloak: null
  }
};

const rankState = {
  rank: 1
};

const DEFLECT_TIERS = ["1d4","1d6","1d8","1d10","2d4","2d6","2d8","2d10"];


/* ================= ALL GAME DATA ================= */

const data = {
profession: {
  "Agent": {img: "assets/profession/Agent.png", desc: "Operatives advancing faction agendas.", extra: "<strong>Mimic:</strong> Gain the attribute of another profession."},
  "Analyst": {img: "assets/profession/Analyst.png", desc: "Students of the natural world .", extra: "<strong>Finder:</strong> Gain Advantage to find natural resources." },
  "Crafter": { img: "assets/profession/Crafter.png", desc: "A builder, a wonderer, a seeker of fortune, undaunted by hard work.", extra: "<strong>Jury-Rig:</strong> Assemble items from other objects." },
  "Diplomat": { img: "assets/profession/Diplomat.png", desc: "A master of negotiation. Forging alliances, defusing tensions, and making deals through words and influence.", extra: "<strong>Diplomatic Immunity:</strong> Reroll failed manipulation check." },
  "Medic": { img: "assets/profession/Medic.png", desc: "Healers using science and magic.", extra: "<strong>Field Stabilizer:</strong> Stabilize dying ally or remove condition." },
  "Mercenary": { img: "assets/profession/Mercenary.png", desc: "Combat specialists for hire.", extra: "<strong>Professional's Edge:</strong> Reroll failed attack or condition check." },
  "Navigator": { img: "assets/profession/Navigator.png", desc: "A guide through the most hostile and shifting terrain.", extra: "<strong>Internal Compass:</strong> Know direction to previously visited location."},
  "Relic Hunter": {img: "assets/profession/Relic_Hunter.png", desc: "A seeker of lost artifacts and ancient secrets.", extra: "<strong>Seeker:</strong> Advantage to find hidden caches." },
  "Trader": {img: "assets/profession/Trader.png", desc: "Shrewd dealmakers that turn opportunity into profit.", extra: "<strong>Trader's Deal:</strong> Reduce cost of items." },
  "Video Star": { img: "assets/profession/Video_Star.jpeg", desc: "A celebrity who uses fame to entertain and sway the masses.", extra: "<strong>Fan Service:</strong> Reroll failed social check."},
  "Warden": {img: "assets/profession/Warden.jpg", desc: "A steadfast guardian who protects people from the threats of The Dark Forest.", extra: "<strong>Mist Anchor:</strong> Protect area from the mists." },
},

ability: {
  "Blink": { img: "assets/ability/Blink.png", desc: "Teleport short distances." },
  "Blood Warrior": { img: "assets/ability/Blood Warrior.png", desc: "Keep fighting past 0 HP." },
  "Guardian's Rally": { img: "assets/ability/Guardian's Rally.png", desc: "Provide allies with stamina and buffs." },
  "Healing": { img: "assets/ability/Healing.png", desc: "Provide allies with health and buffs." },
  "Iron Guard": { img: "assets/ability/Iron Guard.png", desc: "Create a barrier to protect allies." },
  "Me, Myself, and I": { img: "assets/ability/Me, Myself, and I.png", desc: "Unite mind, body, and Soul. Communicate with animals." },
  "Mist Veil": { img: "assets/ability/Mist Veil.png", desc: "Conjure mists." },
  "Overload": { img: "assets/ability/Overload.png", desc: "Empower your attacks." },
  "Soul Blade": { img: "assets/ability/Soul Blade.png", desc: "Summon a magical blade." },
  "Spectral Hand": { img: "assets/ability/Spectral Hand.png", desc: "Summon a spectral hand to do your bidding." }
},

abilityUpgrades: {
  "Blink": [
    { name: "Extend", desc: "Extend Blink range to 30m. Blink only uses half of your movement." },
    { name: "Plus One", desc: "Bring a willing ally with you when teleporting, potentially leaving them behind when you return." },
    { name: "Rupture", desc: "Release a pulse of shadowy energy upon arrival, dealing 1d6 mental damage to everyone within 5m of your blink location." },
    { name: "Shadow Clone", desc: "Leave a Shadow Clone in your place when you use Blink, distracting your enemies, causing attacks you initiate to be at Advantage until you return to your starting location." },
    { name: "Shadow Dodge", desc: "As an interrupt, instantly avoid an incoming attack by using Blink, returning right after the attack." },
    { name: "Shadow Swap", desc: "Swap places with an ally or enemy within range. Returning both to their original locations at the end of your turn." }
  ],

  "Blood Warrior": [
    { name: "Blood Mobility", desc: "Sacrifice Health to gain a speed boost equal to five times the amount of Health sacrificed. Lasts one round."},
    { name: "Blood Rage", desc: "Sacrifice Health to gain additional damage to your attacks equal to one for every two points of Health sacrificed. Lasts for one round."},
    { name: "Blood Strike", desc: "Sacrifice Health to increase your number of attacks by one for every 5 Health sacrificed. Lasts for one round. " },
    { name: "Last Stand", desc: "During combat, you gain an additional attack this round and up to four Stamina (even if you previously had none) for one last heroic set of actions. After your turn. You fall unconscious; your health is set to 0 and your core vitality is set to max (which may or may not be 10). You may be restored after the combat but not during, and nothing can keep you from dropping to 0 Health or unconsciousness." },
    { name: "Lasting Blood", desc: "Your blood effects last twice as long." },
    { name: "Sweat and Blood", desc: "Sacrifice Health to gain a bonus to a skill equal to one for every two points of Health sacrificed, or to a trait equal to one for every four points of Health sacrificed. Lasts for one scene." }
  ],

  "Guardian's Rally": [
    { name: "Charge", desc: "The targets of your rally ignore challenging terrain, while others treat normal ground as challenging until the end of the round." },
    { name: "Combat", desc: "The targets of your rally gain Advantage on attacks this round." },
    { name: "Echoing Rally", desc: "The rally affects a greater area of 20m and bolsters up to four targets." },
    { name: "Fearless Cry", desc: "Targets gain immunity to fear, charm, and other morale-based effects." },
    { name: "Improved Restore", desc: "Restore 2d4 Stamina to each of your targets." },
    { name: "Lasting Rally", desc: "The rally’s effects last 2 rounds, along with any additional effects granted by upgrades." }
  ],

  "Healing": [
    { name: "Amplify", desc: "Increase the healing from 2d4 to 2d6." },
    { name: "Blood Donor", desc: "While healing a target you can also inflict half of the healed damage onto a target within 10m of you. " },
    { name: "Double the Love", desc: "You may target up to two targets when healing." },
    { name: "Healing Surge", desc: "Bolster all healed allies' vigor, increasing their movement speed by 10m for the round." },
    { name: "Range", desc: "Extend the reach of your healing energy by an additional 10m." },
    { name: "Remove Condition", desc: "Remove all conditions from the healed ally." }
  ],

  "Iron Guard": [
    { name: "Bullrush", desc: "Run half your movement in a straight line, knocking all standing enemies you pass (your size or smaller) to the ground." },
    { name: "Detonate", desc: "As a main action, explode the shield to deal damage equal to half the remaining Health points to up to two targets within 5m of the shield." },
    { name: "Double Wide", desc: "The shield extends to cover an additional ally, as long as they stay within 5m of the original target." },
    { name: "Duration", desc: "The barrier lasts an additional round, gaining 2 x rank additional temporary Health points between rounds." },
    { name: "Shield a Friend", desc: "Target an ally up to 10m away instead of yourself." },
    { name: "Thorns", desc: "Reflect half of incoming damage (before Soak) back at the attacker." }
  ],

  "Me, Myself, and I": [
    { name: "Astral Self", desc: "Become incorporeal for 1 round. Return to corporeality at the start of your next turn. While incorporeal you may move through solid objects or people but will take 4d10 impact damage if you become corporeal while inside a solid object." },
    { name: "Flow State", desc: "Ignore difficult terrain and minor obstacles while moving. " },
    { name: "Inner Light", desc: "Emit a calming light, removing conditions from yourself, and preventing further conditions for the next 2min, rank times per day." },
    { name: "Inner Self", desc: "A copy of yourself lurches out of your body, taking the hit for your main body, completely negating the damage from that one attack. Rank times per day." },
    { name: "Mind over Body", desc: "For every minute that you focus your mind, you gain Advantage in a skill for an hour up to rank x 4 hours. 1/day" },
    { name: "Perfect harmony", desc: "Your body flows with perfect harmony. Ignore attack disadvantages but still retain the benefits of Advantage in for rank rounds. 1/day" }
  ],

  "Mist Veil": [
    { name: "Combat", desc: "As your allies shift in and out of the mist, enemies have Disadvantage on attacks against you and your allies within the mist, even if they are also within the mist." },
    { name: "Duration", desc: "The mist veil lingers twice as long as usual." },
    { name: "Evading Mist", desc: "Allies within the mist gain Advantage on evasion rolls." },
    { name: "Following Mist", desc: "The mist is centered around a target of your choice and can move with that target. The target can be willing or unwilling, living or non-living." },
    { name: "Range", desc: "The veil expands, covering a radius of 20m." },
    { name: "Unhindered Movement", desc: "Slip through barriers or terrain within the mist (up to 5m, such as leaping onto ledges or passing through a portcullis). The mist must be able to pass through the barrier even if you normally can’t." }
  ],

  "Overload": [
    { name: "Empowered Strike", desc: "Targets immune to your damage type are resistant to your attacks instead." },
    { name: "Explosive Retreat", desc: "During a successful attack, propel yourself backward 10m without expending movement." },
    { name: "Knock Back", desc: "Blast enemies hit by your overloaded attacks, back 10m." },
    { name: "Penetration", desc: "Your attacks reduce enemy Soak by 2." },
    { name: "Ranged", desc: "Apply overload to ranged attacks and techniques." },
    { name: "Two is Better Than One", desc: "Channel your power into an ally, empowering their attacks for the round as well as your own." }
  ],

  "Soul Blade": [
    { name: "Empowered Soul Blade", desc: "Increase the Soul Blade’s damage from 1d8 to 2d8." },
    { name: "Indomitable", desc: "Your Soul Blade ignores damage immunities and resistances. Treating them as normal damage instead." },
    { name: "Mobile Soul", desc: "Either before or after an attack with your Soul Blade, you may move up to 5m of your movement without triggering an attack and without needing to move defensively." },
    { name: "Ranged Blade", desc: "Your Soul Blade gains the ranged property (60/120), whether it becomes a thrown blade, a bow, or a gun is up to you. Other upgrades still apply." },
    { name: "Rend Armor", desc: "A target hit by your Soul Blade has their Soak score reduced by 1. Stacks up to rank number of times, may be reset during a rest." },
    { name: "Sunder Will", desc: "A target struck by your soul blade has Disadvantage on their next attack." }
  ],

  "Spectral Hand": [
    { name: "Carry Ally", desc: "As a movement action, carry and reposition willing allies with the spectral hand, regardless of weight." },
    { name: "Grasp", desc: "As a main action, use the spectral hand to paralyze a target (Control Check 10)." },
    { name: "Lasting Hand", desc: "The hand remains for twice as long." },
    { name: "Range", desc: "The hand reaches further across the battlefield, up to 30m away from you." },
    { name: "Shove", desc: "As a movement action, push or pull an unwilling target up to 10m." },
    { name: "Strike", desc: "As a main action, crush or strike with the hand, dealing 2d6 impact damage." }
  ]
},

race: {
  "Anthelid": {
    img: "assets/race/Anthelid.png",
    desc: "An ant-like people devoted to the good of the hive.",
    extra: "<strong>Hivemind:</strong> Communicate telepathically with other Anthelid. <br><strong>Replaceable Drone:</strong> When killed, they can be replaced by the hive."
  },
  "Dirgan": {
    img: "assets/race/Dirgan.png",
    desc: "Ethereal creatures that possess the corpses of other races.",
    extra: "<strong>Possession:</strong> Occupy the corpse of another race, gaining the features of the host body."
  },
  "Fiddlin": {
    img: "assets/race/Fiddlin.png",
    desc: "A small race of four-armed bear-like people.",
    extra: "<strong>Quick Craft:</strong> Crafting time reduced to 1/4."
  },
  "Nuldrathi": {
    img: "assets/race/Nuldrathi.png",
    desc: "Crystal beings born from extremes in temperature.",
    extra: "<strong>Crystal Growth:</strong> A Crystal shield providing temp HP."
  },
  "Solari": {
    img: "assets/race/Solari.png",
    desc: "Uplifted animals of all species.",
    extra: "<p><strong>Nature:</strong> Gain feature based on your animal type.</p> <p> * Feature not calculated in the character Builder."
  },
  "Stitchwork": {
    img: "assets/race/Stitchwork.png",
    desc: "A living construct composed of fabric, metal, or flesh.",
    extra: "<strong>Self Repair:</strong> Heal twice as fast with access to replacement parts. <br><strong>Masquerade:</strong> Advantage on evasion while motionless near trash."
  },
  "Terran": {
    img: "assets/race/Terran.png",
    desc: "Modern humans of Earth.",
    extra: "<strong>Domestication:</strong> Start with the Summon Pack technique."
  }
},

traits:["Endurance","Will","Recall","Wit","Agility","Power","Charisma","Manipulation"],
values:["+3","+2","+1","+1","0","0","-1","-1"],

techniques: {
  pack: [
    { name:"Summon", type:"pack", extra:"Required for summoning pack members", affluence:1, access:1, req:null },
    { name:"Mount", type:"pack", extra:"Ride your pack members", affluence:1, access:1, req:null },
    { name:"Toughness", type:"pack", extra:"Pack members take an additional hit before fading", affluence:1, access:2, req:{ Fortitude:0 } },
    { name:"Swim", type:"pack", extra:"Pack can swim and breathe underwater", affluence:2, access:1, req:null },
    { name:"Quick Resummon", type:"pack", extra:"Resummon two pack members per day", affluence:2, access:1, req:{ Leadership:0 } },
    { name:"Burrow", type:"pack", extra:"Pack can dig through dirt and loose stone", affluence:2, access:2, req:null },
    { name:"Flight", type:"pack", extra:"Pack can fly", affluence:3, access:3, req:null },
    { name:"Blink", type:"pack", extra:"Pack can teleport short distances", affluence:4, access:5, req:null }
  ],

  physical: [
    { name:"Rapid Assault", type:"physical", extra:"Two attacks, second at disadvantage", affluence:1, access:1, req:{ Reflexes:0 } },
    { name:"Retaliatory Strike", type:"physical", extra:"Attack a target that just hit you", affluence:1, access:1, req:{ Agility:0 } },
    { name:"Precision Strike", type:"physical", extra:"Gain advantage on a single attack", affluence:1, access:2, req:{ Perception:0 } },
    { name:"Focused Barrage", type:"physical", extra:"Each hit increases damage (+1, +2, +3...)", affluence:2, access:1, req:{ Physicality:0 } },
    { name:"Bleeding Strike", type:"physical", extra:"Inflict bleeding on target", affluence:2, access:2, req:null },
    { name:"Reckless Attack", type:"physical", extra:"Take damage risk for double damage next attack", affluence:2, access:2, req:{ Power:1 } },

    { name:"Bolster Ally", type:"support", extra:"+2 Dodge to ally for scene (once per scene)", affluence:1, access:1, req:{ Leadership:0 } },
    { name:"Guiding Strike", type:"support", extra:"Give ally an extra action", affluence:1, access:1, req:{ Leadership:0 } },
    { name:"Crippling Attack", type:"support", extra:"Anchor target on hit (First Aid 10 to remove)", affluence:1, access:2, req:{ FirstAidSkill:1 } },
    { name:"Restore Vitality", type:"support", extra:"Heal 2x First Aid Skill HP", affluence:2, access:1, req:{ FirstAidSkill:0 } },
    { name:"Flanking Maneuver", type:"support", extra:"Allies gain advantage vs target while adjacent", affluence:2, access:2, req:{ PhysicalIntimidation:1 } },
    { name:"Feign Attack", type:"support", extra:"Give ally advantage vs target for round", affluence:2, access:3, req:{ Manipulation:1 } },

    { name:"Taunting Roar", type:"tank", extra:"Up to 5 targets attack you while maintained", affluence:1, access:1, req:{ Power:0 } },
    { name:"Enduring Guard", type:"tank", extra:"Reduce ally damage by half for one round", affluence:1, access:1, req:{ Reflexes:1 } },
    { name:"Unyielding Stance", type:"tank", extra:"Cannot be moved or knocked down for scene", affluence:1, access:2, req:{ Endurance:1 } },
    { name:"Taking the Hit", type:"tank", extra:"Absorb damage for ally as interrupt", affluence:2, access:1, req:{ Will:1 } },
    { name:"Overwatch Stance", type:"tank", extra:"Attack interrupt when enemy moves through zone", affluence:2, access:2, req:{ Physicality:1 } },
    { name:"Feign Retreat", type:"tank", extra:"Force up to 2 targets to follow you", affluence:2, access:3, req:{ Manipulation:1 } }
  ],

  magical: [
    { name:"Aero", type:"magical", extra:"No damage, displacement by 2x damage value", affluence:1, access:0, req:null },
    { name:"Terra", type:"magical", extra:"Impact", affluence:1, access:0, req:null },
    { name:"Lumino", type:"magical", extra:"Blind instead of damage", affluence:1, access:1, req:null },
    { name:"Hydro", type:"magical", extra:"Impact", affluence:2, access:1, req:null },
    { name:"Bio", type:"magical", extra:"Corrosive", affluence:2, access:2, req:null },
    { name:"Cryo", type:"magical", extra:"Thermal", affluence:3, access:1, req:null },
    { name:"Pyro", type:"magical", extra:"Thermal", affluence:3, access:2, req:null },
    { name:"Electro", type:"magical", extra:"Electrical", affluence:4, access:2, req:null },
    { name:"Psycho", type:"magical", extra:"Mental", affluence:5, access:5, req:null },
    { name:"-strike", type:"magical", extra:"Quick precise attack", affluence:1, access:1, req:null },
    { name:"-wave", type:"magical", extra:"10m wave up to 30m", affluence:2, access:3, req:null },
    { name:"-nova", type:"magical", extra:"Radial burst", affluence:3, access:1, req:null },
    { name:"-blast", type:"magical", extra:"Focused attack", affluence:3, access:3, req:null },
    { name:"-pulse", type:"magical", extra:"Recurring pulse damage", affluence:4, access:2, req:null },
    { name:"Beam", type:"magical", extra:"Continuous stream", affluence:4, access:2, req:null }
  ]
},
professionSkills: {
  "Agent": {
    fixed: ["Alchemy","Evasion"],
    choice: ["Hacking","Lockpicking"]
  },
  "Analyst": {
    fixed: ["Survival","Ecology"],
    choice: "knowledge"
  },
  "Crafter": {
    fixed: ["Harvesting","Survival"],
    choice: "crafting"
  },
  "Diplomat": {
    fixed: ["Diplomacy","Other World Studies"],
    choice: ["Performance","Dark Forest Studies"]
  },
  "Medic": {
    fixed: ["First Aid","Biology"],
    choice: ["First Aid","Survival"]
  },
  "Mercenary": {
    fixed: ["Driving","Survival"],
    choice: ["First Aid","Lockpicking"]
  },
  "Navigator": {
    fixed: ["Survival","Dark Forest Studies"],
    choice: ["Driving","Sailing","Piloting"]
  },
  "Relic Hunter": {
    fixed: ["Lockpicking","Survival"],
    choice: ["Other World Studies","Dark Forest Studies"]
  },
  "Trader": {
    fixed: ["Diplomacy","Other World Studies"],
    choice: ["Animal Training","Driving"]
  },
  "Video Star": {
    fixed: ["Performance","Diplomacy"],
    choice: ["Carpentry","Jeweler","Textiles and Fabrics"]
  },
  "Warden": {
    fixed: ["Dark Forest Studies","Evasion"],
    choice: ["Ecology","Survival"]
  }
},
skills: {
  applied: [
    "Animal Training","Driving","Evasion","First Aid","Hacking",
    "Lockpicking","Harvesting","Performance","Piloting","Sailing","Survival"
  ],
  knowledge: [
    "Advanced Magic","Advanced Technology","Biology","Chemistry",
    "Dark Forest Studies","Diplomacy","Ecology","Physics","Other World Studies"
  ],
  crafting: [
    "Alchemy","Brewing","Carpentry","Cybernetics","Electronics",
    "Enchanting","Jeweler","Mechanic","Smithing","Stonemasonry","Textiles and Fabrics"
  ]
},
  // ================= WEAPONS =================
  weapons: {
    melee: [
      { name:"Improvised", attack:-1, damage:"1 + Power (Impact)", properties:"", req:null, affluence:0, access:1 },
      { name:"Combat Knife", attack:-1, damage:"1d4 + Power (Impact)", properties:"Can be thrown (10/30)", req:null, affluence:1, access:1 },
      { name:"Parry Dagger", attack:0, damage:"NA", properties:"Deflection Dice +1 tier", req:null, affluence:1, access:1 },
      { name:"Club", attack:0, damage:"1 + Power (Impact)", properties:"", req:null, affluence:1, access:1 },
      { name:"Retractable Blade", attack:-1, damage:"1d4 + Power (Impact)", properties:"High concealment", req:null, affluence:1, access:2 },
      { name:"Sword", attack:0, damage:"1d6 + Power (Impact)", properties:"", req:null, affluence:2, access:1 },
      { name:"Stun Baton", attack:-1, damage:"1d6 (Electrical)", properties:"(Stun 6) on hit", req:null, affluence:2, access:2 },
      { name:"Cane Sword", attack:-1, damage:"1d4 + Power (Impact)", properties:"High concealment", req:null, affluence:2, access:2 },
      { name:"Plasma Axe", attack:-2, damage:"1d12 + Power (Thermal)", properties:"2H", req:{Power:1}, affluence:2, access:3 },
      { name:"Stormhammer", attack:-2, damage:"1d12 + Power (Electrical)", properties:"2H, Shockwave 2m for half dmg", req:{Power:2}, affluence:2, access:3 },
      { name:"Electro Whip", attack:-2, damage:"1d6 + Agility (Electrical)", properties:"(Stun 8) on hit", req:{Agility:1}, affluence:3, access:3 },
      { name:"Vibroblade", attack:-1, damage:"1d10 + Power (Impact)", properties:"-2 Soak", req:{Power:1}, affluence:4, access:4 },
      { name:"Phase Dagger", attack:1, damage:"1d6 + Power (Corrosive)", properties:"Cannot be deflected", req:null, affluence:4, access:4 },
      { name:"Shadowfang Dagger", attack:1, damage:"1d8 (Corrosive)", properties:"Cannot be deflected, advantage on first attack", req:{Agility:0}, affluence:5, access:4 },
      { name:"Reaper's Scythe", attack:-1, damage:"1d10 + Power (Mental)", properties:"2H, Attacks heal wielder for half dmg", req:null, affluence:5, access:5 },
      { name:"Astral Blade", attack:0, damage:"1d6 + Power (Mental)", properties:"Melee strike sends out a blade 10m", req:null, affluence:5, access:6 },

    ],
    ranged: [
      { name:"Sling", attack:-1, damage:"1 (Impact)", properties:" Range 20/40", req:null, affluence:1, access:0 },
      { name:"Tactical Pistol", attack:0, damage:"1d6 (Impact)", properties:" Range 60/120", req:null, affluence:2, access:1 },
      { name:"Crossbow", attack:0, damage:"1d8 (Impact)", properties:" Range 40/100", req:null, affluence:2, access:1 },
      { name:"Stun Gun", attack:0, damage:"1d6 (Electrical)", properties:" Range 20/40 (Stun 8) on hit", req:null, affluence:2, access:1 },
      { name:"Submachine Gun", attack:"0 Burst/-1 Full Auto", damage:"1d4/1d6 (Impact)", properties:" Range 30/60", req:null, affluence:2, access:2 },
      { name:"Shotgun", attack:0, damage:"1d12 (Impact)", properties:" Range 10/20", req:{Power:1}, affluence:2, access:2 },
      { name:"Holdout Pistol", attack:-1, damage:"1d4 (Impact)", properties:" Range 40/100", req:null, affluence:2, access:2 },
      { name:"Assault Rifle", attack:"+1 Single/0 Burst/-2 Full Auto", damage:"1d6/1d8/1d10 (Impact)", properties:" Range 80/250", req:{Power:1}, affluence:2, access:3 },
      { name:"Wand of Force Bolts", attack:0, damage:"1d6 (Impact)", properties:" Range 60/120", req:null, affluence:2, access:3 },
      { name:"Micro Dart Gun", attack:-1, damage:"1d4 (Corrosive)", properties:" Range 10/30, (Stun 14) on hit", req:null, affluence:2, access:4 },
      { name:"Laser Pistol", attack:0, damage:"1d8 (Corrosive)", properties:" Range 80/160", req:{Power:1}, affluence:3, access:3 },
      { name:"Arcane Repeater", attack:1, damage:"1d8 (Thermal or Corrosive)", properties:" Range 40/100", req:{Agility:0}, affluence:3, access:3 },
      { name:"Eldritch Bow", attack:0, damage:"1d10 (Mental)", properties:" Range 80/200", req:{Will:0}, affluence:3, access:3 },
      { name:"Blasting Gauntlets of Corruption", attack:0, damage:"1d8 (Corrosive)", properties:" Range 10/20", req:null, affluence:3, access:3 },
      { name:"Sniper Rifle", attack:3, damage:"2d6 (Impact)", properties:" Range 120/500, -2 Soak, -5 to hit under 60m", req:{Power:1}, affluence:3, access:4 },
      { name:"Plasma Carbine", attack:"+1 Single/-1 Burst", damage:"2d4/2d6 (Thermal)", properties:" Range 80/200", req:{Power:2}, affluence:3, access:4 },
      { name:"Electro-Net Launcher", attack:-2, damage:"1d6 (Electrical)", properties:" Range 30/60 (Radius 2m), (Restrained 12) (Stun 9) on hit", req:{Power:1}, affluence:3, access:4 },
      { name:"Sonic Disruptor", attack:-1, damage:"1d8 (Mental)", properties:" Range 20/40, (Anchored 10) on hit", req:{Power:1}, affluence:4, access:4 },
      { name:"Soulpiercer Staff", attack:0, damage:"2d6 (Mental)", properties:" Range 120/200, -2 Soak", req:{Power:1}, affluence:4, access:4 },
      { name:"Rocket/Grenade Launcher", attack:0, damage:"2d8 (Impact)", properties:" Range 60/120, -4 Soak 5m radius", req:{Power:2}, affluence:4, access:5 },
      { name:"Gauss Rifle", attack:"+2 Single/0 Burst", damage:"1d10/2d6 (Impact)", properties:" Range 100/400, -1 Soak", req:{Power:2}, affluence:5, access:5 }
    ],
    thrown: [
      { name:"Improvised", attack:-1, damage:"1", properties:"Range 20/40, Variable effects", req:null, affluence:0, access:0 },
      { name:"Smoke Grenade", attack:0, damage:"0", properties:"Range 30/60, 10m radius, (Obscured sight)", req:null, affluence:1, access:1 },
      { name:"Flashbang", attack:0, damage:"0", properties:"Range 10/40, 15m radius, (Stun 12) on hit", req:null, affluence:2, access:2 },
      { name:"Frag Grenade", attack:0, damage:"1d6 (Impact)", properties:"Range 30/60, 5m radius, (1 Bleeding) on hit", req:null, affluence:2, access:3 },
      { name:"Soulrank Flask", attack:0, damage:"1d6 (Mental)", properties:"2m radius / 15/30", req:null, affluence:2, access:3 },
      { name:"EMP Grenade", attack:0, damage:"0", properties:"Range 30/60, 15m radius, Stops Moderate and Advanced Electronics", req:null, affluence:3, access:3 },
      { name:"Frost Orb", attack:0, damage:"1d6 (Thermal)", properties:"Range 20/40, 5m radius, (Anchored 8) on hit", req:null, affluence:3, access:3 },
      { name:"Biological Dissacociator", attack:-1, damage:"1d10 (Corrosive)", properties:"Range 15/30, 3m radius", req:null, affluence:3, access:4 },
      { name:"Strobe Lure", attack:0, damage:"0", properties:"Range 30/60, 30m radius, (Lures and incites rage in Shadowborn)", req:null, affluence:3, access:5 },
      { name:"Cryo Shard", attack:0, damage:"1d8 (Thermal)", properties:"Range 20/40, 5m radius, (Slow 10) on hit", req:null, affluence:4, access:3 },
      { name:"Grav Disruptor", attack:0, damage:"1d10 (Impact)", properties:"Range 20/40, 3m radius, implosion", req:null, affluence:4, access:4 },
      { name:"Neurostatic Pulse", attack:0, damage:"1d8 (Mental)", properties:"Range 15/30, 10m radius, (Stun 10) on hit", req:null, affluence:4, access:4 },
      { name:"Void Shuriken", attack:1, damage:"1d6 (Corrosive)", properties:"Range 30/60", req:null, affluence:4, access:4 },
      { name:"Chain Lightning Javelin", attack:-1, damage:"1d6 (Electrical)", properties:"Range 20/40, Arcs 5m to second target on hit", req:"Agility > 0", affluence:4, access:4 },
      { name:"Globe of Paralysis", attack:0, damage:"0", properties:"Range 10/20, 3m radius, (Paralyzed until save 14) on hit", req:"Will > 0", affluence:4, access:5 },
      { name:"Wildfire Sphere", attack:1, damage:"1d6 (Thermal)", properties:"Range 15/30, 3m radius, Ongoing for 2 rounds", req:null, affluence:4, access:5 }
    ]
  },
armor: {
  armor: [
    { name:"Improvised Armor", dodge:-2, deflect:"1d6", soak:0, req:null, affluence:0, access:0 },
    { name:"Rune-Hide Armor", dodge:-1, deflect:"1d8", soak:1, req:null, affluence:1, access:1 },
    { name:"Tactical Vest", dodge:1, deflect:"1d8", soak:0, req:null, affluence:2, access:1 },
    { name:"Ballistic Vest", dodge:-2, deflect:"1d10", soak:1, req:{Endurance:-1}, affluence:3, access:2 },
    { name:"Emberforged Mail", dodge:-3, deflect:"1d12", soak:1, req:{Endurance:0}, affluence:3, access:3 },
    { name:"Reinforced Undershirt", dodge:1, deflect:"1d4", soak:0, req:null, affluence:3, access:4 },
    { name:"Wyrmscale Vest", dodge:0, deflect:"1d10", soak:1, req:null, affluence:3, access:4 },
    { name:"Riot Gear", dodge:-4, deflect:"1d10", soak:2, req:{Endurance:0}, affluence:4, access:3 },
    { name:"Kevlar Suit", dodge:-1, deflect:"1d8", soak:0, req:null, affluence:4, access:3 },
    { name:"Nano-Weave Armor", dodge:-1, deflect:"1d8", soak:1, req:null, affluence:4, access:3 },
    { name:"Phase Shift Armor", dodge:-1, deflect:"1d6", soak:1, req:{Will:0}, affluence:4, access:3 },
    { name:"Adaptive Armor", dodge:-2, deflect:"1d8", soak:1, req:null, affluence:4, access:4 },
    { name:"Chameleon Armor", dodge:2, deflect:"1d4", soak:0, req:null, affluence:4, access:5 },
    { name:"Bloodforged Plate", dodge:-4, deflect:"1d12", soak:3, req:{Endurance:1, Power:0}, affluence:5, access:5 },
    { name:"Reactive Plating", dodge:-3, deflect:"1d10", soak:2, req:{Endurance:1}, affluence:5, access:6 },
    { name:"Exosuit", dodge:-4, deflect:"2d4", soak:4, req:{Power:1, Endurance:1}, affluence:6, access:6 }
  ],

  shield: [
    { name:"Spiritwood Shield", dodge:-2, deflect:"+1 Tier", soak:1, req:null, affluence:3, access:2 },
    { name:"Riot Shield", dodge:-1, deflect:"+1 Tier", soak:1, req:{Endurance:0, Power:0}, affluence:3, access:3 },
    { name:"Crystal Aegis", dodge:-1, deflect:"+2 Tier", soak:1, req:{Power:1}, affluence:5, access:5 }
  ],

  cloak: [
    { name:"Moonlit Mantle", dodge:0, deflect:"None", soak:0, req:null, affluence:2, access:1 },
    { name:"Spiritveil", dodge:2, deflect:"None", soak:0, req:{Will:1}, affluence:3, access:3 },
    { name:"Shadow Veil", dodge:2, deflect:"None", soak:0, req:null, affluence:4, access:3 }
  ]
},

  cybernetics: {
    "Head and Neck": [
      {
        name: "PAIR",
        type: "multi",
        coreVitality: -1,
        options: [
          { name: "Level 0", threads: 1, affluence: 0, access: 0 },
          { name: "Level 1", threads: 2, affluence: 1, access: 2 },
          { name: "Level 2", threads: 4, affluence: 2, access: 2 },
          { name: "Level 3", threads: 6, affluence: 3, access: 3 },
          { name: "Level 4", threads: 8, affluence: 4, access: 3 },
          { name: "Level 5", threads: 10, affluence: 5, access: 4 }
        ]
      },
      {
        name: "Chemical Analyzer",
        description: "Uses sensors to test a sample against a known list of chemicals.",
        type: "multi",
        coreVitality: 0,
        threads: -1,
        affluence: 3,
        access: 2,
        options: []
      },
      {
        name: "Cyber Ears",
        type: "multi",
        coreVitality: -1,
        options: [
          { name: "Normal Hearing Range (Music and Entertainment)", threads: 0, affluence: 1, access: 0 },
          { name: "Subsonic/Ultrasonic", threads: -1, affluence: 1, access: 3 },
          { name: "Wireless Communication", threads: -1, affluence: 2, access: 1 }
        ]
      },
      {
        name: "Cyber Eyes",
        type: "multi",
        coreVitality: -1,
        options: [
          { name: "Normal Color Vision", threads: 0, affluence: 2, access: 0 },
          { name: "Low Light/Thermal/Zoom", threads: 0, affluence: 2, access: 2 },
          { name: "LIDAR - 3D Mapping and Detection", threads: -1, affluence: 3, access: 2 },
          { name: "HUD", threads: -1, affluence: 3, access: 2 },
          { name: "Retinal Projection", threads: -1, affluence: 3, access: 4 },
          { name: "Target Tracking (+1 to Attacks)", threads: -1, affluence: 4, access: 4 }
        ]
      },
      {
        name: "Cyber Larynx",
        type: "multi",
        coreVitality: -1,
        options: [
          { name: "Subvocal/Hypervocal", threads: 0, affluence: 2, access: 1 },
          { name: "Gas Filtration", threads: -1, affluence: 2, access: 2 },
          { name: "Mimic Voice", threads: 0, affluence: 2, access: 3 }
        ]
      },
      {
        name: "Recall Enhancement",
        type: "single",
        description: "Gain an increase to Recall",
        options: [
          { name: "+1 Recall", coreVitality: -1, threads: -2, affluence: 3, access: 3, level: 1 },
          { name: "+2 Recall", coreVitality: -1, threads: -2, affluence: 4, access: 3, level: 2 },
          { name: "+3 Recall", coreVitality: -1, threads: -2, affluence: 5, access: 4, level: 3 }
        ]
      },
      {
        name: "Reflex Boost",
        type: "multi",
        description: "Gains an additional action during combat. Once per day.",
        coreVitality: -1,
        threads: -1,
        affluence: 4,
        access: 3,
        options: []
      },
      {
        name: "Skill Echo Relay Core",
        type: "multi",
        perOptionThreadCost: true,
        description: "Gain an increase to skills",
        options: [
          { name: "+1 Skill", coreVitality: -1, threads: -1, affluence: 1, access: 1 },
          { name: "+2 Skill", coreVitality: -1, threads: -1, affluence: 2, access: 1 },
          { name: "+3 Skill", coreVitality: -1, threads: -1, affluence: 3, access: 2 },
          { name: "+4 Skill", coreVitality: -1, threads: -1, affluence: 4, access: 2 }
        ]
      },
      {
        name: "Universal Translator",
        type: "multi",
        description: "Translates any languages in the known database",
        coreVitality: 0,
        threads: -1,
        affluence: 0,
        access: 0,
        options: []
      },
      {
        name: "Wit Enhancement",
        type: "single",
        description: "Gain an increase to Wit",
        options: [
          { name: "+1 Wit", coreVitality: -1, threads: -2, affluence: 3, access: 3, level: 1 },
          { name: "+2 Wit", coreVitality: -1, threads: -2, affluence: 4, access: 3, level: 2 },
          { name: "+3 Wit", coreVitality: -1, threads: -2, affluence: 5, access: 4, level: 3 }
        ]
      }
    ],
    "Skin and Internal Cybernetics": [
      {
        name: "Armored Dermis",
        type: "single",
        description: "Gains an increase to Soak",
        coreVitality: -1,
        threads: 0,
        affluence: 3,
        access: 3,
        options: [
          { name: "+1 Soak", threads: 0, affluence: 3, access: 3, level: 1 },
          { name: "+2 Soak", threads: 0, affluence: 4, access: 3, level: 2 },
          { name: "+3 Soak", threads: 0, affluence: 5, access: 3, level: 3 }
        ]
      },
      {
        name: "Chameleon Skin/Living Tattoo",
        type: "multi",
        description: "Integrates reactive nanopigments into the dermis, providing adaptive skin pigmentation. Provides Advantage to evasion when active. Can also be used as a limited quality display.",
        coreVitality: -1,
        threads: -1,
        affluence: 4,
        access: 3,
        options: []
      },
      {
        name: "Concealed Pocket",
        type: "multi",
        description: "Conceals small items of Concealment > 3, inside a small pocket of skin and imposes Disadvantage on checks to find hidden items.",
        coreVitality: -1,
        threads: 0,
        affluence: 1,
        access: 3,
        options: []
      },
      {
        name: "Cyber Lungs",
        type: "multi",
        description: "Increases lung capacity and protects from poison gas, grants water breathing capabilities.",
        coreVitality: -1,
        threads: 0,
        affluence: 3,
        access: 3,
        options: []
      },
      {
        name: "Enhanced Agility",
        type: "single",
        description: "Gains an increase in agility",
        coreVitality: -2,
        threads: -1,
        affluence: 3,
        access: 4,
        options: [
          { name: "+1 Agility", threads: -1, affluence: 3, access: 3, level: 1 },
          { name: "+2 Agility", threads: -1, affluence: 4, access: 3, level: 2 },
          { name: "+3 Agility", threads: -1, affluence: 5, access: 4, level: 3 }
        ]
      },
      {
        name: "Enhanced Power",
        type: "single",
        description: "Gains an increase in power",
        coreVitality: -2,
        threads: -1,
        affluence: 3,
        access: 4,
        options: [
          { name: "+1 Power", threads: -1, affluence: 3, access: 3, level: 1 },
          { name: "+2 Power", threads: -1, affluence: 4, access: 3, level: 2 },
          { name: "+3 Power", threads: -1, affluence: 5, access: 4, level: 3 }
        ]
      },
      {
        name: "Iron Stomach",
        type: "multi",
        description: "Allows for the consumption of inedible substances and grants immunity to consumed poisons and toxins.",
        coreVitality: -1,
        threads: 0,
        affluence: 2,
        access: 2,
        options: []
      },
      {
        name: "Nanobot Healing",
        type: "single",
        description: "Creates a pool of nanobots that can be traded for Health on a 1:1 basis",
        coreVitality: -1,
        threads: -2,
        access: 3,
        options: [
          { name: "Pool of 5 points", affluence: 4 },
          { name: "Pool of 10 points", affluence: 5 }
        ]
      },
      {
        name: "Recon Drone",
        type: "multi",
        description: "A small mechanical recon device",
        coreVitality: -1,
        affluence: 2,
        access: 3,
        options: [
          { name: "Crawling Drone", threads: -1 },
          { name: "Swimming Drone", threads: -2 },
          { name: "Flying Drone", threads: -3 }
        ]
      },
      {
        name: "Resistive Skin",
        type: "single",
        description: "Provides skin with embedded nanomolecules to resist a type of damage",
        coreVitality: -1,
        threads: 0,
        affluence: 2,
        access: 2,
        options: [
          { name: "Corrosive" },
          { name: "Electrical" },
          { name: "Impact" },
	  { name: "Thermal" }
        ]
      },
      {
        name: "Secretions",
        type: "multi",
        description: "Secretes oil for escaping bonds or contact poisons.",
        coreVitality: -1,
        threads: -1,
        affluence: 2,
        access: 3,
        options: []
      }
    ],
    "Limbs and Appendage Cybernetics": [
      {
        name: "Additional Limb",
        type: "multi",
        description: "Provides extra help when needed. If used for skill checks, it provides you with an additional +1 on applicable checks.",
        coreVitality: -1,
        threads: -2,
        affluence: 3,
        access: 2,
        options: []
      },
      {
        name: "Cyber Arm",
        type: "single",
        description: "Cybernetic arm with enhancements",
        coreVitality: -1,
        threads: 0,
        affluence: 2,
        access: 1,
        options: [
          { name: "Corrosive" },
          { name: "Thermal" },
          { name: "Electrical" },
	  { name: "Arm blade", access: 2, threads: -1 }
        ]
      },
      {
        name: "Cyber Hands",
        type: "single",
        description: "Cybernetic enhancements",
        coreVitality: -1,
        threads: 0,
        affluence: 2,
        access: 1,
        options: [
          { name: "Retractable Claws", },
          { name: "Magnetic Grip", threads: -1, access: 2 },
          { name: "Stick Pads", threads: -1, access: 2 },
	  { name: "Fingerprint duplication", threads: -1, access: 4 }
        ]
      },
      {
        name: "Cyber Legs",
        type: "single",
        description: "Cybernetic enhancements for the legs",
        coreVitality: -2,
        affluence: 3,
        access: 1,
        options: [
          { name: "Increased movement speed", threads: -1 },
          { name: "Increased jump distance", threads: -1 },
          { name: "Quiet step", threads: 0 }
        ]
      },
      {
        name: "Cyber Tail",
        type: "single",
        description: "Artificial tail",
        coreVitality: -1,
        threads: 0,
        affluence: 2,
        access: 1,
        options: [
          { name: "Balance & Speed", threads: 0, affluence: 2, access: 1 },
          { name: "Bladed/Stinger", threads: -1, affluence: 2, access: 3 },
	  { name: "Prehensile", threads: -2, affluence: 3, access: 1 }
        ]
      }
    ]
  }

};


/* ================= RANK SYSTEM ================= */

const professionRankStats = {
  "Agent": {1:{affluence:2,access:2},2:{affluence:2,access:3},3:{affluence:2,access:4},4:{affluence:3,access:4},5:{affluence:3,access:5}},
  "Analyst": {1:{affluence:1,access:1},2:{affluence:2,access:1},3:{affluence:3,access:1},4:{affluence:3,access:2},5:{affluence:4,access:3}},
  "Crafter": {1:{affluence:1,access:1},2:{affluence:2,access:1},3:{affluence:3,access:1},4:{affluence:4,access:2},5:{affluence:5,access:2}},
  "Diplomat": {1:{affluence:1,access:1},2:{affluence:2,access:1},3:{affluence:3,access:1},4:{affluence:3,access:2},5:{affluence:4,access:3}},
  "Medic": {1:{affluence:2,access:2},2:{affluence:2,access:3},3:{affluence:3,access:3},4:{affluence:3,access:4},5:{affluence:4,access:4}},
  "Mercenary": {1:{affluence:2,access:2},2:{affluence:2,access:3},3:{affluence:3,access:3},4:{affluence:3,access:4},5:{affluence:4,access:4}},
  "Navigator": {1:{affluence:1,access:1},2:{affluence:2,access:2},3:{affluence:3,access:2},4:{affluence:3,access:3},5:{affluence:4,access:3}},
  "Relic Hunter": {1:{affluence:1,access:1},2:{affluence:2,access:1},3:{affluence:2,access:2},4:{affluence:3,access:2},5:{affluence:4,access:3}},
  "Trader": {1:{affluence:2,access:1},2:{affluence:2,access:2},3:{affluence:3,access:2},4:{affluence:3,access:3},5:{affluence:4,access:4}},
  "Video Star": {1:{affluence:3,access:1},2:{affluence:3,access:2},3:{affluence:4,access:2},4:{affluence:4,access:3},5:{affluence:5,access:3}},
  "Warden": {1:{affluence:2,access:1},2:{affluence:2,access:2},3:{affluence:2,access:3},4:{affluence:2,access:4},5:{affluence:3,access:4}}
};


/* ================= TRAIT HELPERS ================= */

const uniqueVals=[...new Set(data.values)];
const counts={};
data.values.forEach(v=>counts[v]=(counts[v]||0)+1);


function renderAbilityLoreHtml(name, item, forDossier) {
  if (!item) return "<p><em>No ability selected.</em></p>";
  const upgradeColor = forDossier ? "#000" : "#fff";
  let upgradeHTML = "";
  if (rankState.rank >= 3) {
    const upgrades = data.abilityUpgrades?.[name] || [];
    const selectedUpgrades = upgrades.filter(u =>
      state.abilityUpgrades.includes(u.name)
    );
    if (selectedUpgrades.length > 0) {
      upgradeHTML += "<h3>Ability Upgrades</h3>";
      selectedUpgrades.forEach(u => {
        upgradeHTML += `<p style="color:${upgradeColor};"><strong>${u.name}</strong>: ${u.desc}</p>`;
      });
    }
  }
  return `<h2>${name}</h2><p>${item.desc}</p>${upgradeHTML}`;
}

function getDossierSkillsHtml() {
  const allNames = new Set();
  if (data.skills) {
    Object.values(data.skills).forEach(list => {
      list.forEach(s => allNames.add(s));
    });
  }
  Object.keys(state.skills || {}).forEach(s => allNames.add(s));
  (state.professionSkills || []).forEach(s => allNames.add(s));

  const lines = [...allNames]
    .map(skill => {
      const base = state.skills[skill] || 0;
      const bonus = getTotalSkillBonus(skill);
      return { skill, level: base + bonus, bonus };
    })
    .filter(({ level }) => level > 0)
    .sort((a, b) => a.skill.localeCompare(b.skill))
    .map(
      ({ skill, level, bonus }) =>
        `<p>${skill}: ${level}${bonus ? " (Bonus)" : ""}</p>`
    );

  return lines.length ? lines.join("") : "<p>None</p>";
}

function renderProfessionLoreHtml(name, item) {
  let html = `<h2>${name}</h2><p>${item.desc || ""}</p>`;
  const fixedSkills =
    data.professionSkills?.[name]?.fixed?.length > 0
      ? data.professionSkills[name].fixed.join(", ")
      : null;

  // Show fixed skills first instead of extra
  if (fixedSkills) {
    html += `<hr><div class="lore-profession-extra"><strong>Granted Skills: </strong>${fixedSkills}</div>`;
  }
  if (item.extra) {
    html += `<hr><div class="lore-profession-extra">${item.extra}</div>`;
  }
  if (
    name === "Agent" &&
    state.mimicProfession &&
    data.profession[state.mimicProfession]
  ) {
    const m = data.profession[state.mimicProfession];
    if (m.extra) {
      html += `<div class="lore-profession-extra"> Mimic >>> ${m.extra}</div>`;
    }
  }
  return html;
}
function getProfessionExtrasDossierHtml() {
  const prof = state.profession;
  if (!prof || !data.profession[prof]) return "";
  const item = data.profession[prof];
  const parts = [];
  if (item.extra) {
    parts.push(`<div class="dossier-extra">${item.extra}</div>`);
  }
  if (
    prof === "Agent" &&
    state.mimicProfession &&
    data.profession[state.mimicProfession]
  ) {
    const m = data.profession[state.mimicProfession];
    parts.push(`<h3>Mimicked profession: ${state.mimicProfession}</h3>`);
    if (m.extra) {
      parts.push(`<div class="dossier-extra">${m.extra}</div>`);
    }
  }
  if (!parts.length) return "";
  return `<h2>Profession features</h2>${parts.join("")}`;
}

function renderRaceLoreHtml(name, item) {
  let html = `<h2>${name}</h2><p>${item.desc || ""}</p>`;
  if (item.extra) {
    html += `<hr><div class="lore-profession-extra">${item.extra}</div>`;
  }
  if (
    name === "Dirgan" &&
    state.hostRace &&
    data.race[state.hostRace]
  ) {
    const host = data.race[state.hostRace];
    html += `<h3>Host: ${state.hostRace}</h3>`;
    if (host.extra) {
      html += `<div class="lore-profession-extra">${host.extra}</div>`;
    }
  }
  return html;
}

function getRaceExtrasDossierHtml() {
  const r = state.race;
  if (!r || !data.race[r]) return "";
  const item = data.race[r];
  const parts = [];
  if (item.extra) {
    parts.push(`<div class="dossier-extra">${item.extra}</div>`);
  }
  if (r === "Dirgan" && state.hostRace && data.race[state.hostRace]) {
    const host = data.race[state.hostRace];
    parts.push(`<h3>Host body: ${state.hostRace}</h3>`);
    if (host.extra) {
      parts.push(`<div class="dossier-extra">${host.extra}</div>`);
    }
  }
  if (!parts.length) return "";
  return `<h2>Race features</h2>${parts.join("")}`;
}


/* ================= CYBERNETICS ================= */

function findCyberItem(name) {
  for (const [cat, list] of Object.entries(data.cybernetics || {})) {
    const item = list.find(x => x.name === name);
    if (item) return { item, category: cat };
  }
  return null;
}

function normalizeCyberType(item) {
  if (item.type) return item.type;
  if (!item.options || item.options.length === 0) return "multi";
  return "multi";
}

function isCyberToggle(item) {
  return normalizeCyberType(item) === "multi" && (!item.options || item.options.length === 0);
}

function cyberOptionMeetsGate(opt, prof) {
  return meetsAffluenceAccess(prof, {
    affluence: opt.affluence ?? 0,
    access: opt.access ?? 0
  });
}

function cyberItemMeetsMainGate(item, prof) {
  return meetsAffluenceAccess(prof, {
    affluence: item.affluence ?? 0,
    access: item.access ?? 0
  });
}

function cyberItemVisible(item, prof, pairSelected) {
  if (item.name === "PAIR") return true;
  if (!pairSelected) return false;
  if (isCyberToggle(item)) {
    return cyberItemMeetsMainGate(item, prof);
  }
  if (normalizeCyberType(item) === "single") {
    if (!cyberItemMeetsMainGate(item, prof)) return false;
    return (item.options || []).some(o => cyberOptionMeetsGate(o, prof));
  }
  if (!cyberItemMeetsMainGate(item, prof)) return false;
  return (item.options || []).some(o => cyberOptionMeetsGate(o, prof));
}

function getThreadPoolFromPair(pairLevel) {
  if (!pairLevel) return 0;
  const found = findCyberItem("PAIR");
  if (!found) return 0;
  const opt = found.item.options.find(o => o.name === pairLevel);
  return opt ? opt.threads : 0;
}

function negCyberCost(n) {
  if (n === undefined || n === null) return 0;
  return n < 0 ? -n : 0;
}

function computeCyberTotalsFrom(pairLevel, picks) {
  picks = picks || {};
  let cv = 0;
  let threadsUsed = 0;
  const pool = getThreadPoolFromPair(pairLevel);
  const pairDef = findCyberItem("PAIR")?.item;
  if (pairLevel && pairDef) {
    cv += negCyberCost(pairDef.coreVitality);
  }

  for (const list of Object.values(data.cybernetics || {})) {
    for (const item of list) {
      if (item.name === "PAIR") continue;
      const pick = picks[item.name];
      const type = normalizeCyberType(item);

      if (isCyberToggle(item)) {
        if (pick !== true) continue;
        cv += negCyberCost(item.coreVitality);
        threadsUsed += negCyberCost(item.threads);
        continue;
      }

      if (type === "multi" && item.options && item.options.length) {
        const sel = Array.isArray(pick) ? pick : [];
        if (!sel.length) continue;
        cv += negCyberCost(item.coreVitality);
        threadsUsed += negCyberCost(item.threads);
        for (const on of sel) {
          const opt = item.options.find(o => o.name === on);
          if (!opt) continue;
          cv += negCyberCost(opt.coreVitality);
          threadsUsed += negCyberCost(opt.threads);
        }
        continue;
      }

      if (type === "single") {
        if (!pick || typeof pick !== "string") continue;
        const opt = item.options?.find(o => o.name === pick);
        cv += negCyberCost(item.coreVitality);
        threadsUsed += negCyberCost(item.threads);
        if (opt) {
          cv += negCyberCost(opt.coreVitality);
          threadsUsed += negCyberCost(opt.threads);
        }
      }
    }
  }

  const cvRemaining = 10 - cv;
  const threadsRemaining = pool - threadsUsed;
  return {
    pool,
    cvUsed: cv,
    threadsUsed,
    cvRemaining,
    threadsRemaining,
    valid: cvRemaining >= 1 && threadsRemaining >= 0
  };
}

function computeCyberTotals() {
  return computeCyberTotalsFrom(
    state.cybernetics.pairLevel,
    state.cybernetics.picks
  );
}

function getSelectedCyberOption(itemName) {
  const picked = state.cybernetics.picks[itemName];
  if (!picked || typeof picked !== "string") return null;
  const found = findCyberItem(itemName);
  if (!found?.item?.options) return null;
  return found.item.options.find(opt => opt.name === picked) || null;
}

function getAllSkillNames() {
  const all = new Set();
  Object.values(data.skills || {}).forEach(list => {
    list.forEach(skill => all.add(skill));
  });
  return [...all].sort((a, b) => a.localeCompare(b));
}

function getSkillEchoLevelFromOptionName(optionName) {
  const m = String(optionName || "").match(/\+(\d+)\s*Skill/i);
  return m ? parseInt(m[1], 10) || 0 : 0;
}

function getCyberSkillEchoBonus(skillName) {
  const picks = state.cybernetics?.picks?.["Skill Echo Relay Core"];
  const targets = state.cybernetics?.skillEchoTargets || {};
  if (!Array.isArray(picks) || !skillName) return 0;
  return picks.reduce((sum, optionName) => {
    if (targets[optionName] !== skillName) return sum;
    return sum + getSkillEchoLevelFromOptionName(optionName);
  }, 0);
}

function getTotalSkillBonus(skillName) {
  const professionBonus = state.professionSkills.filter(s => s === skillName).length;
  const echoBonus = getCyberSkillEchoBonus(skillName);
  return professionBonus + echoBonus;
}

function getCyberTraitBonus(traitName) {
  const itemMap = {
    Recall: ["Recall Enhancement"],
    Wit: ["Wit Enhancement"],
    Agility: ["Enhanced Agility"],
    Power: ["Enhanced Power"]
  };
  const itemNames = itemMap[traitName] || [];
  return itemNames.reduce((sum, itemName) => {
    const selected = getSelectedCyberOption(itemName);
    return sum + (selected?.level || 0);
  }, 0);
}

function getCyberSoakBonus() {
  const selected = getSelectedCyberOption("Armored Dermis");
  return selected?.level || 0;
}

function pruneInvalidCyberPicks() {
  const t = computeCyberTotals();
  if (!t.valid) {
    state.cybernetics.picks = {};
    state.cybernetics.skillEchoTargets = {};
  }
}

function getDossierCyberneticsHtml() {
  if (!state.cybernetics.pairLevel) {
    return "<p>None (no PAIR selected)</p>";
  }
  const t = computeCyberTotals();
  const lines = [
    `<p><strong>PAIR:</strong> ${state.cybernetics.pairLevel} — thread pool <strong>${t.pool}</strong></p>`,
    `<p><strong>Threads used:</strong> ${t.threadsUsed}</p>`,
    `<p><strong>CV spent on cybernetics:</strong> ${t.cvUsed}</p>`
  ];
  for (const list of Object.values(data.cybernetics || {})) {
    for (const item of list) {
      if (item.name === "PAIR") continue;
      const pick = state.cybernetics.picks[item.name];
      if (pick === undefined || pick === null || pick === false) continue;
      if (Array.isArray(pick) && pick.length === 0) continue;
      if (isCyberToggle(item) && pick === true) {
        lines.push(`<p><strong>${item.name}</strong> (installed)</p>`);
        continue;
      }
      if (normalizeCyberType(item) === "single" && typeof pick === "string") {
        lines.push(`<p><strong>${item.name}:</strong> ${pick}</p>`);
        continue;
      }
      if (Array.isArray(pick) && pick.length) {
        if (item.name === "Skill Echo Relay Core") {
          const targets = state.cybernetics.skillEchoTargets || {};
          const labels = pick.map(optName => {
            const target = targets[optName];
            return target ? `${optName} -> ${target}` : optName;
          });
          lines.push(`<p><strong>${item.name}:</strong> ${labels.join(", ")}</p>`);
        } else {
          lines.push(`<p><strong>${item.name}:</strong> ${pick.join(", ")}</p>`);
        }
      }
    }
  }
  return lines.join("");
}

function updateCyberLoreBox() {
  if (steps[step] !== "cybernetics") return;
  const t = computeCyberTotals();
  const valid = t.valid ? "OK" : "Over budget";
  const pairHint = state.cybernetics.pairLevel
    ? ""
    : "<p>Select a <strong>PAIR</strong> first to set your thread budget. Negative thread/CV values in the data are costs.</p>";
  document.getElementById("loreBox").innerHTML = `
    <h2>Cybernetics</h2>
    <p><strong>Thread pool:</strong> ${t.pool} &nbsp;|&nbsp; <strong>Used:</strong> ${t.threadsUsed} &nbsp;|&nbsp; <strong>Left:</strong> ${t.threadsRemaining}</p>
    <p><strong>CV (max 10, min 1):</strong> spent ${t.cvUsed}, remaining ${t.cvRemaining} — <em>${valid}</em></p>
    ${pairHint}
  `;
}

function setCyberPairLevel(levelName) {
  const prev = state.cybernetics.pairLevel;
  state.cybernetics.pairLevel = levelName;
  if (prev !== levelName) {
    state.cybernetics.picks = {};
    state.cybernetics.skillEchoTargets = {};
  }
  pruneInvalidCyberPicks();
  loadCybernetics();
}

function setCyberPick(itemName, nextPick) {
  const prev = state.cybernetics.picks[itemName];
  if (
    nextPick === null ||
    nextPick === undefined ||
    nextPick === false ||
    (Array.isArray(nextPick) && nextPick.length === 0)
  ) {
    delete state.cybernetics.picks[itemName];
    if (itemName === "Skill Echo Relay Core") {
      state.cybernetics.skillEchoTargets = {};
    }
    loadCybernetics();
    return true;
  }
  state.cybernetics.picks[itemName] = nextPick;
  const t = computeCyberTotals();
  if (!t.valid) {
    if (prev !== undefined) state.cybernetics.picks[itemName] = prev;
    else delete state.cybernetics.picks[itemName];
    loadCybernetics();
    return false;
  }
  loadCybernetics();
  return true;
}

function toggleCyberMultiOption(itemName, optionName, checked) {
  const found = findCyberItem(itemName);
  if (!found) return;
  const item = found.item;
  const prev = state.cybernetics.picks[itemName];
  const arr = Array.isArray(prev) ? [...prev] : [];
  if (checked) {
    if (!arr.includes(optionName)) arr.push(optionName);
  } else {
    const i = arr.indexOf(optionName);
    if (i >= 0) arr.splice(i, 1);
  }
  if (itemName === "Skill Echo Relay Core" && !checked) {
    delete state.cybernetics.skillEchoTargets[optionName];
  }
  const next = arr.length ? arr : null;
  if (next === null) {
    delete state.cybernetics.picks[itemName];
    if (itemName === "Skill Echo Relay Core") {
      state.cybernetics.skillEchoTargets = {};
    }
    loadCybernetics();
    return;
  }
  setCyberPick(itemName, next);
}

function loadCybernetics() {
  pruneInvalidCyberPicks();
  updateCyberLoreBox();

  const container = document.getElementById("cardContainer");
  container.innerHTML = "";
  const prof = getProfessionStats();
  const pairFound = findCyberItem("PAIR");
  if (!pairFound) return;

  const wrap = document.createElement("div");
  wrap.className = "cyber-root";

  const pairTitle = document.createElement("h3");
  pairTitle.textContent = "PAIR (required)";
  wrap.appendChild(pairTitle);

  const pairRow = document.createElement("div");
  pairRow.className = "cyber-pair-row";
  pairFound.item.options.forEach(opt => {
    if (!cyberOptionMeetsGate(opt, prof)) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card";
    btn.textContent = `${opt.name} (${opt.threads} threads)`;
    if (state.cybernetics.pairLevel === opt.name) btn.classList.add("selected");
    btn.onclick = () => setCyberPairLevel(opt.name);
    pairRow.appendChild(btn);
  });
  wrap.appendChild(pairRow);

  if (!state.cybernetics.pairLevel) {
    const hint = document.createElement("p");
    hint.className = "cyber-hint";
    hint.textContent = "Choose a PAIR level to unlock other implants.";
    wrap.appendChild(hint);
    container.appendChild(wrap);
    return;
  }

  for (const [catName, list] of Object.entries(data.cybernetics || {})) {
    const catEl = document.createElement("div");
    catEl.className = "cyber-category";
    const h = document.createElement("div");
    h.className = "cyber-cat";
    h.textContent = catName;
    catEl.appendChild(h);
    const categoryRow = document.createElement("div");
    categoryRow.className = "cyber-category-row";

    for (const item of list) {
      if (item.name === "PAIR") continue;
      if (!cyberItemVisible(item, prof, !!state.cybernetics.pairLevel)) continue;

      const box = document.createElement("div");
      box.className = "cyber-item";

      const title = document.createElement("h4");
      title.textContent = item.name;
      box.appendChild(title);

      if (item.description) {
        const d = document.createElement("p");
        d.className = "cyber-desc";
        d.textContent = item.description;
        box.appendChild(d);
      }
      if (item.perOptionThreadCost) {
        const note = document.createElement("p");
        note.className = "cyber-note";
        note.textContent = "Thread / CV costs on each option apply per selection.";
        box.appendChild(note);
      }

      if (isCyberToggle(item)) {
        const row = document.createElement("label");
        row.className = "cyber-toggle";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = state.cybernetics.picks[item.name] === true;
        cb.onchange = () => {
          if (cb.checked) {
            setCyberPick(item.name, true);
          } else {
            delete state.cybernetics.picks[item.name];
            loadCybernetics();
          }
        };
        row.appendChild(cb);
        row.appendChild(document.createTextNode(" Installed"));
        box.appendChild(row);
      } else if (normalizeCyberType(item) === "single") {
        (item.options || []).forEach(opt => {
          if (!cyberOptionMeetsGate(opt, prof)) return;
          const row = document.createElement("label");
          row.className = "cyber-opt-row";
          const rb = document.createElement("input");
          rb.type = "radio";
          rb.name = "cyber_" + item.name.replace(/\s+/g, "_");
          rb.checked = state.cybernetics.picks[item.name] === opt.name;
          rb.onchange = () => {
            if (rb.checked) setCyberPick(item.name, opt.name);
          };
          row.appendChild(rb);
          const lab = document.createElement("span");
          lab.textContent = " " + opt.name;
          row.appendChild(lab);
          box.appendChild(row);
        });
        const clear = document.createElement("button");
        clear.type = "button";
        clear.className = "cyber-clear";
        clear.textContent = "Clear";
        clear.onclick = () => {
          delete state.cybernetics.picks[item.name];
          loadCybernetics();
        };
        box.appendChild(clear);
      } else if (item.options && item.options.length) {
        (item.options || []).forEach(opt => {
          if (!cyberOptionMeetsGate(opt, prof)) return;
          const row = document.createElement("label");
          row.className = "cyber-opt-row";
          const cb = document.createElement("input");
          cb.type = "checkbox";
          const arr = state.cybernetics.picks[item.name];
          cb.checked = Array.isArray(arr) && arr.includes(opt.name);
          cb.onchange = () => toggleCyberMultiOption(item.name, opt.name, cb.checked);
          row.appendChild(cb);
          const lab = document.createElement("span");
          lab.textContent = " " + opt.name;
          row.appendChild(lab);
          box.appendChild(row);

          if (item.name === "Skill Echo Relay Core" && cb.checked) {
            const targetWrap = document.createElement("div");
            targetWrap.className = "cyber-skill-echo-row";
            const targetLabel = document.createElement("label");
            targetLabel.textContent = "Target Skill:";
            const targetSelect = document.createElement("select");
            targetSelect.className = "cyber-skill-echo-select";

            const defaultOpt = document.createElement("option");
            defaultOpt.value = "";
            defaultOpt.textContent = "-- Select Skill --";
            targetSelect.appendChild(defaultOpt);

            getAllSkillNames().forEach(skillName => {
              const optEl = document.createElement("option");
              optEl.value = skillName;
              optEl.textContent = skillName;
              if (state.cybernetics.skillEchoTargets[opt.name] === skillName) {
                optEl.selected = true;
              }
              targetSelect.appendChild(optEl);
            });

            targetSelect.onchange = () => {
              if (targetSelect.value) {
                state.cybernetics.skillEchoTargets[opt.name] = targetSelect.value;
              } else {
                delete state.cybernetics.skillEchoTargets[opt.name];
              }
              loadCybernetics();
            };

            targetLabel.appendChild(targetSelect);
            targetWrap.appendChild(targetLabel);
            box.appendChild(targetWrap);
          }
        });
      }

      categoryRow.appendChild(box);
    }
    catEl.appendChild(categoryRow);
    wrap.appendChild(catEl);
  }

  container.appendChild(wrap);
}


/* ================= STEP SYSTEM ================= */

function loadStep(){
  document.getElementById("summaryPage").style.display = "none";
  document.getElementById("loreBox").innerHTML = "";
  const toggle = document.getElementById("mtToggle");
  if (toggle) toggle.checked = state.mtMode;
  const rankSelect = document.getElementById("rankSelect");

  rankSelect.style.display =
    steps[step] === "profession" ? "block" : "none";
  rankSelect.value = rankState.rank;

  const key = steps[step];
  const isSummary = key === "summary";
  document.querySelector(".cards").style.display =
    isSummary ? "none" : (key === "cybernetics" ? "block" : "grid");
  document.querySelector(".traits-stats-row").style.display = isSummary ? "none" : "flex";
  document.querySelector(".nav").style.display = isSummary ? "none" : "flex";

  const skillCounter = document.getElementById("skillCounter");
  const techniqueCounter = document.getElementById("techniqueCounter");

// Hide both by default on every step change
  if (skillCounter) skillCounter.style.display = "none";
  if (techniqueCounter) techniqueCounter.style.display = "none";

// Default images per step
  const defaultImages = {
    profession: "assets/ui/profession.png",
    ability: "assets/ui/ability.jpg",
    race: "assets/ui/race.jpeg",
    traits: "assets/ui/traits.png",
    skills: "assets/ui/skills.png",
    cybernetics: "assets/ui/cybernetics.png",
    techniques: "assets/ui/techniques.png",
    weapons: "assets/ui/weapons.png",
    armor: "assets/ui/armor.png",
    summary: "assets/ui/summary.png"
  };

// Set default image if no selection yet
if(defaultImages[key]){
  document.getElementById("displayImage").src = defaultImages[key];
}

  if (key === "techniques") {
    document.getElementById("loreBox").innerHTML = `
      <h2>Techniques</h2>
      <p>Select your techniques.</p>
    `;
  }

  document.getElementById("cardContainer").innerHTML="";
  document.getElementById("traitsSection").innerHTML="";
  document.getElementById("traitPool").textContent="";
  document.getElementById("summary").textContent="";
  document.getElementById("stepTitle").textContent =
    "Choose " + key.charAt(0).toUpperCase() + key.slice(1);

  if (data[key] && typeof data[key] === "object" && !Array.isArray(data[key]) && key !== "techniques") {

    const container = document.getElementById("cardContainer");

Object.entries(data[key]).forEach(([name, item]) => {

  const div = document.createElement("div");
  div.className = "card";
  div.textContent = name;

  if (state[key] && state[key] === name) {
    div.classList.add("selected");
  }

  div.onclick = () => {
    document.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
    div.classList.add("selected");

    state[key] = name;
    if(key === "ability"){
      state.abilityUpgrades = [];
      loadAbilityUpgrades();
    }
    if(key === "profession"){
      state.professionChoice = null;
      state.professionSkills = [];
      if(name !== "Agent"){
        state.mimicProfession = null;
      }
    }

    // ✅ Immediately apply profession skills + show dropdown
    if(key === "profession"){
      applyProfessionSkills();
      loadProfessionSkillChoice();
      loadMimicProfessionChoice();
    }

  // 🔥 Reset techniques if race changes
    if (key === "race") {
      state.techniques = [];
      state.hostRace = null;

      if(key === "race" && state.race){
        loadHostRaceChoice();
      }
      if (hasFreeSummon()) {
        state.techniques.push("Summon");
      }
    }

    updateDisplay(name, item, key);
  };

  container.appendChild(div);
});

if (state[key] && data[key][state[key]]) {
  updateDisplay(state[key], data[key][state[key]], key);
}
// ✅ Add profession skill choice dropdown
if(key === "profession" && state.profession){
  loadProfessionSkillChoice();
  loadMimicProfessionChoice(); // ✅ ADD THIS
}
  }

  const traitsBox = document.getElementById("traitsStatsBox");
  const traitsRow = document.querySelector(".traits-stats-row");

  if (key === "traits") {
    traitsBox.style.display = "block";
    traitsRow.style.display = "flex";
    loadMTTraitBonus();
    loadTraits();
  } else {
    traitsBox.style.display = "none";
    traitsRow.style.display = "none";
  }

  if (key === "techniques") {
    loadMTOverrides();
    loadTechniques();
    const techniqueCounter = document.getElementById("techniqueCounter");
    if (techniqueCounter) techniqueCounter.style.display = "block";
  }
  if (key === "weapons") {
    loadMTOverrides();
    loadWeapons();}
  if (key === "skills") {
    applyProfessionSkills(); // ✅ ADD THIS LINE
    loadSkills();
    const skillCounter = document.getElementById("skillCounter");
    if (skillCounter) skillCounter.style.display = "block";
  }
  if (key === "cybernetics") {
    loadMTOverrides();
    loadCybernetics();
  }
  if (key === "armor") {
    loadMTOverrides();
    loadArmor();}


/////////////////Character Dossier Page/////////////////////////
if (key === "summary") {
  document.getElementById("summaryPage").style.display = "block";

  const stats = getStats();
  const profStats = getProfessionStats();
  const armorStats = getArmorTotals();
  const dossierAbilityHtml =
    state.ability && data.ability[state.ability]
      ? renderAbilityLoreHtml(state.ability, data.ability[state.ability], true)
      : "<p><em>No ability selected.</em></p>";
  const dossierSkillsHtml = getDossierSkillsHtml();
  const dossierCyberHtml = getDossierCyberneticsHtml();
  const dossierProfessionExtrasHtml = getProfessionExtrasDossierHtml();
  const dossierRaceExtrasHtml = getRaceExtrasDossierHtml();
  const dossierCombinedFeaturesHtml = [
    dossierProfessionExtrasHtml.replace("<h2>Profession features</h2>", ""),
    dossierRaceExtrasHtml.replace("<h2>Race features</h2>", "")
  ].filter(Boolean).join("");

  // ================= PAGE 1 =================
document.getElementById("page1").innerHTML = `
<h1>Character Dossier</h1>

<!-- TOP ROW (3 columns) -->
<div class="row three-col">

  <div>
    <h2>Core</h2>
    <p><strong>Profession:</strong> ${state.profession} <strong>Rank:</strong> ${rankState.rank}</p>
    <p><strong>Affluence:</strong> ${profStats.affluence}</p>
    <p><strong>Access:</strong> ${profStats.access}</p>
    <p><strong>Race:</strong> ${state.race || "None"}</p>
  </div>

  <div>
    <h2>Combat Stats</h2>
    <p><strong>Combat Awareness Bonus: </strong>${stats.Wit + stats.Agility}</p>
    <p><strong>Dodge:</strong> ${armorStats.dodge}</p>
    <p><strong>Deflect:</strong> ${armorStats.deflect}</p>
    <p><strong>Soak:</strong> ${armorStats.soak}</p>
  </div>

  <div>
    <h2>Combat Stats</h2>
    <p><strong>Speed: </strong>${Math.max(2, (stats.Power + stats.Agility) * 2)}</p>
    <p><strong>Max Health: </strong>${stats.Power + stats.Endurance + 5}</p>
    <p><strong>Max Stamina: </strong>${Math.max(1,(stats.Will + stats.Endurance))}</p>
    <p><strong>Max Core Vitality: </strong>${computeCyberTotals().cvRemaining}</p>
  </div>

</div>

<!-- BOTTOM ROW (2 columns) -->
<div class="row two-col">

  <div>
    <h2>Traits</h2>
    ${data.traits
      .map(t => `<p>${t}: ${stats[t]}</p>`)
      .join("")}
  </div>

  <div>
    <h2>Derived Stats</h2>
    <p>Presence: ${stats.Charisma + stats.Manipulation}</p>
    <p>Physicality: ${stats.Power + stats.Agility}</p>
    <p>Intellect: ${stats.Wit + stats.Recall}</p>
    <p>Fortitude: ${stats.Will + stats.Endurance}</p>
    <p>Reflexes: ${stats.Reflexes}</p>
    <p>Charm: ${stats.Wit + stats.Charisma}</p>
    <p>Physical Intimidation: ${stats.Power + stats.Manipulation}</p>
    <p>Leadership: ${stats.Leadership}</p>
  </div>

</div>
${
  dossierCombinedFeaturesHtml
    ? `<div class="row dossier-profession-extras"><h2>Profession/Race Features</h2>${dossierCombinedFeaturesHtml}</div>`
    : ""
}
`;


  // ================= PAGE 2 =================

document.getElementById("page2").innerHTML = `

<!-- TOP ROW (3 columns) -->
<div class="row three-col">

  <div>
    ${dossierAbilityHtml}
    <h2>Techniques</h2>
    ${
      state.techniques.length
        ? ["pack","physical","magical"].map(type => {
            const list = data.techniques[type]
              .map(t => t.name)
              .filter(name => state.techniques.includes(name));
            if(!list.length) return "";
            return `
              <h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
              ${list.map(t => `<p>${t}</p>`).join("")}
            `;
          }).join("")
        : "<p>None</p>"
    }
  </div>

  <div>
    <h2>Skills</h2>
    ${dossierSkillsHtml}
    <h2>Cybernetics</h2>
    ${dossierCyberHtml}
  </div>

  <div>
    <h2>Weapons</h2>
    ${
      Object.entries(state.weapons).some(([_,v]) => v)
        ? Object.entries(state.weapons).map(([type,name]) => {
            if(!name) return "";
            const w = data.weapons[type].find(x => x.name === name);
            return `
              <p><strong>${w.name}</strong> (${type})</p>
              <p>Attack: ${w.attack} | Damage: ${w.damage}</p>
              <p>${w.properties}</p>
            `;
          }).join("")
        : "<p>No weapons selected</p>"
    }
    <h2>Armor</h2>
    ${
      Object.entries(state.armor).some(([_,v]) => v)
        ? Object.entries(state.armor).map(([type,name]) => {
            if(!name) return "";
            const a = data.armor[type].find(x => x.name === name);
            return `
              <p><strong>${a.name}</strong> (${type})</p>
              <p>Dodge: ${a.dodge} | Deflect: ${a.deflect} | Soak: ${a.soak}</p>
            `;
          }).join("")
        : "<p>No armor selected</p>"
    }
  </div>

</div>
`;

}
}


/* ================= TRAITS ================= */

function loadTraits(){
  const container=document.getElementById("traitsSection");

  data.traits.forEach(trait=>{
    const select=document.createElement("select");
    select.dataset.trait=trait;

    if (state.traits[trait] !== undefined) {
      select.dataset.selected = state.traits[trait];
    }

    select.onchange=updateTraits;
    container.appendChild(select);
  });

  updateTraits();
}

function updateTraits(){

  const selects=document.querySelectorAll("#traitsSection select");
  let used={};

  selects.forEach(s=>{
    if(s.value)used[s.value]=(used[s.value]||0)+1;
  });

  selects.forEach(select=>{

    const trait=select.dataset.trait;
    const current = select.value || select.dataset.selected;
    select.innerHTML=`<option value="">${trait}</option>`;

    uniqueVals.forEach(val=>{
      const max=counts[val];
      const usedCount=used[val]||0;

      if(usedCount<max||val===current){
        const opt=document.createElement("option");
        opt.value=val;
        opt.textContent=`${trait} (${val})`;
        if(val===current)opt.selected=true;
        if(val===current){
          opt.selected=true;
          delete select.dataset.selected; 
        }
        select.appendChild(opt);
      }
    });

    if(select.value) state.traits[trait] = select.value;
  });

  updatePool(used);

// 🔥 Reset techniques if requirements change
  state.techniques = [];

// Re-add free Summon if needed
  if (hasFreeSummon()) {
    state.techniques.push("Summon");
  }

  updateStats();
}

function updatePool(used){
 
  let pool=[]
  let temp={...counts};

  Object.keys(used).forEach(v=>temp[v]-=used[v]);

  data.values.forEach(v=>{
    if(temp[v]>0){
      pool.push(v);
      temp[v]--;
    }
  });

  const availableText = "Available: " + pool.join(", ");
  if(steps[step] === "traits"){
    document.getElementById("loreBox").innerHTML = `
      <h2>Traits</h2>
      <p>${availableText}</p>
    `;
  }

}

/* ================= SKILLS ================= */

function getSkillPoints(){
  return rankState.rank * 3;
}

function getUsedSkillPoints(){
  if(state.mtMode) return 0;
  let total = 0;

  Object.keys(state.skills).forEach(skill => {

    const base = state.skills[skill] || 0;
    const bonus = getTotalSkillBonus(skill);

    const startLevel = bonus;              // free levels
    const endLevel = base + bonus;         // actual level

    for(let i = startLevel + 1; i <= endLevel; i++){
      total += i; // only pay for levels ABOVE bonus
    }

  });

  return total;
}

function loadSkills(){

  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  // Counter
  let counter = document.getElementById("skillCounter");
  if (!counter) {
    counter = document.createElement("div");
    counter.id = "skillCounter";
    counter.style.marginBottom = "10px";
    counter.style.fontWeight = "bold";
    container.parentElement.insertBefore(counter, container);
  }

  // Grid layout (3 columns)
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "1fr 1fr 1fr";
  grid.style.gap = "15px";

  Object.entries(data.skills).forEach(([category, skills]) => {

    const col = document.createElement("div");
    col.className = "skill-column";

    const title = document.createElement("h3");
    title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    title.style.textAlign = "center";
    col.appendChild(title);

    skills.forEach(skill => {

      const row = document.createElement("div");
      row.className = "skill-row";

      // ✅ calculate once
      const base = state.skills[skill] || 0;
      const bonus = getTotalSkillBonus(skill);

      // LABEL
      const label = document.createElement("span");
      label.className = "skill-label";

      if(bonus > 0){
        label.innerHTML = `${skill} <span style="color:#8f2e8f;">(Bonus)</span>`;
        label.style.color = "#8f2e8f";
        label.style.fontWeight = "bold";
      } else {
        label.textContent = skill;
      }

      // VALUE
      const value = document.createElement("span");
      value.className = "skill-value";
      value.textContent = base + bonus;

      if(bonus > 0){
        value.style.color = "#8f2e8f";
        value.style.fontWeight = "bold";
      }
      const minus = document.createElement("button");
      minus.textContent = "-";
      minus.className = "skill-btn";

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.className = "skill-btn";

      minus.onclick = () => {
        const current = state.skills[skill] || 0;
        if(current <= 0) return;
        state.skills[skill] = current - 1;
        loadSkills();
      };
      plus.onclick = () => {
        const base = state.skills[skill] || 0;
        const bonus = getTotalSkillBonus(skill);

        const displayedLevel = base + bonus;

        if(displayedLevel >= 10) return;

        const nextCost = displayedLevel + 1; // ✅ FIXED
        const remaining = getSkillPoints() - getUsedSkillPoints();

        if(!state.mtMode && remaining < nextCost) return;

        state.skills[skill] = base + 1;
        loadSkills();
      };

      row.appendChild(label);
      row.appendChild(minus);
      row.appendChild(value);
      row.appendChild(plus);

      col.appendChild(row);
    });

    grid.appendChild(col);
  });

  container.appendChild(grid);

  updateSkillCounter();
}



function updateSkillCounter(){
  const counter = document.getElementById("skillCounter");
  if(counter){
    counter.textContent =
      `Skill Points: ${getUsedSkillPoints()}/${getSkillPoints()}`;
  }
}

function getAbilityUpgradeLimit(){
  if(rankState.rank >= 5) return 2;
  if(rankState.rank >= 3) return 1;
  return 0;
}

function loadAbilityUpgrades(){
// Remove old upgrade section if it exists
  const old = document.getElementById("upgradeWrapper");
  if (old) old.remove();
  const ability = state.ability;
  if(!ability) return;

  const upgrades = data.abilityUpgrades?.[ability];
  if(!upgrades) return;

  // Only show at rank 3+
  if(rankState.rank < 3) return;

  const container = document.getElementById("cardContainer");

  const wrapper = document.createElement("div");
  wrapper.id = "upgradeWrapper"; // important so we can delete it later
  wrapper.style.marginTop = "15px";

  const title = document.createElement("h3");
  title.textContent = "Ability Upgrades";
  wrapper.appendChild(title);

  upgrades.forEach(u => {

    const div = document.createElement("div");
    div.className = "card upgrade";
    div.textContent = u.name;

    if(state.abilityUpgrades.includes(u.name)){
      div.classList.add("selected");
    }

    div.onclick = () => {

      const limit = getAbilityUpgradeLimit();
      const selected = state.abilityUpgrades.includes(u.name);

      if(selected){
        state.abilityUpgrades =
          state.abilityUpgrades.filter(x => x !== u.name);
      } else {
        if(limit === 0) return;
        if(state.abilityUpgrades.length >= limit) return;

        state.abilityUpgrades.push(u.name);
      }

      updateDisplay(state.ability, data.ability[state.ability], "ability");
      loadAbilityUpgrades(); 
   };

    wrapper.appendChild(div);
  });

  container.appendChild(wrapper);
}

/* ================= TECHNIQUES ================= */

function canUseTechnique(t){
  const stats = getStats();
  const prof = getProfessionStats();
  // Pack techniques require Summon first
  if(t.type === "pack" && t.name !== "Summon"){
    if(!state.techniques.includes("Summon") && !hasFreeSummon()){
      return false;
    }
  }

  // 1) trait requirements
  if(!meetsRequirements(stats, t.req)) return false;
  if(!meetsAffluenceAccess(prof, t)) return false;
  return true;
}

function loadTechniques(){

  const container = document.getElementById("cardContainer");
  container.innerHTML = "";
  updateFreeStrike(); // ✅ ensure correct state on load
// Auto-add Summon for Terran
  if(hasFreeSummon() && !state.techniques.includes("Summon")){
    state.techniques.push("Summon");
  }

  let counter = document.getElementById("techniqueCounter");
  if (!counter) {
    counter = document.createElement("div");
    counter.id = "techniqueCounter";
    counter.style.marginBottom = "10px";
    counter.style.fontWeight = "bold";
    container.parentElement.insertBefore(counter, container);
  }

  Object.keys(data.techniques).forEach(type => {

    data.techniques[type].forEach(t => {

      const div = document.createElement("div");
      div.className = "card technique " + type;
      if (state.techniques.includes(t.name)) {
      div.classList.add("selected");}

      let locked = !canUseTechnique(t);
      // Prevent manual selection of -strike (auto-managed)
      // -strike is auto-managed but should NEVER appear locked
      if(t.name === "-strike"){
        locked = false;
      }
      // Terran keeps Summon permanently
      if(hasFreeSummon() && t.name === "Summon"){
        locked = true;
      }

      if(locked) div.classList.add("locked");

      let reqText = `Affluence: ${t.affluence}\nAccess: ${t.access}`;

// Show Summon requirement for pack techniques
      if(t.type === "pack" && t.name !== "Summon"){
        reqText += `\nRequires: Summon`;
      }

      if(t.req){
        for(const k in t.req){
          reqText += `\n${k}: > ${t.req[k]}`;
        }
      }
      div.setAttribute("data-tooltip", reqText);
      div.textContent = t.name;

div.onclick = () => {
  if(t.name === "-strike") return; // prevent manual toggle
  if(locked) return;

  const limit = getTechniqueLimit();
  const alreadySelected = state.techniques.includes(t.name);

  // Count WITHOUT free Summon
  const count = state.techniques.filter(x => 
    !(hasFreeSummon() && x === "Summon") &&
    x !== "-strike" // ✅ exclude strike
  ).length;

  if (!alreadySelected && count >= limit) {
    return; // ❌ stop selecting beyond limit
  }

  if(alreadySelected){

  // Remove clicked technique
    state.techniques = state.techniques.filter(x => x !== t.name);
    div.classList.remove("selected");

  // If Summon is removed → remove ALL other pack techniques
    if(t.name === "Summon"){
      state.techniques = state.techniques.filter(x => {
        const tech = Object.values(data.techniques).flat().find(tt => tt.name === x);
        return tech?.type !== "pack";
      });
    }
  } else {
    state.techniques.push(t.name);
    div.classList.add("selected");
  }

  updateFreeStrike(); // ✅ ADD THIS LINE

  updateTechniqueDisplay();
  updateTechniqueCounter();
  loadTechniques(); // refresh unlocks pack techniques instantly
};

  function updateTechniqueCounter(){
    const limit = getTechniqueLimit();

    const current = state.techniques.filter(x => 
      !(hasFreeSummon() && x === "Summon") &&
      x !== "-strike" // ✅ exclude strike
    ).length;

    const counter = document.getElementById("techniqueCounter");
    if(counter){
      counter.textContent = `Selected Techniques ${current}/${limit}`;
    }
  }
      container.appendChild(div);
    });
  });

updateTechniqueDisplay();
updateTechniqueCounter();
}

function updateTechniqueDisplay(){

  if(steps[step] !== "techniques") return;

  let html = "<h2>Techniques</h2>";

  if(state.techniques.length === 0){
    html += "<p>No techniques selected.</p>";
  } else {

    Object.keys(data.techniques).forEach(type => {

      const selected = data.techniques[type].filter(t =>
        state.techniques.includes(t.name)
      );

      if(selected.length === 0) return;

      html += `<h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>`;

      selected.forEach(t => {
        html += `
          <p><strong>${t.name}</strong></p>
          <p>${t.extra || ""}</p>
          <hr>
        `;
      });
    });
  }

  document.getElementById("loreBox").innerHTML = html;
}

/* ================= STATS ================= */

function updateStats(){

  if(steps[step] !== "traits") return;

  const t = state.traits;
  const val = x => {
    const base = parseInt(t[x]) || 0;
    const bonus = state.mtMode ? (state.mtTraitBonus[x] || 0) : 0;
    const cyberBonus = getCyberTraitBonus(x);
    return base + bonus + cyberBonus;
  };

  const Presence = val("Charisma") + val("Manipulation");
  const Physicality = val("Power") + val("Agility");
  const Intellect = val("Wit") + val("Recall");
  const Fortitude = val("Will") + val("Endurance");
  const Reflexes = val("Agility") + val("Wit");
  const Charm = val("Charisma") + val("Wit");
  const PhysIntimidation = val("Power") + val("Manipulation");
  const Leadership = val("Charisma") + val("Recall");

  const CombatAwareness = Reflexes;
  const MaxStamina = Math.max(1, (val("Will") + val("Endurance")));
  const Speed = Math.max(2, Physicality * 5);
  const CoreVitality = 10;
  const cvRemaining = computeCyberTotals().cvRemaining;

  document.getElementById("traitsStatsBox").innerHTML = `
    <strong>Combined Traits</strong><br>
    Presence: ${Presence}<br>
    Physicality: ${Physicality}<br>
    Intellect: ${Intellect}<br>
    Fortitude: ${Fortitude}<br>
    Reflexes: ${Reflexes}<br>
    Charm: ${Charm}<br>
    Physical Intimidation: ${PhysIntimidation}<br>
    Leadership: ${Leadership}<br>
    Combat Awareness: ${CombatAwareness}<br>
    Max Stamina: ${MaxStamina}<br>
    Max Health: ${MaxHealth}<br>
    Speed: ${Speed}<br>
    Core Vitality: ${cvRemaining}

  `;

  if(steps[step] === "techniques"){
    loadTechniques();
  }
}

function getStats(){

  const t = state.traits;
  const val = x => {
    const base = parseInt(t[x]) || 0;
    const bonus = state.mtMode ? (state.mtTraitBonus[x] || 0) : 0;
    const cyberBonus = getCyberTraitBonus(x);
    return base + bonus + cyberBonus;
  };
  return {
    Will: val("Will"),
    Endurance: val("Endurance"),
    Agility: val("Agility"),
    Power: val("Power"),
    Wit: val("Wit"),
    Charisma: val("Charisma"),
    Manipulation: val("Manipulation"),
    Recall: val("Recall"),

    Fortitude: val("Will") + val("Endurance"),
    Physicality: val("Power") + val("Agility"),
    Reflexes: val("Agility") + val("Wit"),
    Intellect: val("Wit") + val("Recall"),
    Leadership: val("Charisma") + val("Recall"),
    Charm: val("Charisma") + val("Wit"),
    CombatAwareness: val("Agility") + val("Wit")
  };
}

function hasFreeSummon(){
  return state.race === "Terran" ||
    (state.race === "Dirgan" && state.hostRace === "Terran");
}

function hasElementalTechnique(){
  const elements = ["Aero","Terra","Lumino","Hydro","Bio","Cryo","Pyro","Electro","Psycho"];
  return state.techniques.some(t => elements.includes(t));
}



function updateFreeStrike(){

  const hasElement = hasElementalTechnique();
  const hasStrike = state.techniques.includes("-strike");

  if(hasElement && !hasStrike){
    state.techniques.push("-strike");
  }

  // Remove -strike ONLY if:
  // - no elements exist
  // - AND it wasn't manually selected (we enforce auto-only behavior)
  if(!hasElement && hasStrike){
    state.techniques = state.techniques.filter(t => t !== "-strike");
  }
}

function getTechniqueLimit(){
  const recall = getStats().Recall || 0;
  return Math.max(1, recall);
}

function getProfessionStats(){

  if(state.mtMode){
    return {
      affluence: state.mtAffluence ?? 10,
      access: state.mtAccess ?? 10
    };
  }

  const prof = state.profession;
  const rank = rankState.rank;

  if(!prof) return {affluence:0, access:0};

  return professionRankStats[prof]?.[rank] || {affluence:0, access:0};
}

function loadProfessionSkillChoice(){

  const container = document.getElementById("cardContainer");
  // ❌ remove old dropdown if it exists
  const old = document.getElementById("professionSkillWrapper");
  if(old) old.remove();

  const profData = data.professionSkills[state.profession];
  if(!profData) return;

  let choices = [];

  if(Array.isArray(profData.choice)){
    choices = profData.choice;
  } else {
    // category-based choice
    choices = data.skills[profData.choice];
  }

  const wrapper = document.createElement("div");
  wrapper.id = "professionSkillWrapper";
  wrapper.style.marginTop = "10px";

  const label = document.createElement("div");
  label.textContent = "Choose Bonus Skill:";
  wrapper.appendChild(label);

  const select = document.createElement("select");

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "-- Select --";
  select.appendChild(defaultOpt);

  choices.forEach(skill=>{
    const opt = document.createElement("option");
    opt.value = skill;
    opt.textContent = skill;
    if(state.professionChoice === skill){
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  select.onchange = () => {
    state.professionChoice = select.value;
    applyProfessionSkills();
  };

  wrapper.appendChild(select);
  container.appendChild(wrapper);

  applyProfessionSkills();
}

function applyProfessionSkills(){

  const prof = state.profession;
  if(!prof) return;

  const profData = data.professionSkills[prof];
  if(!profData) return;

  let skills = [...profData.fixed];

  if(state.professionChoice){
    skills.push(state.professionChoice);
  }

  state.professionSkills = skills;
}
/* ================= RANK ================= */

function updateRank() {

  rankState.rank = parseInt(document.getElementById("rankSelect").value);

  const selected = state.profession;
  if (!selected) return;

  const item = data.profession[selected];
  updateDisplay(selected, item, "profession");
}

function updateDisplay(name, item, type) {
  const image = document.getElementById("displayImage");
  if(item.img){
    image.src = item.img;
  }
  if(type === "ability") {
    document.getElementById("loreBox").innerHTML = renderAbilityLoreHtml(name, item, false);
    return;
  }

  if (type === "profession") {
    document.getElementById("loreBox").innerHTML = renderProfessionLoreHtml(name, item);
    return;
  }

  if (type === "race") {
    document.getElementById("loreBox").innerHTML = renderRaceLoreHtml(name, item);
    return;
  }

  if(type === "technique" || type === "weapon" || type === "armor") {
    document.getElementById("loreBox").innerHTML = `
      <h2>${name}</h2>
      <p>${item.desc}</p>
    `;
    return;
  }

  document.getElementById("loreBox").innerHTML = `
    <h2>${name}</h2>
    <p>${item.desc || "No description available."}</p>
  `;
}


/* ================= NAVIGATION ================= */

function nextStep(){
  if(step < steps.length - 1){
    step++;
    loadStep();
    updatePrintButton(); // 👈 ADD THIS
  }
}

function prevStep(){
  if(step > 0){
    step--;
    loadStep();
    updatePrintButton(); // 👈 ADD THIS
  }
}

function updateTechniqueCounter(){
  const limit = getTechniqueLimit();
  const current = state.techniques.filter(x => !(hasFreeSummon() && x === "Summon")).length;

  const counter = document.getElementById("techniqueCounter");
  if(counter){
    counter.textContent = `Selected Techniques ${current}/${limit}`;
  }
}


function loadWeapons(){

  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  Object.entries(data.weapons).forEach(([type, list]) => {

    list.forEach(w => {

      if(!canUseWeapon(w)) return;

      const div = document.createElement("div");
      div.className = "card weapon " + type;
      div.textContent = w.name;

      if(state.weapons[type] === w.name){
        div.classList.add("selected");
      }

      div.onclick = () => {

        state.weapons[type] = (state.weapons[type] === w.name) ? null : w.name;

        loadWeapons();
        updateWeaponDisplay();
      };

      container.appendChild(div);
    });
  });

  updateWeaponDisplay();
}

function canUseWeapon(w){
  const stats = getStats();
  const prof = getProfessionStats();
  if(!meetsRequirements(stats, w.req)) return false;
  if(!meetsAffluenceAccess(prof, w)) return false;
  return true;
}

function updateWeaponDisplay(){
  let html = "<h2>Weapons</h2>";
  Object.entries(state.weapons).forEach(([type, name]) => {
    if(!name) return;
    const w = data.weapons[type].find(x => x.name === name);
    html += `
      <p><strong>${w.name}</strong> (${type})</p>
      <div style="display: flex; gap: 15px;">
        <span><strong>Attack:</strong> ${w.attack}</span>
        <span><strong>Damage:</strong> ${w.damage}</span>
        <p> ${w.properties}</p>
      </div>
      <hr>
    `;
  });
  if(html === "<h2>Weapons</h2>"){
    html += "<p>No weapon selected.</p>";
  }
  document.getElementById("loreBox").innerHTML = html;
}

function loadArmor(){

  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  Object.entries(data.armor).forEach(([type, list]) => {

    list.forEach(a => {

      if(!canUseArmor(a)) return;

      const div = document.createElement("div");
      let styleClass = "";
      if(type === "armor") styleClass = "armor-main";
      if(type === "shield") styleClass = "armor-shield";
      if(type === "cloak") styleClass = "armor-cloak";
      div.className = "card armor " + styleClass;



      div.textContent = a.name;

      if(state.armor[type] === a.name){
        div.classList.add("selected");
      }

      div.onclick = () => {

        state.armor[type] =
          (state.armor[type] === a.name) ? null : a.name;

        loadArmor();
        updateArmorDisplay();
      };

      container.appendChild(div);
    });
  });

  updateArmorDisplay();
}


function canUseArmor(a){
  const stats = getStats();
  const prof = getProfessionStats();
  if(!meetsRequirements(stats, a.req)) return false;
  if(!meetsAffluenceAccess(prof, a)) return false;
  return true;
}


function updateArmorDisplay(){
  let html = "<h2>Armor</h2>";
  Object.entries(state.armor).forEach(([type, name]) => {
    if(!name) return;
    const a = data.armor[type].find(x => x.name === name);
    html += `
      <p><strong>${a.name}</strong> (${type})</p>
      <div style="display: flex; gap: 15px;">
        <span><strong>Dodge:</strong> ${a.dodge}</span>
        <span><strong>Deflect:</strong> ${a.deflect}</span>
        <span><strong>Soak:</strong> ${a.soak}</span>
      </div>
      <hr>
    `;
  });
  if(html === "<h2>Armor</h2>"){
    html += "<p>No armor selected.</p>";
  }
  document.getElementById("loreBox").innerHTML = html;
}

function loadMimicProfessionChoice(){

  const container = document.getElementById("cardContainer");

  // Remove old dropdown if it exists
  const old = document.getElementById("mimicWrapper");
  if(old) old.remove();

  // Only show if Agent is selected
  if(state.profession !== "Agent") return;

  const wrapper = document.createElement("div");
  wrapper.id = "mimicWrapper";
  wrapper.style.marginTop = "10px";

  const label = document.createElement("div");
  label.textContent = "Profession to Mimic:";
  wrapper.appendChild(label);

  const select = document.createElement("select");

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "-- Select --";
  select.appendChild(defaultOpt);

  // Add all professions EXCEPT Agent
  Object.keys(data.profession).forEach(prof => {
    if(prof === "Agent") return;

    const opt = document.createElement("option");
    opt.value = prof;
    opt.textContent = prof;

    if(state.mimicProfession === prof){
      opt.selected = true;
    }

    select.appendChild(opt);
  });

  select.onchange = () => {
    state.mimicProfession = select.value;
    const item = data.profession[state.profession];
    updateDisplay(state.profession, item, "profession");
  };

  wrapper.appendChild(select);
  container.appendChild(wrapper);
}

function loadHostRaceChoice(){

  const container = document.getElementById("cardContainer");

  // Remove old dropdown if it exists
  const old = document.getElementById("hostRaceWrapper");
  if(old) old.remove();

  // Only show if Dirgan is selected
  if(state.race !== "Dirgan") return;

  const wrapper = document.createElement("div");
  wrapper.id = "hostRaceWrapper";
  wrapper.style.marginTop = "10px";

  const label = document.createElement("div");
  label.textContent = "Choose Host Race:";
  wrapper.appendChild(label);

  const select = document.createElement("select");

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "-- Select --";
  select.appendChild(defaultOpt);

  // Add all races EXCEPT Dirgan
  Object.keys(data.race).forEach(r => {
    if(r === "Dirgan") return;

    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;

    if(state.hostRace === r){
      opt.selected = true;
    }

    select.appendChild(opt);
  });

  select.onchange = () => {
    state.hostRace = select.value;

    // 🔥 refresh lore
    const item = data.race[state.race];
    updateDisplay(state.race, item, "race");
  };

  wrapper.appendChild(select);
  container.appendChild(wrapper);
}

function toggleMTMode(){
  const toggle = document.getElementById("mtToggle");
  state.mtMode = toggle.checked;

  // Reload current step so rules update instantly
  loadStep();
}

function loadMTOverrides(){

  if(!state.mtMode) return;

  const container = document.getElementById("cardContainer");

  const wrapper = document.createElement("div");
  wrapper.style.marginBottom = "10px";

  const affSelect = document.createElement("select");
  const accSelect = document.createElement("select");

  for(let i=0;i<=10;i++){
    const opt1 = document.createElement("option");
    opt1.value = i;
    opt1.textContent = `Affluence ${i}`;
    affSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = i;
    opt2.textContent = `Access ${i}`;
    accSelect.appendChild(opt2);
  }

  affSelect.value = state.mtAffluence ?? 0;
  accSelect.value = state.mtAccess ?? 0;

  affSelect.onchange = () => {
    state.mtAffluence = parseInt(affSelect.value);
    loadStep();
  };

  accSelect.onchange = () => {
    state.mtAccess = parseInt(accSelect.value);
    loadStep();
  };

  wrapper.appendChild(affSelect);
  wrapper.appendChild(accSelect);

  container.prepend(wrapper);
}

function loadMTTraitBonus(){

  if(!state.mtMode) return;

  const container = document.getElementById("traitsSection");

  const wrapper = document.createElement("div");
  wrapper.style.marginTop = "15px";

  const title = document.createElement("h3");
  title.textContent = "MT Trait Bonuses";
  wrapper.appendChild(title);

  data.traits.forEach(trait => {

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "10px";
    row.style.marginBottom = "5px";

    const label = document.createElement("span");
    label.textContent = trait;
    label.style.width = "120px";

    const input = document.createElement("input");
    input.type = "number";
    input.value = state.mtTraitBonus[trait] ?? 0;
    input.style.width = "60px";

    input.onchange = () => {
      state.mtTraitBonus[trait] = parseInt(input.value) || 0;
      updateStats();
    };

    row.appendChild(label);
    row.appendChild(input);
    wrapper.appendChild(row);
  });

  container.appendChild(wrapper);
}


function updatePrintButton() {
  const btn = document.getElementById("printBtn");
  if(!btn) return;

  if (steps[step] === "summary") {
    btn.style.display = "inline-block";
  } else {
    btn.style.display = "none";
  }
}

/* ================= Armor ================= */
function getDeflectTierIndex(die){
  return DEFLECT_TIERS.indexOf(die);
}

function getDeflectFromTier(index){
  return DEFLECT_TIERS[Math.min(index, DEFLECT_TIERS.length - 1)];
}

function getArmorTotals(){

  let dodgeMod = 0;
  let soak = 0;

  let baseDeflectIndex = -1; // start with nothing
  let tierBonus = 0;

  // ========= ARMOR + SHIELD + CLOAK =========
  const equippedArmor = [
    state.armor.armor,
    state.armor.shield,
    state.armor.cloak
  ];

  equippedArmor.forEach(name => {
    if(!name) return;

    const piece =
      data.armor.armor.find(a => a.name === name) ||
      data.armor.shield.find(a => a.name === name) ||
      data.armor.cloak.find(a => a.name === name);

    if(!piece) return;

    // DODGE
    dodgeMod += piece.dodge || 0;

    // SOAK
    soak += piece.soak || 0;

    // DEFLECT BASE (armor sets base)
    if(piece.deflect && piece.deflect.includes("d")){
      const index = getDeflectTierIndex(piece.deflect);
      if(index > baseDeflectIndex){
        baseDeflectIndex = index;
      }
    }

    // DEFLECT BONUS (shield tiers)
    if(piece.deflect && piece.deflect.includes("Tier")){
      const amount = parseInt(piece.deflect);
      tierBonus += amount;
    }
  });

  soak += getCyberSoakBonus();

  // ========= WEAPON BONUS (Parry Dagger) =========
  if(state.weapons.melee === "Parry Dagger"){
    tierBonus += 1;
  }

  // ========= FINAL DEFLECT =========
  let finalDeflect = "None";

  if(baseDeflectIndex >= 0){
    const finalIndex = baseDeflectIndex + tierBonus;
    finalDeflect = getDeflectFromTier(finalIndex);
  }

  return {
    dodge: 10 + getStats().Reflexes + dodgeMod,
    soak: soak,
    deflect: finalDeflect
  };
}

function meetsRequirements(stats, req){
  if(!req || typeof req !== "object") return true;
  for(const key in req){
    if((stats[key] || 0) < req[key]) return false;
  }
  return true;
}

function meetsAffluenceAccess(prof, item){
  if(!item) return false;
  if(prof.affluence < (item.affluence ?? 0)) return false;
  if(prof.access < (item.access ?? 0)) return false;
  return true;
}


/* ================= DOSSIER PDF ================= */

function fitCanvasToA4(canvas) {
  const pageW = 210;
  const pageH = 297;
  const srcW = canvas.width;
  const srcH = canvas.height;
  const srcRatio = srcW / srcH;
  const pageRatio = pageW / pageH;
  let destW;
  let destH;
  let x;
  let y;
  if (srcRatio > pageRatio) {
    destW = pageW;
    destH = pageW / srcRatio;
    x = 0;
    y = (pageH - destH) / 2;
  } else {
    destH = pageH;
    destW = pageH * srcRatio;
    x = (pageW - destW) / 2;
    y = 0;
  }
  return { x, y, destW, destH };
}

async function printCharacterSheet() {
  const pages = document.querySelectorAll("#summaryPage .sheet-page");
  if (!pages.length) return;

  if (typeof html2canvas === "undefined") {
    alert("Could not load html2canvas (check your network and try again).");
    return;
  }
  const jspdf = window.jspdf;
  if (!jspdf || !jspdf.jsPDF) {
    alert("Could not load jsPDF (check your network and try again).");
    return;
  }

  const btn = document.getElementById("dossierPdfBtn");
  const prevText = btn ? btn.textContent : "";
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Generating…";
  }

  try {
    const { jsPDF } = jspdf;
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true
    });

    for (let i = 0; i < pages.length; i++) {
      const el = pages[i];
      let canvas;
      try {
        el.style.setProperty("background-image", "none", "important");
        el.style.setProperty("background-color", "#f8f4eb", "important");
        canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: "#f8f4eb"
        });
      } finally {
        el.style.removeProperty("background-image");
        el.style.removeProperty("background-color");
      }

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const { x, y, destW, destH } = fitCanvasToA4(canvas);

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", x, y, destW, destH);
    }

    const slug = (state.profession || "character")
      .toString()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/gi, "")
      .toLowerCase() || "character";
    pdf.save(`dark-forest-dossier-${slug}.pdf`);
  } catch (e) {
    console.error(e);
    alert(
      "Could not create PDF. Try a local web server (not file://) so assets load with proper security rules.\n\n" +
        (e && e.message ? e.message : String(e))
    );
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = prevText || "Download PDF";
    }
  }
}


/* ================= INIT ================= */
loadStep();
updatePrintButton(); // 👈 ADD THIS
