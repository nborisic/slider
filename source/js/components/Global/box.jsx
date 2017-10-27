import React, { Component } from 'react';
import TweenMax from 'gsap';
import TransitionGroup from 'react-addons-transition-group';


const withFade = (ComposedComponent, options = { duration: 0.3 }) => class FadeUp extends Component {
  componentWillEnter(callback) {
    const el = this.container;
    TweenMax.fromTo(el, options.duration, { y: 100, opacity: 1 }, { y: 0, opacity: 1, onComplete: callback });
  }

  componentWillLeave(callback) {
    const el = this.container;
    TweenMax.fromTo(el, options.duration, { y: 0, opacity: 1 }, { y: -100, opacity: 1, onComplete: callback });
  }

  render() {
    return (
      <div ref={ c => this.container = c }>
        <ComposedComponent
          { ...this.props }
          element='b'
        />
      </div>
    );
  }
};

function fadesUp(Comp) {
  return typeof arguments[0] === 'function'
    ? withFade(arguments[0])
    : Comp => withFade(Comp, arguments[0]);
}

export default fadesUp;
