import express from 'express';
import { DashboardController } from '../controller/DashBoardController.js';

/**
 * Maps the dashboard's URLs to controller methods.
 */
export class DashboardRouter {
  readonly router = express.Router();
  private readonly controller: DashboardController;

  /**
   * Registers the routes.
   *
   * @param controller - Handles the requests for every route.
   */
  constructor(controller: DashboardController) {
    this.controller = controller;
    this.router.get('/', (req, res) => {
      this.controller.showDashboard(req, res);
    });
  }
}
