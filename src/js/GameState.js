import { calculateRange } from './utils';

export default class GameState {
  constructor(gamePlay, team) {
    this.gameInProgress = true;
    this.activePlayer = 'player';
    this.selectedCharacter = null;
    this.gamePlay = gamePlay;
    this.team = team;
    this.score = 0;
    this.currentLevel = 0;
  }

  getAttackRange() {
    return calculateRange(this.selectedCharacter.character.range, this.selectedCharacter.position,
      this.gamePlay.boardSize);
  }

  getMovementRange() {
    return calculateRange(this.selectedCharacter.character.speed, this.selectedCharacter.position,
      this.gamePlay.boardSize);
  }

  resetGame() {
    this.currentLevel = 0;
  }
}
