import React, { useEffect } from 'react';
import { Grid, Cell } from 'styled-css-grid';
import { useLocalStorage } from '../../../utils';
import './Banking.css'
import ItemDB, { Item } from '../../../itemDb';
import NumberRenderer from '../../shared/NumberRenderer';

const testItems: Item[] = [
  { ...ItemDB.ORE_COAL, count: 20 },
  { ...ItemDB.ORE_GOLD, count: 5 },
  { ...ItemDB.WOOD_MAPLE, count: 3 },
];

function BankingHome() {
  const [items] = useLocalStorage('idle-king-inventory', testItems as Item[]);

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
          <Cell className="Bank-inventory-cell" key={'bank-inventory-cell-' + item.id + '-' + idx}>
            <img alt={`${item.displayName} icon in bank inventory`} src={`./ItemDB/${item.img}`}/>
            <p>{item.displayName} <NumberRenderer prefix={'x'}value={item.count}/></p>
            <p>({item.gvalue * item.count}gp)</p>
          </Cell>
        ))}
      </Grid>
    </div>
  )
}

export default BankingHome;
