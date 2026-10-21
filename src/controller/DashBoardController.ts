import { Dashboard } from '../view/Dashboard.js';
import type { Request, Response } from 'express';
import { VisitorRegistry } from '../model/VisitorRegistry.js';
import { VisitorHive } from '../model/VisitorHive.js';

/**
 * Handles requests to the dashboard.
 */
export class DashboardController {
  private readonly dashboard: Dashboard;
  private readonly registry: VisitorRegistry;
  private readonly hive: VisitorHive;

  /**
   * Receives its dependencies from App instead of creating them.
   *
   * @param dashboard - Renders the page.
   * @param registry - Keeps track of the visitors.
   * @param hive - Lays out the hexagons.
   */
  constructor(dashboard: Dashboard, registry: VisitorRegistry, hive: VisitorHive) {
    this.dashboard = dashboard;
    this.registry = registry;
    this.hive = hive;
  }

  /**
   * Registers the request as a visit and responds with the dashboard.
   * Opening the dashboard therefore counts as a visit.
   *
   * @param req - The incoming request, which holds the visitor's address and user agent.
   * @param res - Used to send the rendered page.
   */
  showDashboard(req: Request, res: Response): void {
    this.registry.registerVisit({
      ipAddress: req.ip ?? 'Unknown',
      userAgent: req.get('User-Agent') || 'Unknown',
    });
    const visitors = this.registry.getVisitors();

    res.send(
      this.dashboard.render({
        visitors,
        deviceCounter: this.registry.getDeviceCounter(),
        statHexagons: this.hive.createHexagons(4, 150),
        visitorHexagons: this.hive.createHexagons(visitors.size, 120),
      }),
    );
  }
}
