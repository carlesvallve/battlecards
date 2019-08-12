
// ================ cards =================

/*
// modifiers
- +1
- +2
- +3
- 1-3
- 1-5
- 1-10

// equipment
- weapon: add N attacks with bonuses
- shield: block N attacks
- helmet
- boots
- armour



// spells

// potions
- gain hp (15, 30, full, double)
- gain ep (15, 30, full, double)

// playables
- reshuffle hand
- 
*/

const cardMaxRarity = 5;

const cards = {
  //gangs
  crips: { rarity: 1, unlockLevel: 1, image: 'gangs/1.png' },
  bloods: { rarity: 2, unlockLevel: 1, image: 'gangs/2.png' },
  latinKings: { rarity: 3, unlockLevel: 1, image: 'gangs/3.png' },
  mob: { rarity: 4, unlockLevel: 1, image: 'gangs/4.png' },
  yakuza: { rarity: 5, unlockLevel: 1, image: 'gangs/5.png' },
  ms13: { rarity: 2, unlockLevel: 1, image: 'gangs/6.png' },
  badBarbies: { rarity: 3, unlockLevel: 1, image: 'gangs/7.png' },
  brotherhood: { rarity: 3, unlockLevel: 1, image: 'gangs/8.png' },
  sonsOfChaos: { rarity: 4, unlockLevel: 1, image: 'gangs/9.png' },

  // doctor
  firstAid: { rarity: 1, unlockLevel: 1, image: 'doctor/1.png' },
  booster: { rarity: 2, unlockLevel: 1, image: 'doctor/2.png' },
  bandAid: { rarity: 3, unlockLevel: 1, image: 'doctor/3.png' },
  redOrBlue: { rarity: 4, unlockLevel: 1, image: 'doctor/4.png' },
  syringe: { rarity: 5, unlockLevel: 1, image: 'doctor/5.png' },
  bandage: { rarity: 2, unlockLevel: 1, image: 'doctor/6.png' },
  aspirine: { rarity: 3, unlockLevel: 1, image: 'doctor/7.png' },
  syrup: { rarity: 3, unlockLevel: 1, image: 'doctor/8.png' },
  capsule: { rarity: 4, unlockLevel: 1, image: 'doctor/9.png' },

  // streetfight
  axe: { rarity: 1, unlockLevel: 1, image: 'streetfight/1.png' },
  stick: { rarity: 2, unlockLevel: 1, image: 'streetfight/2.png' },
  crawbar: { rarity: 3, unlockLevel: 1, image: 'streetfight/3.png' },
  bat: { rarity: 4, unlockLevel: 1, image: 'streetfight/4.png' },
  knife: { rarity: 5, unlockLevel: 1, image: 'streetfight/5.png' },
  pipe: { rarity: 2, unlockLevel: 1, image: 'streetfight/6.png' },
  pocketKnife: { rarity: 3, unlockLevel: 1, image: 'streetfight/7.png' },
  backsword: { rarity: 4, unlockLevel: 1, image: 'streetfight/8.png' },
  razor: { rarity: 3, unlockLevel: 1, image: 'streetfight/9.png' },

  // drinks
  grog: { rarity: 1, unlockLevel: 1, image: 'drinks/1.png' },
  beer: { rarity: 2, unlockLevel: 1, image: 'drinks/2.png' },
  brandy: { rarity: 3, unlockLevel: 1, image: 'drinks/3.png' },
  opener: { rarity: 4, unlockLevel: 1, image: 'drinks/4.png' },
  flask: { rarity: 5, unlockLevel: 1, image: 'drinks/5.png' },
  milk: { rarity: 2, unlockLevel: 1, image: 'drinks/6.png' },
  sevenup: { rarity: 3, unlockLevel: 1, image: 'drinks/7.png' },
  water: { rarity: 3, unlockLevel: 1, image: 'drinks/8.png' },
  tomatoSoup: { rarity: 4, unlockLevel: 1, image: 'drinks/9.png' },

  // valentine
  flyingHeart: { rarity: 1, unlockLevel: 1, image: 'valentine/1.png' },
  roses: { rarity: 2, unlockLevel: 1, image: 'valentine/2.png' },
  chocolateBox: { rarity: 3, unlockLevel: 1, image: 'valentine/3.png' },
  pinkBow: { rarity: 4, unlockLevel: 1, image: 'valentine/4.png' },
  leftHeart: { rarity: 5, unlockLevel: 1, image: 'valentine/5.png' },
  rightHeart: { rarity: 2, unlockLevel: 1, image: 'valentine/6.png' },
  weddingRing: { rarity: 3, unlockLevel: 1, image: 'valentine/7.png' },
  loveLetter: { rarity: 3, unlockLevel: 1, image: 'valentine/8.png' },
  pillowHeart: { rarity: 4, unlockLevel: 1, image: 'valentine/9.png' },

  // tools
  spatula: { rarity: 1, unlockLevel: 1, image: 'tools/1.png' },
  screw: { rarity: 2, unlockLevel: 1, image: 'tools/2.png' },
  hammer: { rarity: 3, unlockLevel: 1, image: 'tools/3.png' },
  tape: { rarity: 4, unlockLevel: 1, image: 'tools/4.png' },
  saw: { rarity: 5, unlockLevel: 1, image: 'tools/5.png' },
  rake: { rarity: 2, unlockLevel: 1, image: 'tools/6.png' },
  nail: { rarity: 3, unlockLevel: 1, image: 'tools/7.png' },
  spring: { rarity: 3, unlockLevel: 1, image: 'tools/8.png' },
  wrench: { rarity: 4, unlockLevel: 1, image: 'tools/9.png' },

  // candy
  strawberrySweet: { rarity: 1, unlockLevel: 1, image: 'candy/1.png' },
  sugarBall: { rarity: 2, unlockLevel: 1, image: 'candy/2.png' },
  mints: { rarity: 3, unlockLevel: 1, image: 'candy/3.png' },
  lollypop: { rarity: 4, unlockLevel: 1, image: 'candy/4.png' },
  lemonSweet: { rarity: 5, unlockLevel: 1, image: 'candy/5.png' },
  chocobar: { rarity: 2, unlockLevel: 1, image: 'candy/6.png' },
  chupachups: { rarity: 3, unlockLevel: 1, image: 'candy/7.png' },
  gummies: { rarity: 3, unlockLevel: 1, image: 'candy/8.png' },
  crystal: { rarity: 4, unlockLevel: 1, image: 'candy/9.png' },

  // christmas
  santaHat: { rarity: 1, unlockLevel: 1, image: 'christmas/1.png' },
  toyBox: { rarity: 2, unlockLevel: 1, image: 'christmas/2.png' },
  greenBall: { rarity: 3, unlockLevel: 1, image: 'christmas/3.png' },
  candyStick: { rarity: 4, unlockLevel: 1, image: 'christmas/4.png' },
  christmasTree: { rarity: 5, unlockLevel: 1, image: 'christmas/5.png' },
  snowman: { rarity: 2, unlockLevel: 1, image: 'christmas/6.png' },
  redBall: { rarity: 3, unlockLevel: 1, image: 'christmas/7.png' },
  snowBall: { rarity: 3, unlockLevel: 1, image: 'christmas/8.png' },
  christmasPresent: { rarity: 4, unlockLevel: 1, image: 'christmas/9.png' },

  // guns
  badassKnife: { rarity: 1, unlockLevel: 1, image: 'guns/1.png' },
  revolver: { rarity: 3, unlockLevel: 1, image: 'guns/2.png' },
  beretta: { rarity: 2, unlockLevel: 1, image: 'guns/3.png' },
  shotgun: { rarity: 4, unlockLevel: 1, image: 'guns/4.png' },
  sniperRifle: { rarity: 5, unlockLevel: 1, image: 'guns/5.png' },
  goldRevolver: { rarity: 2, unlockLevel: 1, image: 'guns/6.png' },
  glowingGun: { rarity: 3, unlockLevel: 1, image: 'guns/7.png' },
  ak47: { rarity: 3, unlockLevel: 1, image: 'guns/8.png' },
  rpg7: { rarity: 4, unlockLevel: 1, image: 'guns/9.png' },

  // fastfood
  burger: { rarity: 1, unlockLevel: 1, image: 'fastfood/1.png' },
  fries: { rarity: 3, unlockLevel: 1, image: 'fastfood/2.png' },
  friedRice: { rarity: 2, unlockLevel: 1, image: 'fastfood/3.png' },
  pizza: { rarity: 4, unlockLevel: 1, image: 'fastfood/4.png' },
  icecream: { rarity: 5, unlockLevel: 1, image: 'fastfood/5.png' },
  taco: { rarity: 2, unlockLevel: 1, image: 'fastfood/6.png' },
  snacks: { rarity: 3, unlockLevel: 1, image: 'fastfood/7.png' },
  latte: { rarity: 3, unlockLevel: 1, image: 'fastfood/8.png' },
  hotdog: { rarity: 4, unlockLevel: 1, image: 'fastfood/9.png' },

  // ammo
  b9mm: { rarity: 1, unlockLevel: 1, image: 'ammo/1.png' },
  b380: { rarity: 3, unlockLevel: 1, image: 'ammo/2.png' },
  b308: { rarity: 2, unlockLevel: 1, image: 'ammo/3.png' },
  b40sw: { rarity: 4, unlockLevel: 1, image: 'ammo/4.png' },
  b762mm: { rarity: 5, unlockLevel: 1, image: 'ammo/5.png' },
  b12ga: { rarity: 2, unlockLevel: 1, image: 'ammo/6.png' },
  b30carbine: { rarity: 3, unlockLevel: 1, image: 'ammo/7.png' },
  birdShot: { rarity: 3, unlockLevel: 1, image: 'ammo/8.png' },
  armourPiercing: { rarity: 4, unlockLevel: 1, image: 'ammo/9.png' },

  // bodyChop
  skull: { rarity: 1, unlockLevel: 1, image: 'bodyChop/1.png' },
  finger: { rarity: 3, unlockLevel: 1, image: 'bodyChop/2.png' },
  jaw: { rarity: 2, unlockLevel: 1, image: 'bodyChop/3.png' },
  eyeballs: { rarity: 4, unlockLevel: 1, image: 'bodyChop/4.png' },
  tooth: { rarity: 5, unlockLevel: 1, image: 'bodyChop/5.png' },
  body: { rarity: 2, unlockLevel: 1, image: 'bodyChop/6.png' },
  blood: { rarity: 3, unlockLevel: 1, image: 'bodyChop/7.png' },
  coffin: { rarity: 3, unlockLevel: 1, image: 'bodyChop/8.png' },
  bone: { rarity: 4, unlockLevel: 1, image: 'bodyChop/9.png' },

  // explosives
  grenade: { rarity: 1, unlockLevel: 1, image: 'explosives/1.png' },
  fragGrenade: { rarity: 3, unlockLevel: 1, image: 'explosives/2.png' },
  stunGrenade: { rarity: 2, unlockLevel: 1, image: 'explosives/3.png' },
  silentGrenade: { rarity: 4, unlockLevel: 1, image: 'explosives/4.png' },
  smokeGrenade: { rarity: 5, unlockLevel: 1, image: 'explosives/5.png' },
  gasGrenade: { rarity: 2, unlockLevel: 1, image: 'explosives/6.png' },
  zippo: { rarity: 3, unlockLevel: 1, image: 'explosives/7.png' },
  matches: { rarity: 3, unlockLevel: 1, image: 'explosives/8.png' },
  dynamite: { rarity: 4, unlockLevel: 1, image: 'explosives/9.png' },

  // prisonCell
  smuggledPackage: { rarity: 1, unlockLevel: 1, image: 'prisonCell/1.png' },
  toothbrush: { rarity: 3, unlockLevel: 1, image: 'prisonCell/2.png' },
  shiv: { rarity: 2, unlockLevel: 1, image: 'prisonCell/3.png' },
  toiletPaper: { rarity: 4, unlockLevel: 1, image: 'prisonCell/4.png' },
  broom: { rarity: 5, unlockLevel: 1, image: 'prisonCell/5.png' },
  bucket: { rarity: 2, unlockLevel: 1, image: 'prisonCell/6.png' },
  shaver: { rarity: 3, unlockLevel: 1, image: 'prisonCell/7.png' },
  prisonFod: { rarity: 3, unlockLevel: 1, image: 'prisonCell/8.png' },
  ropeKnot: { rarity: 4, unlockLevel: 1, image: 'prisonCell/9.png' },

  // mercs
  nightLord: { rarity: 1, unlockLevel: 1, image: 'mercs/1.png' },
  airForce: { rarity: 3, unlockLevel: 1, image: 'mercs/2.png' },
  theEdge: { rarity: 2, unlockLevel: 1, image: 'mercs/3.png' },
  theWisdom: { rarity: 4, unlockLevel: 1, image: 'mercs/4.png' },
  cupcake: { rarity: 5, unlockLevel: 1, image: 'mercs/5.png' },
  theShadow: { rarity: 2, unlockLevel: 1, image: 'mercs/6.png' },
  theButcher: { rarity: 3, unlockLevel: 1, image: 'mercs/7.png' },
  fuckFace: { rarity: 3, unlockLevel: 1, image: 'mercs/8.png' },
  mrChang: { rarity: 4, unlockLevel: 1, image: 'mercs/9.png' },

  // survival
  backpack: { rarity: 1, unlockLevel: 1, image: 'survival/1.png' },
  walkie: { rarity: 3, unlockLevel: 1, image: 'survival/2.png' },
  gloves: { rarity: 2, unlockLevel: 1, image: 'survival/3.png' },
  compass: { rarity: 4, unlockLevel: 1, image: 'survival/4.png' },
  binoculars: { rarity: 5, unlockLevel: 1, image: 'survival/5.png' },
  canteen: { rarity: 2, unlockLevel: 1, image: 'survival/6.png' },
  boots: { rarity: 3, unlockLevel: 1, image: 'survival/7.png' },
  lantern: { rarity: 3, unlockLevel: 1, image: 'survival/8.png' },
  gasMask: { rarity: 4, unlockLevel: 1, image: 'survival/9.png' },

  // vamp
  redHood: { rarity: 1, unlockLevel: 1, image: 'vamp/1.png' },
  bloodGoblet: { rarity: 3, unlockLevel: 1, image: 'vamp/2.png' },
  voodooDoll: { rarity: 2, unlockLevel: 1, image: 'vamp/3.png' },
  gargoyle: { rarity: 4, unlockLevel: 1, image: 'vamp/4.png' },
  deadHand: { rarity: 5, unlockLevel: 1, image: 'vamp/5.png' },
  stake: { rarity: 2, unlockLevel: 1, image: 'vamp/6.png' },
  garlick: { rarity: 3, unlockLevel: 1, image: 'vamp/7.png' },
  bloodCauldron: { rarity: 3, unlockLevel: 1, image: 'vamp/8.png' },
  bandagedFace: { rarity: 4, unlockLevel: 1, image: 'vamp/9.png' },

  // keys
  metalKey: { rarity: 1, unlockLevel: 1, image: 'keys/1.png' },
  oldKey: { rarity: 3, unlockLevel: 1, image: 'keys/2.png' },
  usedKey: { rarity: 2, unlockLevel: 1, image: 'keys/3.png' },
  deskKey: { rarity: 4, unlockLevel: 1, image: 'keys/4.png' },
  boxKey: { rarity: 5, unlockLevel: 1, image: 'keys/5.png' },
  apartmentKey: { rarity: 2, unlockLevel: 1, image: 'keys/6.png' },
  hackerKey: { rarity: 3, unlockLevel: 1, image: 'keys/7.png' },
  carKey: { rarity: 3, unlockLevel: 1, image: 'keys/8.png' },
  lostKey: { rarity: 4, unlockLevel: 1, image: 'keys/9.png' },

  // sports
  soccer: { rarity: 1, unlockLevel: 1, image: 'sports/1.png' },
  blueSkate: { rarity: 3, unlockLevel: 1, image: 'sports/2.png' },
  eightball: { rarity: 2, unlockLevel: 1, image: 'sports/3.png' },
  discoRollers: { rarity: 4, unlockLevel: 1, image: 'sports/4.png' },
  football: { rarity: 5, unlockLevel: 1, image: 'sports/5.png' },
  snowboard: { rarity: 2, unlockLevel: 1, image: 'sports/6.png' },
  basketball: { rarity: 3, unlockLevel: 1, image: 'sports/7.png' },
  motorRacing: { rarity: 3, unlockLevel: 1, image: 'sports/8.png' },
  boxing: { rarity: 4, unlockLevel: 1, image: 'sports/9.png' },
};

export type CardID = keyof typeof cards;
export type Card = (typeof cards)[CardID];
const cardIds: CardID[] = Object.keys(cards) as CardID[];

export default {
  cardIds,
  cards,
  cardMaxRarity,
};

// ======================================================
// getters

export const getCardsArray = (): string[] => {
  return Object.keys(cards);
};
