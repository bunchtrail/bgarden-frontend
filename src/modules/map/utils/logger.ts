import { MapConfig } from '../contexts/MapConfigContext';

class MapLogger {
  private static instance: MapLogger;
  private debugEnabled: boolean = false;
  private isProduction: boolean = process.env.NODE_ENV === 'production';

  private constructor() {}

  public static getInstance(): MapLogger {
    if (!MapLogger.instance) {
      MapLogger.instance = new MapLogger();
    }
    return MapLogger.instance;
  }

  public setConfig(config: MapConfig) {
    this.debugEnabled = config.debug;
  }

 
}

export const mapLogger = MapLogger.getInstance(); 