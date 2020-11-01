import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import { getPlayerColumns, getComputerColumns, getFreePositions } from './utils';

export default class Team {
  constructor(gamePlay) {
    this.gamePlay = gamePlay;
    this.playerTeam = [];
    this.computerTeam = [];
    this.playerColumns = getPlayerColumns(gamePlay.boardSize);
    this.compColumns = getComputerColumns(gamePlay.boardSize);
  }

  addToPlayer(allowedTypes, maxLevel, characterCount) {
    const newCharacters = generateTeam(allowedTypes, maxLevel, characterCount);
    newCharacters.forEach((character) => {
      const freePositions = getFreePositions(this.playerColumns, this.getPositionedCharacters());
      const randomPos = freePositions[Math.floor(Math.random() * freePositions.length)];
      this.playerTeam.push(new PositionedCharacter(character, randomPos));
    });
  }

  addToEnemy(allowedTypes, maxLevel, characterCount) {
    const newCharacters = generateTeam(allowedTypes, maxLevel, characterCount);
    for (const character of newCharacters) {
      const freePositions = getFreePositions(this.compColumns, this.getPositionedCharacters());
      const randomPos = freePositions[Math.floor(Math.random() * freePositions.length)];
      this.computerTeam.push(new PositionedCharacter(character, randomPos));
    }
  }

  getPositionedCharacters() {
    return this.playerTeam.concat(this.computerTeam);
  }

  levelUp() {
    this.playerTeam.forEach((positionedCharacter) => {
      const { character } = positionedCharacter;
      const { attack, defence, health } = character;
      character.level += 1;
      character.attack = Math.floor(Math.max(attack, attack * (0.8 + health / 100)));
      character.defence = Math.floor(Math.max(defence, defence * (0.8 + health / 100)));
      character.health = Math.min(health + 90, 100);
    });
  }

  clearTeams() {
    this.playerTeam = [];
    this.computerTeam = [];
  }
}
