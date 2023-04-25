import React from 'react';
import { convertMillisToCounter } from '../../utils';

export type DurationTimerProps = {
  taskStartedAt: number
  classname?: string
}
type DurationTimerState = {
  time: number
}
class DurationTimer extends React.Component<DurationTimerProps, any> {
  taskStartedAt: number
  interval: NodeJS.Timer | undefined
  classname: string | undefined
  state: DurationTimerState

  constructor(props: DurationTimerProps) {
    super(props);
    this.taskStartedAt = props.taskStartedAt;
    this.classname = props.classname;
    this.state = { time: Date.now() - props.taskStartedAt };
    // this.setState({ time: Date.now() - props.taskStartedAt });
  }

  componentDidMount(): void {
    this.setState({ time: Date.now() - this.taskStartedAt });
    this.interval = setInterval(() => this.setState({ time: Date.now() - this.taskStartedAt }), 1000);
  }

  componentWillUnmount(): void {
    clearInterval(this.interval);
  }

  render() {
    return (
      <span className={`duration-timer${this.classname ? ` ${this.classname}` : ''}`}>{convertMillisToCounter(this.state.time)}</span>
    )
  }
}

export default DurationTimer;
