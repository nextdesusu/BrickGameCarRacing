import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import Game from "../../Game";
import { controls, statistics, scoreSign } from "../../Game/gameTypes";

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
  @ViewChild('overlap', { static: true })
  overlap: ElementRef<HTMLDivElement>;
  @ViewChild('menu', { static: true })
  menu: ElementRef<HTMLDivElement>;
  @ViewChild('errorMessage', { static: true })
  errorMessage: ElementRef<HTMLSpanElement>;
  ctx = null;
  ctrls: controls;
  tableWidth: number;
  stats: statistics;
  playerName: string;
  records: Array<scoreSign>;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === "KeyA") {
      if (this.ctrls.positionX > MIN_X) {
        this.ctrls.positionX = this.ctrls.positionX - 1;
      }
    }
    if (event.code === "KeyD") {
      if (this.ctrls.positionX < this.tableWidth - 4) {
        this.ctrls.positionX = this.ctrls.positionX + 1;
      }
    }
    if (event.code === "Space") {
      this.ctrls.pause = !this.ctrls.pause;
    }
  }

  constructor() {
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
    const errorSpan = this.errorMessage.nativeElement;
    if (!this.playerName.match(NAME_VALIDATION_REGEXP)) {
      errorSpan.style.opacity = "1";
    } else {
      errorSpan.style.opacity = "0";
    }
  }

  public onKeyUp(event: any): void {
    this.playerName = event.target.value;
    this.validatePlayerName();
  }

  public startGame(): void {
    const overlap = this.overlap.nativeElement;
    const canvas = this.canvas.nativeElement;
    const menu = this.menu.nativeElement;
    this.validatePlayerName();
    if (!this.playerName.match(NAME_VALIDATION_REGEXP)) {
      return;
    }
    overlap.style.display = "none";
    canvas.style.display = "block";
    menu.style.display = "grid";
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
      overlap.style.display = "flex";
      canvas.style.display = "none";
      menu.style.display = "none";
      this.ctrls = {
        positionX: 3,
        pause: false
      };
      this.stats = {
        score: 0,
        speed: 0
      };
    }

    const game = new Game(ctx, canvas.width, canvas.height, this.ctrls, this.tableWidth, this.stats, finishGame);
    game.startLoop();
  }
}
