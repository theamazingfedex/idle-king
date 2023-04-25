import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Line } from 'rc-progress';
import { debounce } from 'debounce';


export type CountdownTimerProps = {
  endDate: Date,
  repeating?: boolean
  onTimerExpire: Function
}
type CountdownTimerStateType = {
  endDate: Date,
  startDate: Date,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
  millis: number,
  expired: boolean,
  distance: number,
  started?: boolean,
  intervals: NodeJS.Timer[],
}

class CountdownTimer extends Component<CountdownTimerProps, any> {
  baseState: CountdownTimerStateType
  state: CountdownTimerStateType
  debouncedCompletionTrigger: Function | any

  constructor(props: CountdownTimerProps) {
    super(props);
    const startDate = new Date();
    const distance = props.endDate.getTime() - startDate.getTime();

    this.state = {
        endDate: props.endDate,
        startDate: new Date(),
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        millis: 0,
        distance,
        expired: false,
        intervals: []
    } as CountdownTimerStateType;
    this.baseState = this.state;
    const distancePct = Math.ceil((distance/100) * 95);
    console.log('DISTANCE PERCENTAGE: ', distancePct);
    this.debouncedCompletionTrigger = debounce(() => this.props.onTimerExpire(), distancePct, true);
  }

  startTimer() {
    let self = this;

    let x = setInterval(() => {

      let now = Date.now();
      let distance = self.state.endDate.getTime() - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      let millis = Math.floor((distance));

      self.setState({
        days,
        hours,
        minutes,
        seconds,
        millis,
        distance
      });

      if (distance <= 0) {
        clearInterval(x);
        console.log('FINISHED AN EVENT')
        self.setState({
            expired: true,
            intervals: this.state.intervals.filter(int => int != x)
        });
      }
    }, 100);
    // TODO: see about tracking all the intervals and removing them when we unmount to prevent hidden updates
    self.setState({ intervals: [...self.state.intervals, x] })
  }

  componentWillUnmount(): void {
    this.state.intervals.forEach(interval => clearInterval(interval));
    this.debouncedCompletionTrigger.clear();
  }
  componentDidMount() {
    const { endDate } = this.props;

    this.setState({
        endDate: endDate,
        startDate: new Date(),
        started: true,
    });
    this.startTimer();
  }

  formatTime(type: number): string | number {
    let timeStr = "";
    console.log(this.state.distance);
    const originalDistance = this.state.endDate.getTime() - this.state.startDate.getTime();
    const progressPercentage = this.state.distance === 0 ? 0 : Math.ceil(((originalDistance - this.state.distance) / originalDistance) * 100);

    switch (type) {
      case 0:
        // timeStr += Math.ceil(100*(this.state.distance / this.state.endDate.getTime()))/100;
        timeStr += progressPercentage;
        break;
      case 1:
        timeStr += this.state.days ? (`${this.state.days}`.padStart(2, '0')) + ":" : "";
        timeStr += this.state.hours ? (`${this.state.hours}`.padStart(2, '0')) + ":" : "";
        timeStr += this.state.minutes ? (`${this.state.minutes}`.padStart(2, '0'))  + ":" : "";
        timeStr += this.state.seconds ? (this.state.seconds) : "0";
        timeStr += this.state.millis ? (`.${this.state.millis}`) : "";
        timeStr += 's';
        break;
      case 2:
        timeStr += this.state.days ? (this.state.days > 9 ? this.state.days : "0" + this.state.days) + " days " : "";
        timeStr += this.state.hours ? (this.state.hours > 9 ? this.state.hours : "0" + this.state.hours) + " hours " : "";
        timeStr += this.state.minutes ? (this.state.minutes > 9 ? this.state.minutes : "0" + this.state.minutes)  + " minutes " : "";
        timeStr += this.state.seconds ? (this.state.seconds > 9 ? this.state.seconds : "0" + this.state.seconds) + " seconds " : "00";
        break;
    }

    return timeStr;
  }


  render() {
    if (this.state.started) {
      // this.startTimer();
      this.setState({ expired: false, started: false });
    } else if (this.state.expired) {
      this.debouncedCompletionTrigger();
      // this.props.onTimerExpire();
      if (this.props.repeating) {
        this.setState({ ...this.baseState, expired: false, endDate: this.props.endDate, startDate: new Date() });
        this.startTimer();
      } else {
        this.setState({ expired: false, started: false });
      }
    }

    const percent = Math.min(100, Number(this.formatTime(0)));
    const countdown = this.formatTime(1);
    console.log('percentage: ', percent);
    console.log('isRepeating: ', this.props.repeating);
    const transitionDuration = Math.ceil((this.state.startDate.getTime() - this.state.endDate.getTime()) / 100) / 10;
    const lineTransition = `stroke-dashoffset ${transitionDuration}s ease-in-out 0s`;

    return (
      <>
        {countdown}
        <Line percent={percent} steps={100} strokeWidth={10} transition={lineTransition} />
      </>
    );
  }
}

export default CountdownTimer;