import React, { Component } from 'react';
import withFade from 'components/Global/box';

@withFade({duration:0.5})
class Box extends Component {

  render() {
    return <div className='box' />;
  }
}
export default Box;
