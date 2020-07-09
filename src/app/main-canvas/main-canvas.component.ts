import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import Game from "../../Game";
import { controls, statistics } from "../../Game/gameTypes";
const MIN_X = 1;

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
  ctx = null;
  ctrls: controls;
  tableWidth: number;
  stats: statistics;
  playerName: string;
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
  }
  
  ngOnInit(): void {
  }

  public startGame(): void {
    const overlap = this.overlap.nativeElement;
    const canvas = this.canvas.nativeElement;
    const menu = this.menu.nativeElement;

    overlap.style.display = "none";
    canvas.style.display = "block";
    menu.style.display = "grid";
    this.tableWidth = 10;
    const ctx = canvas.getContext('2d');
    const GAME_HEIGHT = 500;
    canvas.width = GAME_HEIGHT / 2;
    canvas.height = GAME_HEIGHT;
    const game = new Game(ctx, canvas.width, canvas.height, this.ctrls, this.tableWidth, this.stats);
    game.startLoop();
  }

}
