import { SPRITES } from '../components/mascot/sprites.js';
import { HUB_STICKERS } from '../assets/stickers/index.js';

import witch from '../assets/costumes/witch.png';
import vampire from '../assets/costumes/vampire.png';
import tracksuit from '../assets/costumes/tracksuit.png';
import ballerina from '../assets/costumes/ballerina.png';
import plumber_red from '../assets/costumes/plumber_red.png';
import plumber_green from '../assets/costumes/plumber_green.png';
import ghost from '../assets/costumes/ghost.png';

import sailor_hero from '../assets/costumes/sailor_hero.png';
import electric from '../assets/costumes/electric.png';
import forest_spirit from '../assets/costumes/forest_spirit.png';
import kitty_overalls from '../assets/costumes/kitty_overalls.png';
import cyber_gamer from '../assets/costumes/cyber_gamer.png';
import secret_agent from '../assets/costumes/secret_agent.png';
import detective from '../assets/costumes/detective.png';

import floral_artist from '../assets/costumes/floral_artist.png';
import calavera from '../assets/costumes/calavera.png';
import luchador from '../assets/costumes/luchador.png';
import golden_sari from '../assets/costumes/golden_sari.png';
import flamenco from '../assets/costumes/flamenco.png';
import parisian from '../assets/costumes/parisian.png';
import musketeer from '../assets/costumes/musketeer.png';

import roman_toga from '../assets/costumes/roman_toga.png';
import bunny from '../assets/costumes/bunny.png';
import cow from '../assets/costumes/cow.png';
import bee from '../assets/costumes/bee.png';
import frog from '../assets/costumes/frog.png';
import shark from '../assets/costumes/shark.png';
import dino from '../assets/costumes/dino.png';

import devil from '../assets/costumes/devil.png';
import angel from '../assets/costumes/angel.png';
import black_cat from '../assets/costumes/black_cat.png';
import pirate from '../assets/costumes/pirate.png';
import cowboy from '../assets/costumes/cowboy.png';
import pink_cowgirl from '../assets/costumes/pink_cowgirl.png';
import astronaut from '../assets/costumes/astronaut.png';

import pastel_gamer from '../assets/costumes/pastel_gamer.png';
import wizard_student from '../assets/costumes/wizard_student.png';
import ninja from '../assets/costumes/ninja.png';
import panda from '../assets/costumes/panda.png';
import dark_queen from '../assets/costumes/dark_queen.png';
import punk from '../assets/costumes/punk.png';
import alien from '../assets/costumes/alien.png';

// Newly added & enhanced Kawaii costumes
import kawaii_squid_triangle from '../assets/costumes/kawaii_squid_triangle.png';
import kawaii_squid_square from '../assets/costumes/kawaii_squid_square.png';
import kawaii_squid_circle from '../assets/costumes/kawaii_squid_circle.png';
import kawaii_squid_player from '../assets/costumes/kawaii_squid_player.png';
import kawaii_suit_noir from '../assets/costumes/kawaii_suit_noir.png';
import kawaii_harry_wand from '../assets/costumes/kawaii_harry_wand.png';
import kawaii_wizard_tie from '../assets/costumes/kawaii_wizard_tie.png';
import kawaii_wizard_scarf from '../assets/costumes/kawaii_wizard_scarf.png';
import kawaii_dark_cloak from '../assets/costumes/kawaii_dark_cloak.png';
import kawaii_spider from '../assets/costumes/kawaii_spider.png';
import kawaii_iron from '../assets/costumes/kawaii_iron.png';
import kawaii_captain from '../assets/costumes/kawaii_captain.png';
import kawaii_loki from '../assets/costumes/kawaii_loki.png';
import kawaii_panther from '../assets/costumes/kawaii_panther.png';
import kawaii_explorer from '../assets/costumes/kawaii_explorer.png';
import kawaii_freddy from '../assets/costumes/kawaii_freddy.png';
import kawaii_agent_redtie from '../assets/costumes/kawaii_agent_redtie.png';
import kawaii_karate from '../assets/costumes/kawaii_karate.png';
import kawaii_cossack from '../assets/costumes/kawaii_cossack.png';
import kawaii_mib from '../assets/costumes/kawaii_mib.png';
import kawaii_hazmat from '../assets/costumes/kawaii_hazmat.png';
import kawaii_rogue from '../assets/costumes/kawaii_rogue.png';
import kawaii_king from '../assets/costumes/kawaii_king.png';
import kawaii_queen from '../assets/costumes/kawaii_queen.png';
import kawaii_sailor_boy from '../assets/costumes/kawaii_sailor_boy.png';
import kawaii_panda from '../assets/costumes/kawaii_panda.png';
import kawaii_dragon from '../assets/costumes/kawaii_dragon.png';
import kawaii_unicorn from '../assets/costumes/kawaii_unicorn.png';
import kawaii_ladybug from '../assets/costumes/kawaii_ladybug.png';
import kawaii_devil from '../assets/costumes/kawaii_devil.png';
import kawaii_angel from '../assets/costumes/kawaii_angel.png';

