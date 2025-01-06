import React, { Component, PropTypes } from 'react';
import { timer } from 'd3-timer';
import { interpolateObject, interpolateNumber } from 'd3-interpolate';

const duration = 750;

export class Text extends Component {

  componentDidMount() {
    let {props: {node: {xVal}}, refs: {node}} = this;

    node.setAttribute('x', xVal);

    let interp = interpolateObject({opacity: 1e-6, y: 0}, {opacity: 1, y: 200});
    this.transition = timer(elapsed => {
      let t = elapsed < duration ? (elapsed / duration): 1;
      let {opacity, y } = interp(t);
      node.setAttribute('y', y);
      node.setAttribute('opacity', opacity);
      if (t === 1) {
        this.transition.stop();
      }
    });
  }

  componentWillReceiveProps(next) {
    let {
      props: {node: {xVal, udid}, removeItem}, refs: {node}
    } = this;

    this.transition.stop();

    if (next.node.type === 'updating') {
      let interp = interpolateNumber(xVal, next.node.xVal);
      this.transition = timer(elapsed => {
        let t = elapsed < duration ? (elapsed / duration): 1;
        node.setAttribute('x', interp(t));
        if (t === 1) {
          this.transition.stop();
        }
      }); 
    } else { // Removing
      let interp = interpolateObject({y: 200, opacity: 1}, {y: 400, opacity: 1e-6});
      this.transition = timer(elapsed => {
        let t = elapsed < duration ? (elapsed / duration): 1;
        let { y, opacity } = interp(t);
        node.setAttribute('y', y);
        node.setAttribute('opacity', opacity);
        if (t === 1) {
          this.transition.stop();
          removeItem(udid);
        }
      }); 
    }
  }

  componentWillUnmount() {
    this.transition.stop();
  }

  render() {
    let {props: {node: {udid, fill}}} = this;

    return (
      <text ref='node' dy='0.35em' fill={fill} opacity={1e-6}>{udid}</text>
    );
  }
}

Text.propTypes = {
  node: PropTypes.shape({
    udid: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    fill: PropTypes.string.isRequired,
    xVal: PropTypes.number.isRequired
  }).isRequired,
  removeItem: PropTypes.func.isRequired
};
