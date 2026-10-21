import { Dashboard } from '../view/Dashboard.js';
import type { Request, Response } from 'express';
import { VisitorRegistry } from '../model/VisitorRegistry.js';
import { VisitorHive } from '../model/VisitorHive.js';

/**
 *
 */
export class DashboardController {
  private readonly dashboard: Dashboard;
  private readonly registry: VisitorRegistry;
  private readonly hive: VisitorHive;
  /**
   *
   * @param dashboard
   * @param registry
   * @param hive
   */
  constructor(dashboard: Dashboard, registry: VisitorRegistry, hive: VisitorHive) {
    this.dashboard = dashboard;
    this.registry = registry;
    this.hive = hive;
  }

  /**
   *
   * @param req
   * @param res
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
