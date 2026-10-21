import { VisitorTracker, type DeviceType } from 'visitor-module';

/**
 * Keeps track of the visitors. The only class that knows about visitor-module.
 */
export class VisitorRegistry {
  private readonly tracker = new VisitorTracker();

  /**
   * Registers a visit. A returning visitor is recognised and not counted again.
   *
   * @param visitorInfo - The visitor's address and user agent.
   * @param visitorInfo.ipAddress - The visitor's IP address.
   * @param visitorInfo.userAgent - The browser's user agent string.
   * @returns The new or returning visitor.
   */
  registerVisit(visitorInfo: { ipAddress: string; userAgent: string }) {
    const { ipAddress, userAgent } = visitorInfo;
    return this.tracker.track({
      ipAddress,
      userAgent,
    });
  }

  /**
   * Counts the visitors per device type. Device types with no visitors are left out.
   *
   * @returns The number of visitors for each device type.
   */
  getDeviceCounter() {
    const counts = new Map<DeviceType, number>();

    for (const visitor of this.tracker.getVisitors().values()) {
      const device = visitor.deviceType;
      const countSoFar = counts.get(device) ?? 0;
      counts.set(device, countSoFar + 1);
    }
    return counts;
  }

  /**
   * Returns every unique visitor, in the order they first arrived.
   *
   * @returns A copy of the visitors, so changing it does not affect the registry.
   */
  getVisitors() {
    return this.tracker.getVisitors();
  }

  /**
   * Returns the number of unique visitors.
   *
   * @returns The visitor count.
   */
  getVisitorCount() {
    return this.tracker.getVisitorCount();
  }
}
