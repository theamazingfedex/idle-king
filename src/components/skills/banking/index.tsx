import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Cell } from 'styled-css-grid';
import { useLocalStorage } from '../../../utils';
import './Banking.css'
import ItemDB, { Item } from '../../../itemDb';
import NumberRenderer from '../../shared/NumberRenderer';
import CustomModal from '../../shared/CustomModal';

const testItems: Item[] = [
  { ...ItemDB.ORE_COAL, count: 20 },
  { ...ItemDB.ORE_GOLD, count: 5 },
  { ...ItemDB.WOOD_MAPLE, count: 3 },
];

function BankingHome() {
  const [items, setItems, itemsLastUpdatedAt, fetchLatestItems] = useLocalStorage('idle-king-inventory', testItems as Item[]);
  const [itemToDelete, setItemToDelete] = useState<number | undefined>();
  const [interval, updateInterval] = useState<NodeJS.Timer | undefined>();

  const updateInventory = useCallback((item: Item, numToAdd: number) => {
    let updatedItems: Item[] = items.map((pitem: Item) => {
      if (pitem.id === item.id) {
        const newCount = numToAdd +  pitem.count;
        if (newCount <= 0) {
          setItemToDelete(item.id);
        }
        return { ...pitem, count: pitem.count + numToAdd };
      }
      else return pitem;
    });

    if (itemToDelete) {
      updatedItems = updatedItems.filter(i => i.id === itemToDelete)
    }

    setItems(updatedItems);
  }, [itemToDelete, items, setItems]);

  useEffect(() => {
    // will mount:
    // add the timer
    updateInterval(setInterval(() => {
      fetchLatestItems();
    }, 2000));
    return () => {
      // will unmount:
      clearInterval(interval);
    }
  }, []);

  console.log(items);
  return (
    <div className="Bank-inventory-container">
      <div className="Bank-inventory-header">
        Tabs go here?
      </div>
      <Grid
        columns={8}
        gap={"0.5em"}
        justifyContent="center"
        alignContent="flex-start"
        className="Bank-inventory-grid"
        >
        {items.length < 1 ? 'No Items Yet! Start your first task on the left!' : items.map((item: Item, idx: number) => (
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
                delete all items? <span onClick={() => { updateInventory(item, -item.count); }}>click here</span>
              </div>
            </CustomModal>
          </Cell>
        ))}
      </Grid>
    </div>
  )
}

export default BankingHome;
