import React, { Component, PropTypes } from 'react';
import { timer } from 'd3-timer';
import { interpolateNumber, interpolateTransformSvg } from 'd3-interpolate';

export class XAxisTick extends Component {

  componentDidMount() {
    this.isMounting(this.props, null, this.refs);
  }

  componentWillReceiveProps(next) {
    let {props, refs} = this;

    if (props.tick !== next.tick) {
      this.transition.stop();

      switch (next.tick.type) {
      case 'MOUNTING':
        return this.isMounting(props, next, refs);
      case 'UPDATING':
        return this.isUpating(props, next, refs);
      case 'REMOVING':
        return this.isRemoving(props, next, refs);
      default:
        throw new Error('Invalid tick Type');
      } 
    }
  }

  isMounting(props, next, refs) {
    let {tick} = refs;
    let {xScale, tick: {data}, duration} = props;

    let beg = next ? `translate(${xScale(data)},0)`: 'translate(0,0)';
    let end = next ? `translate(${next.xScale(next.tick.data)},0)`: `translate(${xScale(data)},0)`;

    let interp0 = interpolateTransformSvg(beg, end);
    let interp1 = interpolateNumber(1e-6, 1);

    this.transition = timer(elapsed => {
      let t = elapsed < duration ? (elapsed / duration): 1;
      tick.setAttribute('transform', interp0(t));
      tick.setAttribute('opacity', interp1(t));
      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  isUpating(props, next, refs) {
    let {tick} = refs;
    let {xScale, tick: {data}, duration} = props;

    let beg = `translate(${xScale(data)},0)`;
    let end = `translate(${next.xScale(next.tick.data)},0)`;

    let interp0 = interpolateTransformSvg(beg, end);
    let interp1 = interpolateNumber(tick.getAttribute('opacity'), 1);

    this.transition = timer(elapsed => {
      let t = elapsed < duration ? (elapsed / duration): 1;
      tick.setAttribute('transform', interp0(t));
      tick.setAttribute('opacity', interp1(t));
      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  isRemoving(props, next, refs) {
    let {tick} = refs;
    let {xScale, tick: {data}, duration} = props;

    let beg = `translate(${xScale(data)},0)`;
    let end = `translate(${next.xScale(next.tick.data)},0)`;

    let interp0 = interpolateTransformSvg(beg, end);
    let interp1 = interpolateNumber(tick.getAttribute('opacity'), 1e-6);

    this.transition = timer(elapsed => {
      let t = elapsed < duration ? (elapsed / duration): 1;
      tick.setAttribute('transform', interp0(t));
      tick.setAttribute('opacity', interp1(t));
      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  componentWillUnmount() {
    this.transition.stop();
  }

  render() {
    let {yScale, tick: {text}} = this.props;

    let yRange = yScale.range();

    return (
      <g ref='tick' opacity={1e-6}>
        <line
          style={{pointerEvents: 'none'}}
          x1={0} y1={yRange[0]}
          x2={0} y2={yRange[1]}
          opacity={0.2}
          stroke='#fff'
        />
        <text
          fontSize={'9px'}
          textAnchor='middle'
          fill='white'
          x={0} y={-5} 
        >{text}</text>
      </g>
    );
  }
}

XAxisTick.propTypes = {
  tick: PropTypes.shape({
    udid: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    xVal: React.PropTypes.number.isRequired,
    data: React.PropTypes.object.isRequired,
    text: React.PropTypes.string.isRequired
  }).isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  duration: PropTypes.number.isRequired,
  removeTick: PropTypes.func.isRequired
};
