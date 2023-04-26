import React, { useMemo } from 'react';
import SimplifyNumber from 'simplify-number';

export enum NumberRendererTypes {
  GOLD,
  ITEMS
};

export type NumberRendererProps = {
  value: number
  prefix?: string
  postfix?: string
  type?: NumberRendererTypes
  commaSeparated?: boolean
};
const numberCfg = {
  abbrev: ['k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n'],
  decimal: 3,
}

function NumberRenderer({value, type = NumberRendererTypes.ITEMS, prefix = '', postfix = '', commaSeparated = true}: NumberRendererProps) {
  const typeImg = useMemo(() => {
    if (type === NumberRendererTypes.GOLD) {
      return (
        <img src="./ItemDB/gold_coin.png" width="30px" alt="gold coins" />
      )
    }
    return undefined;
  }, [type]);
  const updatedValue = useMemo(() => {
    const newValue = value < 100000 ? value : SimplifyNumber(value, numberCfg)
    if (commaSeparated) {
      if (value > 999) {
        return newValue.toLocaleString();
      }
    }
    return newValue;
  }, [value, commaSeparated]);
  return (
    <span>{typeImg}{prefix}{updatedValue}{postfix}</span>
  );
}

export default NumberRenderer;