export const MOUSE_BACKGROUNDS = [
  { id: 'sun', hex: '#FFE600', label: 'Sun Yellow' },
  { id: 'pink', hex: '#FDB5D0', label: 'Berry Pink' },
  { id: 'neon', hex: '#00E676', label: 'Neon Mint' },
  { id: 'lilac', hex: '#B89CFF', label: 'Lilac' },
  { id: 'sky', hex: '#5CE1E6', label: 'Sky Cyan' },
  { id: 'orange', hex: '#FF6E2D', label: 'Tangerine' },
  { id: 'cobalt', hex: '#2E5BFF', label: 'Cobalt Blue' },
  { id: 'white', hex: '#FFFFFF', label: 'Crisp White' },
];

// Existing mouse looks used across the hub windows — all FREE
const FREE_CLASSIC_ITEMS = [
  { id: 'plain', name: 'Plain Mouse', img: SPRITES.hello.src, cat: 'classic', free: true },
  { id: 'win_love', name: 'Heart Rattie', img: SPRITES.love.src, cat: 'classic', free: true },
  { id: 'win_wave', name: 'Happy Wave', img: SPRITES.wave.src, cat: 'classic', free: true },
  { id: 'win_think', name: 'Deep Thinker', img: SPRITES.think.src, cat: 'classic', free: true },
  { id: 'win_watch', name: 'Schedule Keeper', img: SPRITES.watch1.src, cat: 'classic', free: true },
  { id: 'win_gift', name: 'Secret Gift', img: SPRITES.gift1.src, cat: 'classic', free: true },
  { id: 'win_mafia', name: 'Killer Agent', img: SPRITES.mafia1.src, cat: 'classic', free: true },
  { id: 'win_oscar', name: 'Oscar Star', img: SPRITES.oscar1.src, cat: 'classic', free: true },
  { id: 'win_guilty', name: 'Punishment Box', img: SPRITES.guilty1.src, cat: 'classic', free: true },
  { id: 'win_2048', name: '2048 Gamer', img: SPRITES.play2048_1.src, cat: 'classic', free: true },
  { id: 'win_gossip', name: 'Gossip Whisper', img: SPRITES.gossip1.src, cat: 'classic', free: true },
  { id: 'win_reflect', name: 'Reflection Sage', img: SPRITES.reflect1.src, cat: 'classic', free: true },
  { id: 'win_thief', name: 'Sneaky Heist', img: SPRITES.thief1.src, cat: 'classic', free: true },
];

