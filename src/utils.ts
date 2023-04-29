import { useEffect, useState } from 'react';
import { addItemToPlayerInventory, getItemByTask, Item } from './itemDb';
import { AllSkills, AllTasks } from './types';

export const BaseTimeToHarvest: { [k: number]: { [i: string]: number }} = {
  [AllSkills.MINING]: {
    [AllTasks.MINING_COAL]: 2500,
    [AllTasks.MINING_COPPER]: 2500,
    [AllTasks.MINING_IRON]: 3000,
    [AllTasks.MINING_GOLD]: 3000,
  }
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
    return storedValue;
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

export function getTimeToHarvestInSeconds (baseTth: number, tthModifiers: number[]) {
  const tth = tthModifiers.reduce((sum, modifier) => sum + modifier, baseTth)
  return Math.ceil(tth/10)/100;
}

export function useSetPlayerTask(): [AllTasks, Function, number, AllSkills] {
  // check current task, if same task, ignore but continue
  // if different task, change to this task and set the taskStartedTime from localStorage
  const [taskStartTime, updateTaskStartTime] = useLocalStorage<number>('idle-king-current-task-start', Date.now());
  const [currentTask, updateCurrentTask] = useLocalStorage<AllTasks>('idle-king-current-task', AllTasks.IDLE);
  const [currentSkill, updateCurrentSkill] = useLocalStorage<AllSkills>('idle-king-current-skill', AllSkills.BANKING);

  const updatePlayerTask = (task: AllTasks = AllTasks.IDLE, skill: AllSkills = AllSkills.BANKING) => {
    if (currentTask !== task) {
      updateCurrentTask(task);
      updateCurrentSkill(skill);
      updateTaskStartTime(Date.now());
    } 
  }
  return [currentTask, updatePlayerTask, taskStartTime, currentSkill];
}

export function usePlayerCurrentTaskStartTime() {
  return useLocalStorage<number>('idle-king-current-task-start', Date.now());
}

export function usePlayerCurrentTask() {
  return useLocalStorage<AllTasks>('idle-king-current-task', AllTasks.IDLE);
}

export function usePlayerCurrentSkill() {
  return useLocalStorage<AllSkills>('idle-king-current-skill', AllSkills.BANKING);
}

export function usePlayerInventory(player?: string) {
      // const [playerItems, updatePlayerItems, inventoryLastUpdatedAt, getLatestPlayerItems] =
      return useLocalStorage('idle-king-inventory', [] as Item[]);
}
export function useBackgroundTask(updateComponentTrigger: (k: Item[]) => any = () => {}): [Item[], AllTasks, number] {
    const [currentPlayerTask, updatePlayerTask, taskStartTime, currentPlayerSkill] = useSetPlayerTask()
    const [playerItems, updatePlayerItems, inventoryLastUpdatedAt, getLatestPlayerItems] = useLocalStorage('idle-king-inventory', [] as Item[]);
    useEffect(() => { // did mount:
    // if (currentPlayerTask === AllTasks.IDLE) return;
    const targetedItem: Item | undefined = getItemByTask(currentPlayerTask); //Object.values(ItemDB).find(i => i.gatheringTask === currentPlayerTask)

    if (targetedItem && currentPlayerSkill && currentPlayerTask) {
    //   setCurrentMiningTargetId(targetedItem.id)
    //   // calc the time since last updated then divide by tth
      const timeDiff = Date.now() - inventoryLastUpdatedAt()
      const currentTth = BaseTimeToHarvest[currentPlayerSkill][currentPlayerTask] + (targetedItem?.tthModifier || 0);
      if (timeDiff > currentTth) {
        const offlineEarnings = Math.ceil(timeDiff / currentTth);
        const updatedInventory = addItemToPlayerInventory({ ...targetedItem, count: Math.max(0, offlineEarnings - 1) } as Item, getLatestPlayerItems(), updatePlayerItems);
        updateComponentTrigger(updatedInventory);
        // updatePlayerItems(updatedInventory);
      }
    }
    return () => {
      // will unmount:
    }
  }, [currentPlayerSkill, currentPlayerTask, getLatestPlayerItems, inventoryLastUpdatedAt, playerItems, updateComponentTrigger, updatePlayerItems]);
  return [playerItems, currentPlayerTask, taskStartTime]
}
