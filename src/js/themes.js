import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';

const themes = [
  {
    name: 'prairie',
    newPlayerChars: {
      types: [Bowman, Swordsman],
      count: 2,
      maxLevel: 1,
    },
    newEnemyChars: {
      types: [Daemon, Vampire, Undead],
      maxLevel: 1,
    },
  },
  {
    name: 'desert',
    newPlayerChars: {
      types: [Bowman, Swordsman, Magician],
      count: 1,
      maxLevel: 1,
    },
    newEnemyChars: {
      types: [Daemon, Vampire, Undead],
      maxLevel: 2,
    },
  },
  {
    name: 'arctic',
    newPlayerChars: {
      types: [Bowman, Swordsman, Magician],
      count: 2,
      maxLevel: 2,
    },
    newEnemyChars: {
      types: [Daemon, Vampire, Undead],
      maxLevel: 3,
    },
  },
  {
    name: 'mountain',
    newPlayerChars: {
      types: [Bowman, Swordsman, Magician],
      count: 2,
      maxLevel: 3,
    },
    newEnemyChars: {
      types: [Daemon, Vampire, Undead],
      maxLevel: 4,
    },
  },
];

export default themes;
