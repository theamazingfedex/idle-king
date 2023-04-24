import React, { useCallback, useMemo, useState } from 'react';
import './Mining.css';
import { Grid, Cell } from 'styled-css-grid';
import { useLocalStorage } from '../../../utils';
import ItemDB, { getItemById, Item } from '../../../itemDb';
import ProgressBar from '../../shared/ProgressBar';
import NumberRenderer from '../../shared/NumberRenderer';

function MiningHome() {
  // const [playerMiningLevel
  const baseMiningTth = 2500;
  const miningNodeItemIds: number[] = [1,2,3,4];
  const miningNodeItems: Item[] = useMemo(() => miningNodeItemIds.map((id: number) => getItemById(id) as Item), [miningNodeItemIds]);
  const [playerItems, updatePlayerItems] = useLocalStorage('idle-king-inventory', [] as Item[]);
  const [currentMiningTargetId, setCurrentMiningTargetId] = useState(0);

  const miningNodeClicked = useCallback((item: Item) => {
    if (currentMiningTargetId !== 0) {
      setCurrentMiningTargetId(0);
    } else {
      setCurrentMiningTargetId(item.id);
    }
  }, [currentMiningTargetId]);
  const getPlayerOreCount = useCallback((ore: Item) => playerItems.find(i => i.id === ore.id)?.count || 0, [playerItems]);
  const addOreToPlayerInventory = useCallback((item: Item) => {
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
    } else {
      updatePlayerItems([item]);
    }
  }, [playerItems, updatePlayerItems]);

  return (
    <div className="Mining-explorer-container">
    <Grid
      className="Mining-explorer-grid"
      columns={4}
      gap={"0.5em"}
      justifyContent="center"
      alignContent="center"
    >
      {miningNodeItems.map((item: Item, idx: number) => (
        <Cell className="Mining-explorer-cell" key={'mining-explorer-cell-' + item.id + '-' + idx} onClick={() => miningNodeClicked(item)}>
          <img alt={`${item.displayName} icon in bank inventory`} src={`./ItemDB/${item.img}`}/>
          <p>{item.displayName}{item.count > 1 ? <NumberRenderer prefix={'x'}value={item.count}/> : ''}</p>
          <p>Owned: {getPlayerOreCount(item)}</p>
          {currentMiningTargetId === item.id
            ? <ProgressBar durationInMillis={item.tthModifier + baseMiningTth} callback={() => addOreToPlayerInventory(item)} repeating/>
            : undefined }
        </Cell>
      ))}
    </Grid>

    </div>
  )
}

export default MiningHome;
