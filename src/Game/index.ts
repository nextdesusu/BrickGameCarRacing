import { GAME_TABLE_Y, BG_COLOR, M_COLOR, SM_COLOR, SECOND } from "./consts";
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
    columns: Array<number>;

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
        this.columns = [3, 7, 11, 15, 19];

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
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = BG_COLOR;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.strokeStyle = SM_COLOR;
        this.ctx.fillStyle = SM_COLOR;
        let cols = [3, 7, 11, 15, 20];
        for (let x = 1; x < this.tableWidth - 1; x += 1) {
            for (let y = 0; y < GAME_TABLE_Y; y += 1) {
                this.drawSquare(x, y);
            }
        }
        this.ctx.strokeStyle = M_COLOR;
        this.ctx.fillStyle = M_COLOR;
        for (let y = 0; y < GAME_TABLE_Y; y += 1) {
            this.drawSquare(0, y);
            this.drawSquare(this.tableWidth - 1, y);
        }
        this.ctx.strokeStyle = SM_COLOR;
        this.ctx.fillStyle = SM_COLOR;
        for (const columnI of this.columns) {
            this.drawSquare(0, columnI);
            this.drawSquare(this.tableWidth - 1, columnI);
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
        const maxTextWidth = 150;
        const textStartX = interfaceStartX + (this.width - interfaceStartX - maxTextWidth) / 2;
        const textStartY = Math.floor(this.height / 6);
        this.ctx.fillRect(interfaceStartX, 0, 5, this.height);
        this.ctx.fillText(`Score: ${this.score}`, textStartX, textStartY, maxTextWidth);
        this.ctx.fillText(`Hi-Score: ${33}`, textStartX, textStartY + 36, maxTextWidth);
        this.ctx.fillRect(interfaceStartX, textStartY + (36 * 2), this.width, 5);
        this.ctx.lineWidth = 10;
        this.ctx.strokeRect(0, 0, this.width, this.height);
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

                this.columns = this.columns.map((columnI) => columnI > 18 ? 0 : columnI + 1);
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
        this.fabric.spawnPlayerCar();
        this.fabric.spawnEnemyCar();
        const loop = () => {
            if (!this.finished) {
                this.drawAll();
                this.timeCheck(); 
            } else {
                // do something with a score here
            }
            window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
    }
}