// All 42 new separately cut & enhanced costumes — all PAID
const NEW_PAID_ITEMS = [
  // Row 0
  { id: 'witch', name: 'Witch Cloak', img: witch, cat: 'spooky' },
  { id: 'vampire', name: 'Vampire Count', img: vampire, cat: 'spooky' },
  { id: 'tracksuit', name: 'Street Tracksuit', img: tracksuit, cat: 'pop' },
  { id: 'ballerina', name: 'Pink Ballerina', img: ballerina, cat: 'culture' },
  { id: 'plumber_red', name: 'Red Plumber', img: plumber_red, cat: 'pop' },
  { id: 'plumber_green', name: 'Green Plumber', img: plumber_green, cat: 'pop' },
  { id: 'ghost', name: 'Spooky Ghost', img: ghost, cat: 'spooky' },

  // Row 1
  { id: 'sailor_hero', name: 'Sailor Hero', img: sailor_hero, cat: 'pop' },
  { id: 'electric', name: 'Electric Mouse', img: electric, cat: 'pop' },
  { id: 'forest_spirit', name: 'Forest Spirit', img: forest_spirit, cat: 'animals' },
  { id: 'kitty_overalls', name: 'Kitty Overalls', img: kitty_overalls, cat: 'pop' },
  { id: 'cyber_gamer', name: 'Cyber Gamer', img: cyber_gamer, cat: 'pop' },
  { id: 'secret_agent', name: 'Secret Agent', img: secret_agent, cat: 'adventure' },
  { id: 'detective', name: 'Detective', img: detective, cat: 'adventure' },

  // Row 2
  { id: 'floral_artist', name: 'Floral Artist', img: floral_artist, cat: 'culture' },
  { id: 'calavera', name: 'Calavera Fiesta', img: calavera, cat: 'culture' },
  { id: 'luchador', name: 'Luchador', img: luchador, cat: 'culture' },
  { id: 'golden_sari', name: 'Golden Sari', img: golden_sari, cat: 'culture' },
  { id: 'flamenco', name: 'Flamenco Dancer', img: flamenco, cat: 'culture' },
  { id: 'parisian', name: 'Parisian Baker', img: parisian, cat: 'culture' },
  { id: 'musketeer', name: 'Musketeer', img: musketeer, cat: 'adventure' },

  // Row 3
  { id: 'roman_toga', name: 'Roman Toga', img: roman_toga, cat: 'culture' },
  { id: 'bunny', name: 'Bunny Hoodie', img: bunny, cat: 'animals' },
  { id: 'cow', name: 'Spotted Cow', img: cow, cat: 'animals' },
  { id: 'bee', name: 'Honey Bee', img: bee, cat: 'animals' },
  { id: 'frog', name: 'Frog Onesie', img: frog, cat: 'animals' },
  { id: 'shark', name: 'Shark Hoodie', img: shark, cat: 'animals' },
  { id: 'dino', name: 'Little Dino', img: dino, cat: 'animals' },

  // Row 4
  { id: 'devil', name: 'Little Devil', img: devil, cat: 'spooky' },
  { id: 'angel', name: 'Guardian Angel', img: angel, cat: 'spooky' },
  { id: 'black_cat', name: 'Black Cat', img: black_cat, cat: 'animals' },
  { id: 'pirate', name: 'Pirate Captain', img: pirate, cat: 'adventure' },
  { id: 'cowboy', name: 'Sheriff Cowboy', img: cowboy, cat: 'adventure' },
  { id: 'pink_cowgirl', name: 'Pink Cowgirl', img: pink_cowgirl, cat: 'adventure' },
  { id: 'astronaut', name: 'Astronaut', img: astronaut, cat: 'adventure' },

  // Row 5
  { id: 'pastel_gamer', name: 'Pastel Gamer', img: pastel_gamer, cat: 'pop' },
  { id: 'wizard_student', name: 'Magic Student', img: wizard_student, cat: 'spooky' },
  { id: 'ninja', name: 'Shadow Ninja', img: ninja, cat: 'adventure' },
  { id: 'panda', name: 'Panda Onesie', img: panda, cat: 'animals' },
  { id: 'dark_queen', name: 'Dark Queen', img: dark_queen, cat: 'spooky' },
  { id: 'punk', name: 'Punk Rocker', img: punk, cat: 'pop' },
  { id: 'alien', name: 'Space Alien', img: alien, cat: 'adventure' },

  // Newly added & enhanced Kawaii collection
  { id: 'kawaii_cossack', name: 'Ukrainian Costume', img: kawaii_cossack, cat: 'culture' },
  { id: 'kawaii_unicorn', name: 'Rainbow Unicorn', img: kawaii_unicorn, cat: 'animals' },
  { id: 'kawaii_spider', name: 'Spider-Mouse', img: kawaii_spider, cat: 'pop' },
  { id: 'kawaii_iron', name: 'Iron Armor Mouse', img: kawaii_iron, cat: 'pop' },
  { id: 'kawaii_captain', name: 'Captain Shield', img: kawaii_captain, cat: 'pop' },
  { id: 'kawaii_loki', name: 'Horned Trickster', img: kawaii_loki, cat: 'pop' },
  { id: 'kawaii_panther', name: 'Panther Hero', img: kawaii_panther, cat: 'pop' },
  { id: 'kawaii_karate', name: 'Karate Master', img: kawaii_karate, cat: 'culture' },
  { id: 'kawaii_king', name: 'Royal King', img: kawaii_king, cat: 'culture' },
  { id: 'kawaii_queen', name: 'Royal Princess', img: kawaii_queen, cat: 'culture' },
  { id: 'kawaii_sailor_boy', name: 'Harbor Sailor', img: kawaii_sailor_boy, cat: 'adventure' },
  { id: 'kawaii_squid_triangle', name: 'Triangle Guard', img: kawaii_squid_triangle, cat: 'pop' },
  { id: 'kawaii_squid_square', name: 'Square Officer', img: kawaii_squid_square, cat: 'pop' },
  { id: 'kawaii_squid_circle', name: 'Pink Circle Guard', img: kawaii_squid_circle, cat: 'pop' },
  { id: 'kawaii_squid_player', name: 'Player 007 Suit', img: kawaii_squid_player, cat: 'pop' },
  { id: 'kawaii_harry_wand', name: 'Magic Wand Student', img: kawaii_harry_wand, cat: 'spooky' },
  { id: 'kawaii_wizard_scarf', name: 'Scarf Wizard', img: kawaii_wizard_scarf, cat: 'spooky' },
  { id: 'kawaii_wizard_tie', name: 'Academy Tie', img: kawaii_wizard_tie, cat: 'spooky' },
  { id: 'kawaii_dark_cloak', name: 'Shadow Cloak', img: kawaii_dark_cloak, cat: 'spooky' },
  { id: 'kawaii_mib', name: 'Shades Agent', img: kawaii_mib, cat: 'adventure' },
  { id: 'kawaii_agent_redtie', name: 'Red-Tie Agent', img: kawaii_agent_redtie, cat: 'adventure' },
  { id: 'kawaii_suit_noir', name: 'Noir Trenchcoat', img: kawaii_suit_noir, cat: 'adventure' },
  { id: 'kawaii_explorer', name: 'Fedora Explorer', img: kawaii_explorer, cat: 'adventure' },
  { id: 'kawaii_hazmat', name: 'Lab Hazmat', img: kawaii_hazmat, cat: 'adventure' },
  { id: 'kawaii_rogue', name: 'Hooded Rogue', img: kawaii_rogue, cat: 'adventure' },
  { id: 'kawaii_freddy', name: 'Striped Nightmare', img: kawaii_freddy, cat: 'spooky' },
  { id: 'kawaii_dragon', name: 'Green Dragon Onesie', img: kawaii_dragon, cat: 'animals' },
  { id: 'kawaii_panda', name: 'Cozy Panda Onesie', img: kawaii_panda, cat: 'animals' },
  { id: 'kawaii_ladybug', name: 'Ladybug Onesie', img: kawaii_ladybug, cat: 'animals' },
  { id: 'kawaii_devil', name: 'Little Devil Suit', img: kawaii_devil, cat: 'spooky' },
  { id: 'kawaii_angel', name: 'Guardian Halo Suit', img: kawaii_angel, cat: 'spooky' },
].map((item) => ({ ...item, free: false }));

