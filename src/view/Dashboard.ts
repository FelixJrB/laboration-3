import type { Visitor } from 'visitor-module';
import type { Hexagon } from 'midgard-hex-grid';

type DashboardData = {
  visitors: Map<string, Visitor>;
  deviceCounter: Map<string, number>;
  statHexagons: Hexagon[];
  visitorHexagons: Hexagon[];
};

/**
 *
 */
export class Dashboard {
  /**
   * @param data
   */
  render(data: DashboardData): string {
    return `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Visitor Dashboard</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <main>
    <h1>Visitor Dashboard</h1>
    <p class="sub">Besök registreras med visitor-module</p>
    ${this.renderStats(data)}
    <h2>Alla besökare</h2>
    ${this.renderVisitors(data)}
  </main>
</body>
</html>`;
  }

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

  private renderVisitors({ visitors, visitorHexagons }: DashboardData): string {
    const visitorList = [...visitors.values()];
    let shapes = '';

    visitorHexagons.forEach((hexagon, index) => {
      const visitor = visitorList[index];
      if (!visitor) return;

      const { x, y } = hexagon.center;
      shapes += `<g class="visitor visitor-${visitor.deviceType.toLowerCase()}">
        <polygon points="${this.toPoints(hexagon)}"></polygon>
        <text class="visitor-id" x="${x}" y="${y - 22}">#${visitor.uniqueId}</text>
        <text class="visitor-device" x="${x}" y="${y + 2}">${visitor.deviceType}</text>
        <text class="visitor-os" x="${x}" y="${y + 24}">${visitor.operatingSystem}</text>
      </g>`;
    });

    return this.toSvg(visitorHexagons, shapes);
  }

  private toPoints(hexagon: Hexagon): string {
    return hexagon.points.map((point) => `${point.x},${point.y}`).join(' ');
  }

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
