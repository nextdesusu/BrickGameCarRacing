import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import Game from "../../Game";
const MIN_X = 1, MAX_X = 6;

interface controls {
  positionX: number;
  pause: boolean;
}

@Component({
  selector: 'app-main-canvas',
  templateUrl: './main-canvas.component.html',
  styleUrls: ['./main-canvas.component.css']
})
export class MainCanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>; 
  ctx = null;
  ctrls: controls;
  tableWidth: number;
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
  }
  
  ngOnInit(): void {
    this.tableWidth = 10;
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    const game = new Game(ctx, canvas.width, canvas.height, this.ctrls, this.tableWidth);
    game.startLoop();
  }

}
