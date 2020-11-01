import { getFreePositions } from './utils';

export default class AI {
  constructor(team, gameState, gamePlay, positions) {
    this.team = team;
    this.gameState = gameState;
    this.gamePlay = gamePlay;
    this.positions = positions;
    this.endTurn = false;
  }

  computerTurn() {
    this.computerAttack();
    if (!this.endTurn) {
      const activeEnemyIndex = Math.floor(Math.random() * this.team.computerTeam.length);
      const activeEnemy = this.team.computerTeam[activeEnemyIndex];
      const freePositions = getFreePositions(this.positions, this.team.getPositionedCharacters());
      this.gameState.selectedCharacter = activeEnemy;
      const range = this.gameState.getMovementRange();
      const freeRange = range.filter((position) => freePositions.includes(position));
      const newPositionIndex = Math.floor(Math.random() * freeRange.length);
      this.gameState.selectedCharacter.position = freeRange[newPositionIndex];
    }
    this.gamePlay.redrawPositions(this.team.getPositionedCharacters());
    this.gameState.selectedCharacter = null;
    this.gameState.activePlayer = 'player';
    this.endTurn = false;
  }

  computerAttack() {
    for (const character of this.team.computerTeam) {
      this.gameState.selectedCharacter = character;
      const activeAttackRange = this.gameState.getAttackRange();
      for (const char of this.team.playerTeam) {
        if (activeAttackRange.includes(char.position)) {
          const attacker = this.gameState.selectedCharacter.character;
          const target = char.character;
          target.health -= Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
          if (target.health <= 0) {
            this.team.playerTeam.splice(this.team.playerTeam.indexOf(char), 1);
            if (this.team.playerTeam.length === 0) { alert(`Поражение! Ваш счет ${this.gameState.score}`); }
          }
          this.endTurn = true;
        }
      }
    }
  }
}
