import express from 'express';

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