export const FREE_COSTUME_COUNT = FREE_CLASSIC_ITEMS.length;
export const COSTUMES = [...FREE_CLASSIC_ITEMS, ...NEW_PAID_ITEMS];
export const COSTUME_BY_ID = new Map(COSTUMES.map((c) => [c.id, c]));

export const COSTUME_CATEGORIES = [
  { id: 'all', label: `All (${COSTUMES.length})`, sticker: HUB_STICKERS.badgeStar },
  { id: 'classic', label: `Free Classics (${FREE_CLASSIC_ITEMS.length})`, sticker: HUB_STICKERS.wardrobeClassic },
  { id: 'owned', label: 'My wardrobe', sticker: HUB_STICKERS.wardrobeBanner },
  { id: 'spooky', label: 'Spooky & Magic', sticker: HUB_STICKERS.wardrobeSpooky },
  { id: 'pop', label: 'Heroes & Pop', sticker: HUB_STICKERS.wardrobeHeroes },
  { id: 'culture', label: 'World & Style', sticker: HUB_STICKERS.wardrobeWorld },
  { id: 'animals', label: 'Animals', sticker: HUB_STICKERS.wardrobeAnimals },
  { id: 'adventure', label: 'Adventure', sticker: HUB_STICKERS.wardrobeAdventure },
];

/**
 * Escalating outfit unlock pricing:
 * Increases linearly by +20 PTS (+2,000 Outfit Coins) each purchase:
 * 1st purchase (boughtCount = 0): 20 PTS  or  2,000 Outfit Coins
 * 2nd purchase (boughtCount = 1): 40 PTS  or  4,000 Outfit Coins
 * 3rd purchase (boughtCount = 2): 60 PTS  or  6,000 Outfit Coins
 * 4th purchase (boughtCount = 3): 80 PTS  or  8,000 Outfit Coins...
 */
export function nextCostumePrice(boughtCount = 0) {
  const n = Math.max(0, Math.floor(Number(boughtCount) || 0));
  const pts = (n + 1) * 20;
  return {
    pts,
    game2048: pts * 100,
  };
}
