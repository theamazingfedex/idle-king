export enum AllTasks {
  IDLE,
  MINING_COAL,
  MINING_COPPER,
  MINING_IRON,
  MINING_GOLD,
  SMITHING_STEEL_BAR,
}

export enum AllSkills {
  BANKING,
  MARKETING,
  MINING,
  SMITHING,
  WOODCUTTING,
  WOODWORKING,
  RUNECRAFTING,
  ENCHANTING,
}

export type LevelInfo = {
  level: number
  xp: number
  difference: number
}
export type FixedSizeArray<N extends number, T> = N extends 0 ? never[] : {
    0: T;
    length: N;
} & ReadonlyArray<T>;
