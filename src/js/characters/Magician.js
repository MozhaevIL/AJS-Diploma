import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super();
    this.level = level;
    this.attack = 10 + 10 * 0.8 * (level - 1);
    this.defence = 40 + 40 * 0.8 * (level - 1);
    this.health = 100;
    this.speed = 1;
    this.range = 4;
    this.type = 'magician';
  }
}
