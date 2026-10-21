import { HexGrid, type Hexagon } from 'midgard-hex-grid';

export class VisitorHive {
  private readonly hexGrid = new HexGrid('x-dominated');
  private readonly skeletonWidth = 5;
  private readonly hexagonsPerTwoRows = 13;

  createHexagons(count: number, hexDiameter: number): Hexagon[] {
    const skeletonHeight = Math.max(1, Math.ceil(count / this.hexagonsPerTwoRows));
    const hexagons = this.hexGrid.createGrid({ hexDiameter, skeletonWidth: this.skeletonWidth, skeletonHeight });

    return hexagons.slice(0, count);
  }
}
