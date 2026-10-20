import express from 'express';
import { Dashboard } from './view/Dashboard.js';
import { DashboardController } from './controller/DashBoardController.js';
import { DashboardRouter } from './routes/router.js';
/**
 *
 */
export class App {
  private readonly express = express();

  /**
   *
   */
  constructor() {
    this.express.use(express.static('public'));

    const dashboard = new Dashboard();
    const controller = new DashboardController(dashboard);
    const router = new DashboardRouter(controller);
    this.express.use('/', router.router);
  }

  /**
   *
   * @param port
   */
  listen(port: number) {
    this.express.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}
