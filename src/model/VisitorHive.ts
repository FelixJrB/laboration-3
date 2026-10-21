import { HexGrid, type Hexagon } from 'midgard-hex-grid';

/**
 * Lays out hexagons in a hive. The only class that knows about midgard-hex-grid.
 */
export class VisitorHive {
  private readonly hexGrid = new HexGrid('x-dominated');
  private readonly skeletonWidth = 5;
  private readonly hexagonsPerTwoRows = 13;

  /**
   * Creates exactly `count` hexagons. The grid module always fills in around its skeleton, so a
   * grid large enough is created and the first `count` hexagons are kept.
   *
   * @param count - The number of hexagons to create.
   * @param hexDiameter - The width of one hexagon, in pixels.
   * @returns The hexagons, row by row, with their centre and corner points.
   */
  createHexagons(count: number, hexDiameter: number): Hexagon[] {
    const skeletonHeight = Math.max(1, Math.ceil(count / this.hexagonsPerTwoRows));
    const hexagons = this.hexGrid.createGrid({ hexDiameter, skeletonWidth: this.skeletonWidth, skeletonHeight });

    return hexagons.slice(0, count);
  }
}
