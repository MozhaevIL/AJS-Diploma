import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super();
    this.level = level;
    this.attack = 25 + 25 * 0.8 * (level - 1);
    this.defence = 25 + 25 * 0.8 * (level - 1);
    this.health = 100;
    this.speed = 2;
    this.range = 2;
    this.type = 'bowman';
  }
}
