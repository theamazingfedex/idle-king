import React, { useCallback, useMemo, useState } from 'react';
import CountdownTimer from './CountdownTimer';
// import ProgressTimer from 'react-progress-bar-timer';

export type ProgressBarProps = {
  durationInMillis: number
  repeating?: boolean
  callback: Function
}

function ProgressBar({durationInMillis, repeating, callback }: ProgressBarProps) {
  const [needsNewEndDate, updateEndDate] = useState(false);
  const wrappedCallback = useCallback(() => {
    callback();
    updateEndDate(true);
  }, [callback]);
  const endDate = useMemo(() => {
    if (needsNewEndDate) {
      updateEndDate(false);
    console.log('needs new end date')
    }
      return new Date(Date.now() + durationInMillis)
  },
    [durationInMillis, needsNewEndDate]
  );

  return (
  <div className="ProgressBar-container">
    <CountdownTimer endDate={endDate} onTimerExpire={wrappedCallback} repeating={repeating} />
    {/* <ProgressTimer started={isStarted} showDuration onFinish={() => {callback()}} duration={Math.ceil(durationInMillis/1000)}/> */}
    &nbsp;
  </div>
  );
}

export default ProgressBar