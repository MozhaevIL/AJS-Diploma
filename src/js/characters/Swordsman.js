import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super();
    this.level = level;
    this.attack = 40 + 40 * 0.8 * (level - 1);
    this.defence = 10 + 10 * 0.8 * (level - 1);
    this.health = 100;
    this.speed = 4;
    this.range = 1;
    this.type = 'swordsman';
  }
}
