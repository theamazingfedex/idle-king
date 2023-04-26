import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Cell } from 'styled-css-grid';
import { useBackgroundTask, useLocalStorage } from '../../../utils';
import './Banking.css'
import ItemDB, { Item, updateItemInItemsArray } from '../../../itemDb';
import NumberRenderer, { NumberRendererTypes } from '../../shared/NumberRenderer';
import CustomModal from '../../shared/CustomModal';

const testItems: Item[] = [
  { ...ItemDB.ORE_COAL, count: 20 },
  { ...ItemDB.ORE_GOLD, count: 5 },
  { ...ItemDB.WOOD_MAPLE, count: 3 },
];

function BankingHome() {
  const [playerItems, setItems, itemsLastUpdatedAt, fetchLatestItems] = useLocalStorage('idle-king-inventory', [] as Item[]);
  const [itemToDelete, setItemToDelete] = useState<number | undefined>();
  const [interval, updateInterval] = useState<NodeJS.Timer | undefined>();
  const [itemsToDisplay, setItemsToDisplay] = useState<Item[]>(playerItems);
  const [currentPlayerGP, setCurrentPlayerGP, gpLastUpdatedAt, fetchLatestGP] = useLocalStorage<number>('idle-king-player-gp', 0);

  useBackgroundTask((updatedItems: Item[]) => setItemsToDisplay(updatedItems));
  const updateInventory = useCallback((item: Item, numToAdd: number) => {
    const updatedItems = updateItemInItemsArray(item, itemsToDisplay, numToAdd);
    setItems(updatedItems);
    setItemsToDisplay(updatedItems);
  }, [itemsToDisplay, setItems]);

  useEffect(() => {
    // will mount:
    // add the timer
    updateInterval(setInterval(() => {
      setItemsToDisplay(
        fetchLatestItems()
      );
    }, 2000));
    return () => {
      // will unmount:
      clearInterval(interval);
    }
  }, []);

  // console.log(itemsToDisplay); // this gets rendered a second time every other render
  return (
    <div className="Bank-inventory-container">
      <div className="Bank-inventory-header">
        Tabs go here?
        <p>Current Gold Balance: <NumberRenderer postfix='gp' value={currentPlayerGP} type={NumberRendererTypes.GOLD} /></p>
        <p>Total Bank Value: <NumberRenderer postfix={' gp'} value={itemsToDisplay.reduce((sum, item) => (sum + (item.gvalue * item.count)), 0)} type={NumberRendererTypes.GOLD} /></p>
      </div>
      <Grid
        columns={8}
        gap={"0.5em"}
        justifyContent="center"
        alignContent="flex-start"
        className="Bank-inventory-grid"
        >
        {itemsToDisplay.length < 1 ? 'No Items Yet! Start your first task on the left!' : itemsToDisplay.map((item: Item, idx: number) => (
          <Cell className="Bank-inventory-cell" id={'bank-inventory-cell-' + item.id + '-' + idx} key={'bank-inventory-cell-' + item.id + '-' + idx}>
            <CustomModal
              parentElementId={'#bank-inventory-cell-' + item.id + '-' + idx}
              classname={'banking-modal Bank-inventory'}
              // modalStyle={{ content: {backgroundColor: 'green'}}}
              >
              <div className="Bank-inventory-cell">
                <img alt={`${item.displayName} icon in bank inventory`} src={`./ItemDB/${item.img}`}/>
                <p>{item.displayName} <NumberRenderer prefix={'x'}value={item.count}/></p>
                <p><NumberRenderer postfix=' gp' value={item.gvalue * item.count}/></p>
              </div>
              <div className="Bank-inventory-modal-content">
                sell all items? <span onClick={() => { updateInventory(item, -item.count); setCurrentPlayerGP(currentPlayerGP + (item.count * item.gvalue)); }}>click here</span>
              </div>
            </CustomModal>
          </Cell>
        ))}
      </Grid>
    </div>
  )
}

export default BankingHome;
