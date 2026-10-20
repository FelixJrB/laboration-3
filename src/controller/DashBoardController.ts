import { Dashboard } from '../view/Dashboard.js';
import type { Request, Response } from 'express';

export class DashboardController {
  private readonly dashboard : Dashboard;

  constructor(dashboard: Dashboard) {
    this.dashboard = dashboard;
  }

  showDashboard(req: Request, res: Response): void {
    res.send(this.dashboard.render());
  }


}