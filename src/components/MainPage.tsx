import React from 'react';
import './MainPage.css';
// import BankingHome from './skills/banking';

type MainPageProps = {
  children: any
};

function MainPage({children}: MainPageProps) {
  return (
    <div className="MainPage">
      <>{children}</>
    </div>
  )
};

export default MainPage;
