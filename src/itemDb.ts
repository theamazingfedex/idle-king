import { AllTasks } from "./types"

export type Item = {
  img: string
  displayName: string
  id: number
  gvalue: number
  count: number
  xp: number
  tthModifier: number
  level: number
  gatheringTask?: AllTasks
}

const ItemDB: { [k: string]: Item } = {
  // GOLD_COIN: { img: 'gold_coin.png', displayName: 'Gold Coin', id: 0, gvalue: 0, count: 1, xp: 0, tthModifier: 0, level: 0 },
  ORE_COAL: { img: 'coal.png', displayName: 'Coal', id: 1, gvalue: 1, count: 1, xp: 5, tthModifier: 0, level: 1, gatheringTask: AllTasks.MINING_COAL },
  ORE_COPPER: { img: 'ore_copper.png', displayName: 'Copper Ore', id: 2, gvalue: 2, count: 1, xp: 5, tthModifier: 250, level: 1, gatheringTask: AllTasks.MINING_COPPER },
  ORE_IRON: { img: 'ore_iron.png', displayName: 'Iron Ore', id: 3, gvalue: 5, count: 1, xp: 10, tthModifier: 250, level: 3, gatheringTask: AllTasks.MINING_IRON },
  ORE_GOLD: { img: 'ore_gold.png', displayName: 'Gold Ore', id: 4, gvalue: 15, count: 1, xp: 10, tthModifier: 1000, level: 5, gatheringTask: AllTasks.MINING_GOLD },
  WOOD_PINE: { img: 'wood_pine.png', displayName: 'Pine Logs', id: 5, gvalue: 1, count: 1, xp: 5, tthModifier: 0, level: 1 },
  WOOD_OAK: { img: 'wood_oak.png', displayName: 'Oak Logs', id: 6, gvalue: 5, count: 1, xp: 10, tthModifier: 250, level: 5 },
  WOOD_MAPLE: { img: 'wood_maple.png', displayName: 'Maple Logs', id: 7, gvalue: 10, count: 1, xp: 15, tthModifier: 1000, level: 10 },
};

export const getItemByTask = (task: AllTasks) => Object.values(ItemDB).find((v: any) => v.gatheringTask === task);
export const getItemById = (itemId: number) => Object.values(ItemDB).find((v: any) => v.id === itemId);
export const updateItemInItemsArray = (item: Item, inventoryItems: Item[], numToAdd: number) => {
  let itemToDelete: number = -1;

  let updatedItems: Item[] = inventoryItems.map((pitem: Item) => {
    if (pitem.id === item.id) {
      const newCount = numToAdd + pitem.count;
      if (newCount <= 0) {
        itemToDelete = item.id;
      }
      return { ...pitem, count: newCount};
    }
    else return pitem;
  });

  if (itemToDelete >= 0) {
    updatedItems = updatedItems.filter(i => i.id !== itemToDelete)
  }
  return updatedItems;
};
export const addItemToPlayerInventory = (item: Item, playerItems: Item[], updatePlayerItems: (items: Item[]) => any): Item[] => {
    if (playerItems.length > 0){
      // add the item if the player doesn't have it
      let playerDoesntOwn = true;
      const newItems = playerItems.map((pitem: Item) => {
        if (item.id === pitem.id) {
          playerDoesntOwn = false;
          return {...pitem, count: pitem.count + item.count};
        } else return pitem;
      });
      if (playerDoesntOwn) {
        newItems.push(item);
      }
      updatePlayerItems(newItems);
      return newItems;
    } else if (item.count > 0) {
      updatePlayerItems([item]);
      return [item];
    } else {
      return playerItems
    }
  }

export default ItemDB;