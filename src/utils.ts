import { useCallback, useState } from 'react';

export enum AllTasks {
  IDLE,
  MINING_COAL,
  MINING_COPPER,
  MINING_IRON,
  MINING_GOLD,
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

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.localStorage.setItem(key+'-last-updated', JSON.stringify(Date.now()));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }

  };

  const getValueLastUpdatedAt = () => {
    if (typeof window !== "undefined") {
      return Number(window.localStorage.getItem(key+'-last-updated')) || Date.now();
    }
    return Date.now();
  }
  const fetchLatestValue = () => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : storedValue;
    }
    return Date.now();
  }

  return [storedValue, setValue, getValueLastUpdatedAt, fetchLatestValue] as const;
}

export function convertMillisToCounter(timeInMillis: number) {
  const modifiedTimeInMillis = timeInMillis + 1000;
  let days = Math.floor(modifiedTimeInMillis / (1000 * 60 * 60 * 24));
  let hours = Math.floor((modifiedTimeInMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((modifiedTimeInMillis % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((modifiedTimeInMillis % (1000 * 60)) / 1000);
  let timeStr = '';
  timeStr += days ? days + ` day${days > 1 ? 's' : ''} ` : "";
  timeStr += hours ? hours + ` hour${hours > 1 ? 's' : ''} ` : "";
  timeStr += minutes ? minutes  + ` minute${minutes > 1 ? 's' : ''} ` : "";
  timeStr += seconds ? seconds + ` second${seconds > 1 ? 's' : ''} ` : "";
  return timeStr;
}

export function getTimeToHarvest (baseTth: number, tthModifiers: number[]) {
  const tth = tthModifiers.reduce((sum, modifier) => sum + modifier, baseTth)
  return Math.ceil(tth/10)/100;
}

export function useSetPlayerTask(): [AllTasks, Function, number] {
  // check current task, if same task, ignore but continue
  // if different task, change to this task and set the taskStartedTime from localStorage
  const [taskStartTime, updateTaskStartTime] = useLocalStorage<number>('idle-king-current-task-start', Date.now());
  const [currentTask, updateCurrentTask] = useLocalStorage<AllTasks>('idle-king-current-task', AllTasks.IDLE);

  const updatePlayerTask = (task: AllTasks = AllTasks.IDLE) => {
    if (currentTask !== task) {
      updateCurrentTask(task);
      updateTaskStartTime(Date.now());
    } 
  }
  return [currentTask, updatePlayerTask, taskStartTime];
}
