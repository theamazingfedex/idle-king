import React, { useCallback, useMemo } from 'react';
import ItemDB, { addItemToPlayerInventory, getItemById, Item, updateItemInItemsArray } from '../../../itemDb';
import { useBackgroundTask, usePlayerInventory, useSetPlayerTask } from '../../../utils';
import './Smithing.css';

const SmithingHome = () => {
  //TODO: resources get used, but no steel is added to inventory
  useBackgroundTask();
  // const [playerItems, currentPlayerTask, taskStartTime] = useBackgroundTask();
  const [currentTask, updatePlayerTask, taskStartTime, currentSkill] = useSetPlayerTask();
  const [playerItems, updatePlayerItems, inventoryLastUpdatedAt, getLatestPlayerItems] =  usePlayerInventory();
  const [ironCount, coalCount, steelCount] = useMemo(() => {
    console.log('recalc counts')
    return [
      getItemById(ItemDB.ORE_IRON.id, getLatestPlayerItems())?.count || 0,
      getItemById(ItemDB.ORE_COAL.id, getLatestPlayerItems())?.count || 0,
      getItemById(ItemDB.BAR_STEEL.id, getLatestPlayerItems())?.count || 0,
    ];

  }, [playerItems]);
  const smithingItems = [ItemDB.BAR_STEEL];

  const make1steel = useCallback((playerItems: Item[]) => {
    const foundCoal = playerItems.find((i: Item) => i.id === ItemDB.ORE_COAL.id)
    const foundIron = playerItems.find((i: Item) => i.id === ItemDB.ORE_IRON.id)
    if (foundCoal && foundIron && foundCoal.count >= 2 && foundIron.count >= 1) {
      let updatedItems = updateItemInItemsArray(ItemDB.ORE_COAL, playerItems, -2)
      updatedItems = updateItemInItemsArray(ItemDB.ORE_IRON, updatedItems, -1)
      updatePlayerItems(updatedItems);
    }
  }, [updatePlayerItems]);
  return (
    <div className='Smithing-home-container'>
      <p>Now this is smithing!</p>
      <div onClick={() => make1steel(playerItems)}>click here to make steel</div>
      <p>you currently have {coalCount} coal, {ironCount} iron, and {steelCount} steel</p>
    </div>
  );
}

export default SmithingHome;