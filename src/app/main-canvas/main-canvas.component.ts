import { Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import { startGame } from "../../Game";

@Component({
  selector: 'app-main-canvas',
  templateUrl: './main-canvas.component.html',
  styleUrls: ['./main-canvas.component.css']
})
export class MainCanvasComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>; 
  ctx = null;

  constructor() { }

  ngOnInit(): void {
    const canvas = this.canvas.nativeElement
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600;
    startGame(ctx, canvas.width, canvas.height);
  }

}
