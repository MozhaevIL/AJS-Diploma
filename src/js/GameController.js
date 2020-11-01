import Team from './Team';
import themes from './themes';
import GamePlay from './GamePlay';
import GameState from './GameState';
import AI from './ai';
import GameStateService from './GameStateService';
import { getFreePositions, getAllPositions } from './utils';
import Character from './Character';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positions = getAllPositions(this.gamePlay.boardSize);
    this.team = new Team(this.gamePlay);
    this.gameState = new GameState(this.gamePlay, this.team);
    this.ai = new AI(this.team, this.gameState, this.gamePlay, this.positions);
    this.gameStateService = new GameStateService(localStorage);
  }

  init() {
    console.log('Game start');
    this.loadLevel(this.gameState.currentLevel);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }
  // TODO: add event listeners to gamePlay events
  // TODO: load saved stated from stateService

  onCellClick(index) {
    // выбор персонажа
    if (this.gameState.activePlayer === 'computer') { return; }
    const positionedCharacters = this.team.getPositionedCharacters();
    for (const char of positionedCharacters) {
      if (char.position === index) {
        if (this.team.playerTeam.includes(char)) {
          for (let i = 0; i < this.gamePlay.boardSize ** 2; i += 1) {
            this.gamePlay.deselectCell(i);
            this.gameState.selectedCharacter = null;
          }
          this.gamePlay.selectCell(index);
          this.gameState.selectedCharacter = char;
          return;
        }
        // ошибка при выборе вражеского персонажа
        if (this.team.computerTeam.includes(char) && !this.gameState.selectedCharacter) {
          GamePlay.showError('Вражеский персонаж');
          return;
        }
        // атака
        if ((this.team.computerTeam.includes(char) && this.gameState.selectedCharacter
        && this.gameState.getAttackRange().includes(index))) {
          const attacker = this.gameState.selectedCharacter.character;
          const target = char.character;
          const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
          target.health -= damage;
          this.damageAnimation(index, damage);
          if (target.health <= 0) {
            this.team.computerTeam.splice(this.team.computerTeam.indexOf(char), 1);
          }
          this.gamePlay.redrawPositions(this.team.getPositionedCharacters());
          // критерий победы
          if (this.team.computerTeam.length === 0) {
            this.gameState.currentLevel += 1;
            this.gameState.score = this.getScore();
            if (this.gameState.currentLevel === themes.length) {
              alert(`Победа! Ваш счет ${this.gameState.score}`);
              return;
            }
            this.team.levelUp();
            this.loadLevel(this.gameState.currentLevel);
          }
          this.gamePlay.deselectCell(this.gameState.selectedCharacter.position);
          this.gameState.selectedCharacter = null;
          this.gameState.activePlayer = 'computer';
          this.ai.computerTurn();
          return;
        }
      }
    }
    //перемещение
    if (this.gameState.selectedCharacter && this.gameState.getMovementRange().includes(index)
    && getFreePositions(this.positions, this.team.getPositionedCharacters()).includes(index)) {
      this.gamePlay.deselectCell(this.gameState.selectedCharacter.position);
      this.gameState.selectedCharacter.position = index;
      this.gameState.selectedCharacter = null;
      this.gamePlay.redrawPositions(this.team.getPositionedCharacters());
      this.gameState.activePlayer = 'computer';
      this.ai.computerTurn();
    }
  }

  onCellEnter(index) {
    const positionedCharacters = this.team.getPositionedCharacters();
    for (const char of positionedCharacters) {
      if (char.position === index) {
        this.gamePlay.showCellTooltip(`\u{1F396}${char.character.level} \u{2694}${char.character.attack} \u{1F6E1}${char.character.defence} \u{2764}${char.character.health}`, index);
      }
    }
    if (this.gameState.selectedCharacter && this.gameState.getMovementRange().includes(index)) {
      this.gamePlay.setCursor('pointer');
      this.gamePlay.selectCell(index, 'green');
    } else if (this.gameState.selectedCharacter && !this.gameState.getMovementRange().includes(index)) {
      this.gamePlay.setCursor('not-allowed');
    }

    for (const enemy of this.team.computerTeam) {
      if (enemy.position === index && this.gameState.selectedCharacter) {
        if (this.gameState.selectedCharacter && this.gameState.getAttackRange().includes(index)) {
          this.gamePlay.setCursor('crosshair');
          this.gamePlay.selectCell(index, 'red');
        } else if (!this.gameState.selectedCharacter) {
          this.gamePlay.setCursor('not-allowed');
        }
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.removeMarkers(index, 'red');
    this.gamePlay.removeMarkers(index, 'green');
    this.gamePlay.setCursor('pointer');
  }

  onNewGameClick() {
    this.team.clearTeams();
    this.gameState.resetGame();
    this.loadLevel(this.gameState.currentLevel);
  }

  onSaveGameClick() {
    this.gameStateService.save(this.gameState);
  }

  onLoadGameClick() {
    console.log(this.gameStateService.load());
    this.team.computerTeam = this.gameStateService.load().team.computerTeam;
    this.team.playerTeam = this.gameStateService.load().team.playerTeam;
    const currentStage = this.gameStateService.load().currentLevel;
    this.gamePlay.drawUi(themes[currentStage].name);
    this.gamePlay.redrawPositions(this.team.getPositionedCharacters());
  }

  async damageAnimation(index, damage) {
    await this.gamePlay.showDamage(index, damage);
  }

  loadLevel(currentStage) {
    this.gameState.activePlayer = 'player';
    this.gamePlay.drawUi(themes[currentStage].name);
    this.team.addToPlayer(themes[currentStage].newPlayerChars.types,
      themes[currentStage].newPlayerChars.maxLevel, themes[currentStage].newPlayerChars.count);
    this.team.addToEnemy(themes[currentStage].newEnemyChars.types,
      themes[currentStage].newEnemyChars.maxLevel, this.team.playerTeam.length);
    this.gamePlay.redrawPositions(this.team.getPositionedCharacters());
  }

  getScore() {
    let score = 0;
    for (const positionedCharacter of this.team.playerTeam) {
      score += positionedCharacter.character.health;
    }
    return score;
  }
}
