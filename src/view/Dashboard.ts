import type { Visitor } from 'visitor-module';
import type { Hexagon } from 'midgard-hex-grid';

type DashboardData = {
  visitors: Map<string, Visitor>;
  deviceCounter: Map<string, number>;
  statHexagons: Hexagon[];
  visitorHexagons: Hexagon[];
};

/**
 * Renders the dashboard page. Every number and hexagon comes from the controller.
 */
export class Dashboard {
  /**
   * Renders the complete HTML page.
   *
   * @param data - The visitors, the device counts and the hexagons to draw them in.
   * @returns The page as an HTML string.
   */
  render(data: DashboardData): string {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Visitor Dashboard</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <main>
    <h1>Visitor Dashboard</h1>
    <p class="sub">Visitors are registered with the visitor-module</p>
    <h2>Visitor Statistics</h2>
    ${this.renderStats(data)}
    <h2>Visitors</h2>
    <p class="sub">Every unique visitor since the server started</p>
    ${this.renderVisitors(data)}
    <h2>Map</h2>
    <p class="sub">Planned</p>
    <h2>All Visitors</h2>
    <p class="sub">Planned</p>
  </main>
</body>
</html>`;
  }

  // TODO: Show visitors on a Leaflet map once LocationService returns coordinates.
  // TODO: Show a table of all stored visitors once visits are saved to a database.

  /**
   * Draws the four statistics, one in each hexagon.
   *
   * @param data - The visitors, the device counts and the statistics hexagons.
   * @param data.visitors - Every unique visitor.
   * @param data.deviceCounter - The number of visitors per device type.
   * @param data.statHexagons - One hexagon per statistic.
   * @returns An SVG element.
   */
  private renderStats({ visitors, deviceCounter, statHexagons }: DashboardData): string {
    const stats = [
      { label: 'Total visitors', value: visitors.size },
      { label: 'Desktop', value: deviceCounter.get('Desktop') ?? 0 },
      { label: 'Mobile', value: deviceCounter.get('Mobile') ?? 0 },
      { label: 'Tablet', value: deviceCounter.get('Tablet') ?? 0 },
    ];
    let shapes = '';

    statHexagons.forEach((hexagon, index) => {
      const stat = stats[index];
      if (!stat) return;

      const { x, y } = hexagon.center;
      shapes += `<g class="stat">
        <polygon points="${this.toPoints(hexagon)}"></polygon>
        <text class="stat-label" x="${x}" y="${y - 18}">${stat.label}</text>
        <text class="stat-value" x="${x}" y="${y + 22}">${stat.value}</text>
      </g>`;
    });

    return this.toSvg(statHexagons, shapes);
  }

  /**
   * Draws one hexagon per visitor, coloured by device type through its CSS class.
   *
   * @param data - The visitors and one hexagon per visitor.
   * @param data.visitors - Every unique visitor.
   * @param data.visitorHexagons - One hexagon per visitor, in the same order.
   * @returns An SVG element.
   */
  private renderVisitors({ visitors, visitorHexagons }: DashboardData): string {
    const visitorList = [...visitors.values()];
    let shapes = '';

    visitorHexagons.forEach((hexagon, index) => {
      const visitor = visitorList[index];
      if (!visitor) return;

      // location unknown until ive implemented api
      const { x, y } = hexagon.center;
      shapes += `<g class="visitor visitor-${visitor.deviceType.toLowerCase()}">
        <polygon points="${this.toPoints(hexagon)}"></polygon>
        <text class="visitor-id" x="${x}" y="${y - 32}">#${visitor.uniqueId}</text>
        <text class="visitor-device" x="${x}" y="${y - 10}">${visitor.deviceType}</text>
        <text class="visitor-os" x="${x}" y="${y + 12}">${visitor.operatingSystem}</text>
        <text class="visitor-location" x="${x}" y="${y + 32}">${visitor.location}</text> 
      </g>`;
    });

    return this.toSvg(visitorHexagons, shapes);
  }

  /**
   * Formats the corners of a hexagon for the `points` attribute of an SVG polygon.
   *
   * @param hexagon - The hexagon to format.
   * @returns The corners as "x,y x,y ...".
   */
  private toPoints(hexagon: Hexagon): string {
    return hexagon.points.map((point) => `${point.x},${point.y}`).join(' ');
  }

  /**
   * Wraps the shapes in an SVG element sized to fit every hexagon, so nothing is cut off.
   *
   * @param hexagons - The hexagons that decide the size.
   * @param shapes - The SVG markup to wrap.
   * @returns An SVG element, or an empty string when there are no hexagons.
   */
  private toSvg(hexagons: Hexagon[], shapes: string): string {
    const points = hexagons.flatMap((hexagon) => hexagon.points);
    if (points.length === 0) return '';

    const padding = 4;
    const minX = Math.min(...points.map((point) => point.x)) - padding;
    const minY = Math.min(...points.map((point) => point.y)) - padding;
    const width = Math.max(...points.map((point) => point.x)) + padding - minX;
    const height = Math.max(...points.map((point) => point.y)) + padding - minY;

    return `<svg class="hive" viewBox="${minX} ${minY} ${width} ${height}" width="${width}">${shapes}</svg>`;
  }
}
