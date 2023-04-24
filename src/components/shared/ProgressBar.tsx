import React from 'react';
import CountdownTimer from './CountdownTimer';
// import ProgressTimer from 'react-progress-bar-timer';

export type ProgressBarProps = {
  durationInMillis: number
  repeating?: boolean
  callback: Function
}

function ProgressBar({durationInMillis, repeating, callback }: ProgressBarProps) {
  return (
  <div className="ProgressBar-container">
    {durationInMillis/1000}s
    <CountdownTimer endDate={new Date(Date.now() + durationInMillis)} onTimerExpire={callback} repeating={repeating} />
    {/* <ProgressTimer started={isStarted} showDuration onFinish={() => {callback()}} duration={Math.ceil(durationInMillis/1000)}/> */}
    &nbsp;
  </div>
  );
}

export default ProgressBar