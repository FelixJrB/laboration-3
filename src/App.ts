import express from 'express';
import { Dashboard } from './view/Dashboard.js';
import { DashboardController } from './controller/DashBoardController.js';
import { DashboardRouter } from './routes/router.js';
import { VisitorRegistry } from './model/VisitorRegistry.js';
import { VisitorHive } from './model/VisitorHive.js';
/**
 *
 */
export class App {
  private readonly express = express();

  /**
   *
   */
  constructor() {
    this.express.set('trust proxy', 1);
    this.express.use(express.static('public'));
    const visitorRegistry = new VisitorRegistry();

    const hive = new VisitorHive();
    const dashboard = new Dashboard();
    const controller = new DashboardController(dashboard, visitorRegistry, hive);
    
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
