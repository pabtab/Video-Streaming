export class NavigationManager {
  private currentRow = 0;
  private currentCol = 0;
  private maxRows: number;
  private getMaxCols: (row: number) => number;

  constructor(maxRows: number, getMaxCols: (row: number) => number) {
    this.maxRows = maxRows;
    this.getMaxCols = getMaxCols;
  }

  public handleKeyPress(key: string): { row: number; col: number } | null {
    switch (key) {
      case "ArrowUp":
        if (this.currentRow > 0) {
          this.currentRow--;
          this.adjustCurrentCol();
        }
        break;
      case "ArrowDown":
        if (this.currentRow < this.maxRows - 1) {
          this.currentRow++;
          this.adjustCurrentCol();
        }
        break;
      case "ArrowLeft":
        if (this.currentCol > 0) {
          this.currentCol--;
        }
        break;
      case "ArrowRight":
        const maxCol = this.getMaxCols(this.currentRow);
        if (this.currentCol < maxCol - 1) {
          this.currentCol++;
        }
        break;
      default:
        return null;
    }

    return { row: this.currentRow, col: this.currentCol };
  }

  private adjustCurrentCol() {
    const maxCol = this.getMaxCols(this.currentRow);
    this.currentCol = Math.min(this.currentCol, maxCol - 1);
  }

  public getCurrentPosition(): { row: number; col: number } {
    return { row: this.currentRow, col: this.currentCol };
  }
}
