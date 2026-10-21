import express from 'express';
import { Dashboard } from './view/Dashboard.js';
import { DashboardController } from './controller/DashBoardController.js';
import { DashboardRouter } from './routes/router.js';
import { VisitorRegistry } from './model/VisitorRegistry.js';
import { VisitorHive } from './model/VisitorHive.js';
/**
 * The Express application. Creates every part of the dashboard and wires them together,
 * so no other class needs to create its own dependencies.
 */
export class App {
  private readonly express = express();

  /**
   * Sets up Express and connects model, view, controller and router.
   * `trust proxy` makes `req.ip` the visitor's address instead of Caddy's.
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
   * Starts the server on all network interfaces, so it can be reached from outside the container.
   *
   * @param port - The port to listen on.
   */
  listen(port: number) {
    this.express.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}
