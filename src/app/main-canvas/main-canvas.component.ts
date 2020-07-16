import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import Game from "../../Game";
import { controls, statistics, scoreSign, gameConfig } from "../../Game/gameTypes";

const MIN_X = 1;
const NAME_VALIDATION_REGEXP = /\w{4,8}/;

@Component({
  selector: 'app-main-canvas',
  templateUrl: './main-canvas.component.html',
  styleUrls: ['./main-canvas.component.css']
})
export class MainCanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('lostSound', { static: true })
  lostSound: ElementRef<HTMLAudioElement>;

  errorOpacity: 0 | 1;
  gameStarted: boolean;
  ctx: CanvasRenderingContext2D;
  ctrls: controls;
  tableWidth: number;
  stats: statistics;
  playerName: string;
  records: Array<scoreSign>;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === "KeyA") {
      if (this.ctrls.positionX > MIN_X) {
        this.ctrls.positionX -= 1;
      }
    }
    if (event.code === "KeyD") {
      if (this.ctrls.positionX < this.tableWidth - 4) {
        this.ctrls.positionX += 1;
      }
    }
    if (event.code === "Space") {
      this.ctrls.pause = !this.ctrls.pause;
    }
  }

  constructor() {
    this.gameStarted = false;
    this.errorOpacity = 0;
    this.ctrls = {
      positionX: 3,
      pause: false
    };
    this.stats = {
      score: 0,
      speed: 0
    }
    this.playerName = "";
    const standartRecords: Array<scoreSign> = [
      { name: "Json", score: 3 },
      { name: "Ycomb", score: 2 },
      { name: "Greg", score: 1 }
    ];
    const loaded: Array<scoreSign> | null = JSON.parse(localStorage.getItem("scores"));
    this.records = loaded === null ? standartRecords : loaded;
  }

  ngOnInit(): void {
  }

  validatePlayerName(): void {
    if (!this.playerName.match(NAME_VALIDATION_REGEXP)) {
      this.errorOpacity = 1;
    } else {
      this.errorOpacity = 0
    }
  }

  public onKeyUp(event: any): void {
    this.playerName = event.target.value;
    this.validatePlayerName();
  }

  public startGame(): void {
    this.gameStarted = true;
    const canvas = this.canvas.nativeElement;
    this.validatePlayerName();
    if (!this.playerName.match(NAME_VALIDATION_REGEXP)) {
      return;
    }
    this.tableWidth = 10;
    const ctx = canvas.getContext('2d');
    const GAME_HEIGHT = 500;
    canvas.width = GAME_HEIGHT / 2;
    canvas.height = GAME_HEIGHT;

    const changeScore = (): void => {
      const newRecord = { name: this.playerName, score: this.stats.score };
      let inRecords: boolean = false;
      for (let i = 0; i < this.records.length; i += 1) {
        if (this.records[i].name === this.playerName) {
          this.records[i] = newRecord;
          inRecords = true;
          break;
        }
      }
      if (!inRecords) {
        const newScores = [...this.records, newRecord];
        newScores.sort((a: scoreSign, b: scoreSign) => b.score - a.score);
        this.records = [newScores[0], newScores[1], newScores[2]];
      } else {
        this.records.sort((a: scoreSign, b: scoreSign) => b.score - a.score);
      }
      const stringified = JSON.stringify(this.records);
      localStorage.setItem("scores", stringified);
    }

    const finishGame = (): void => {
      changeScore();
      this.ctrls = {
        positionX: 3,
        pause: false
      };
      this.stats = {
        score: 0,
        speed: 0
      };
      this.gameStarted = false;
    }
    const gameConfig: gameConfig = {
      ctx: ctx,
      width: canvas.width,
      height: canvas.height,
      controls: this.ctrls,
      tableWidth: this.tableWidth,
      stats: this.stats,
      finish: finishGame,
      lostSound: this.lostSound,
    };
    const game = new Game(gameConfig);
    game.startLoop();
  }
}
