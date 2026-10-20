import express from 'express';
import { DashboardController } from '../controller/DashBoardController.js';

export class DashboardRouter {

  readonly router = express.Router();
  readonly controller: DashboardController;

  constructor(controller: DashboardController) {
    this.controller = controller;
    this.router.get('/', (req, res) => {
      this.controller.showDashboard(req, res);
    });
  }
}