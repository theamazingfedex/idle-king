import React, { useMemo, useState } from 'react';
import './App.css';
import Header from './components/Header';
import MainPage from './components/MainPage';
import Sidebar from './components/Sidebar';
import MiningSkill from './components/skills/mining';
import BankingSkill from './components/skills/banking';
import { Grid, Cell } from 'styled-css-grid';
import { AllSkills } from './types';
import MarketingHome from './components/skills/marketing';

const getChosenViewTarget = (chosenTarget: AllSkills) => {
  switch (chosenTarget) {
    case AllSkills.BANKING:
      return <BankingSkill/>;
    case AllSkills.MINING:
      return <MiningSkill/>;
    case AllSkills.MARKETING:
      return <MarketingHome/>;
    default:
      return <BankingSkill/>;
  }
}

function App() {
  const [chosenViewTarget, setChosenViewTarget] = useState(AllSkills.BANKING);
  const viewTarget = useMemo(() => {
    return getChosenViewTarget(chosenViewTarget)
  }, [Math.random()]);

  return (
    <div className="App">
      <Grid columns={"1fr 3fr"} rows={"minmax(4em,auto) 1fr"} className="App-grid">
        <Cell width={2}>
          <Header/>
        </Cell>
        <Cell>
          <Sidebar setChosenViewTarget={setChosenViewTarget}/>
        </Cell>
        <Cell>
          <MainPage>
            {viewTarget}
          </MainPage>
        </Cell>
      </Grid>
    </div>
  );
}


export default App;
