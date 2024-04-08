import geoip from "geoip-lite";
import { Request } from "express";
import { Details } from "express-useragent";

interface DeviceDetails extends Details {
    type?: string;
    device?: string;
  }
  
  interface ContextData {
    ip: string;
    country: string;
    city: string;
    browser: string;
    platform: string;
    os: string;
    device: string;
    deviceType: string;
  }
  
  const getCurrentContextData = (req: Request): ContextData => {
    const ip: string = req.ip || "unknown";
    const location: geoip.Lookup | null = geoip.lookup(ip);
    const country: string = location?.country ? location.country.toString() : "unknown";
    const city: string = location?.city ? location.city.toString() : "unknown";
    const browser: string = req.useragent?.browser
      ? `${req.useragent.browser} ${req.useragent.version}`
      : "unknown";
    const platform: string = req.useragent?.platform
      ? req.useragent.platform.toString()
      : "unknown";
    const os: string = req.useragent?.os ? req.useragent.os.toString() : "unknown";
    const device: string = (req.useragent as DeviceDetails)?.device?.toString() || "unknown";
  
    const isMobile: boolean = req.useragent?.isMobile || false;
    const isDesktop: boolean = req.useragent?.isDesktop || false;
    const isTablet: boolean = req.useragent?.isTablet || false;
  
    const deviceType: string = isMobile
      ? "Mobile"
      : isDesktop
      ? "Desktop"
      : isTablet
      ? "Tablet"
      : "unknown";
  
    return { ip, country, city, browser, platform, os, device, deviceType };
  };
  
  export default getCurrentContextData;