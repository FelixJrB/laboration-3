import { VisitorTracker } from 'visitor-module';

export class VisitorRegistry {
  private readonly tracker = new VisitorTracker();

  constructor() {}

  registerVisit(visitorInfo: { ipAddress: string; userAgent: string }) {
    const { ipAddress, userAgent } = visitorInfo;
    return this.tracker.track({
      ipAddress,
      userAgent,
    });
  }

  getVisitors() {
    return this.tracker.getVisitors();
  }

  getVisitorCount() {
    return this.tracker.getVisitorCount();
  }
}
