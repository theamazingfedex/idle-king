export default abstract class AbstractIdleTracker {
  baseIntervalInMillis: number;
  modifiedIntervalInMillis: number;
  identifier: string;
  lastUpdatedAt: number;
  ticksSinceLastUpdate: number;

  constructor(identifier: string, baseIntervalInMillis: number) {
    this.baseIntervalInMillis = baseIntervalInMillis;
    this.modifiedIntervalInMillis = baseIntervalInMillis;
    this.identifier = identifier;
    this.lastUpdatedAt = Date.now();
    this.ticksSinceLastUpdate = 0;
  }

  modifyIntervalByPercentage(percentageAmount: number) {
    this.modifiedIntervalInMillis = Math.ceil(this.modifiedIntervalInMillis * (1 - (percentageAmount / 100)));
  }

  update() : number {
    console.log(`updating: ${this.identifier} has baseInterval: ${this.baseIntervalInMillis} and modifiedInterval: ${this.modifiedIntervalInMillis}`);
    const now = Date.now();

    this.ticksSinceLastUpdate = Math.ceil(((now - this.lastUpdatedAt) / this.modifiedIntervalInMillis) * 100) / 100;
    this.lastUpdatedAt = now;
    return this.ticksSinceLastUpdate;
  }
}