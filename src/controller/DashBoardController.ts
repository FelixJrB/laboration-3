import { Dashboard } from '../view/Dashboard.js';
import type { Request, Response } from 'express';

/**
 *
 */
export class DashboardController {
  private readonly dashboard: Dashboard;

  /**
   *
   * @param dashboard
   */
  constructor(dashboard: Dashboard) {
    this.dashboard = dashboard;
  }

  /**
   *
   * @param req
   * @param res
   */
  showDashboard(req: Request, res: Response): void {
    res.send(this.dashboard.render());
  }
}
