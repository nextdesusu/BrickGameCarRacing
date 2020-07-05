import { GAME_TABLE_Y, BG_COLOR, M_COLOR, SM_COLOR, SECOND, FPS } from "./consts";
import Fabric from "./Fabric";

export default class Game {
    ctx: any;
    width: number;
    height: number;
    controls: any;
    tableWidth: number;
    finished: boolean;
    cellSizeW: number;
    cellSizeH: number;
    fabric: Fabric;
    timeFromPrevMove: any;
    timeFromSpeedGrow: any;
    timeFromPrevScore: any;
    speed: number;
    score: number;

    constructor(ctx: any, width: number, height: number, controls: any, tableWidth) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.controls = controls;
        this.tableWidth = tableWidth;
        this.cellSizeW = Math.floor(width / 20);
        this.cellSizeH = Math.floor(height / 20);
        this.fabric = new Fabric(tableWidth);
        this.timeFromPrevMove = 0;
        this.timeFromSpeedGrow = 0;
        this.timeFromPrevScore = Date.now();

        this.finished = false;
        this.speed = 1;
        this.score = 0;

        this.ctx.font = "36px serif";
    }

    drawSquare(x: number, y: number) {
        this.ctx.strokeRect(x * this.cellSizeW, y * this.cellSizeH, this.cellSizeW, this.cellSizeH);
        this.ctx.fillRect(x * this.cellSizeW + 5, y * this.cellSizeH + 5, this.cellSizeW - 10, this.cellSizeH - 10);
    }

    drawAll(): void {
        this.ctx.fillStyle = BG_COLOR;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = SM_COLOR;
        this.ctx.fillStyle = SM_COLOR;
        for (let x = 0; x < this.tableWidth; x += 1) {
            for (let y = 0; y < GAME_TABLE_Y; y += 1) {
                this.drawSquare(x, y);
            }
        }
        this.ctx.strokeStyle = M_COLOR;
        this.ctx.fillStyle = M_COLOR;
        const player = this.fabric.player;
        const pMask = player.mask;
        for (let x = 0; x < pMask.length; x += 1) {
            for (let y = 0; y < pMask[x].length; y += 1) {
                if (pMask[x][y] === 1) {
                    const nx = x + player.x;
                    const ny = y + player.y;
                    this.drawSquare(nx, ny);
                }
            }
        }
        for (const enemy of this.fabric.enemies) {
            const { mask, x, y } = enemy;
            for (let sx = 0; sx < mask.length; sx++) {
                for (let sy = 0; sy < mask[sx].length; sy++) {
                    if (mask[sx][sy] === 1) {
                        const nx = sx + x;
                        const ny = sy + y;
                        this.drawSquare(nx, ny);
                    }
                }
            }
        }
        const interfaceStartX = this.tableWidth * this.cellSizeW;
        const maxTextWidth = 200;
        const scoreX = interfaceStartX + (this.width - interfaceStartX - maxTextWidth / 2) / 2;
        const scoreY = Math.floor(this.height / 4);
        this.ctx.fillRect(interfaceStartX, 0, this.width, this.height);
        this.ctx.fillStyle = BG_COLOR;
        this.ctx.fillRect(interfaceStartX + 10, 10, (this.width - interfaceStartX - 20), scoreY * 2);
        this.ctx.fillStyle = M_COLOR;
        this.ctx.fillText(`Score: ${this.score}`, scoreX, scoreY, maxTextWidth);
    }

    timeCheck(): void {
        const now = Date.now();
        if (now - this.timeFromPrevMove > SECOND / this.speed) {
            for (const enemy of this.fabric.enemies) {
                if (enemy.y > GAME_TABLE_Y) {
                    this.fabric.removeEnemy(enemy);
                }
                if (this.fabric.player.isBeenHit(enemy)) {
                    this.finished = true;
                }
                if (enemy.y === 6) {
                    this.fabric.spawnEnemyCar();
                }
                enemy.move(enemy.x, enemy.y + 1);
            }
            this.timeFromPrevMove = now;
        }
        if (now - this.timeFromSpeedGrow > (SECOND * 5)) {
            this.speed += 1;
            this.timeFromSpeedGrow = now;
        }
        if (now - this.timeFromPrevScore > (SECOND * 2)) {
            this.score += 1;
            this.timeFromPrevScore = now;
        }
        this.fabric.player.move(this.controls.positionX, this.fabric.player.y);

    }

    startLoop(): void {
        let timerId;
        this.fabric.spawnPlayerCar();
        this.fabric.spawnEnemyCar();
        const loop = () => {
            if (!this.finished) {
                this.drawAll();
                this.timeCheck(); 
            } else {
                // do something with ascore here
            }
            timerId = setTimeout(loop, SECOND / FPS);
        }
        timerId = setTimeout(loop, SECOND / FPS);
    }
}