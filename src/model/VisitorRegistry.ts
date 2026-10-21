import { VisitorTracker, type DeviceType } from 'visitor-module';

export class VisitorRegistry {
  private readonly tracker = new VisitorTracker();

  registerVisit(visitorInfo: { ipAddress: string; userAgent: string }) {
    const { ipAddress, userAgent } = visitorInfo;
    return this.tracker.track({
      ipAddress,
      userAgent,
    });
  }

  getDeviceCounter() {
    const counts = new Map<DeviceType, number>();

    for (const visitor of this.tracker.getVisitors().values()) {
      const device = visitor.deviceType;
      const countSoFar = counts.get(device) ?? 0;
      counts.set(device, countSoFar + 1);
    }
    return counts;
  }
  
  getVisitors() {
    return this.tracker.getVisitors();
  }

  getVisitorCount() {
    return this.tracker.getVisitorCount();
  }
}
