import React, { Component } from 'react';
import LazySlider from '../../components/Global/lazy-slider';

export default class Home extends Component {

  render() {
    const sliderOptions = {
      animationDuration: 700,
      slidesPerView: 1,
    };
    return (
      <div className='Home' key='home'>
        <LazySlider
          options={ sliderOptions }
          // activeIndex={ routerParametar }
          onChange={ (activeIndex) => {
            // update route to activeIndex
          } }
        >
          <div style={ { backgroundColor: 'blue', height: '200px' } }>name: prvi </div>
          <div style={ { backgroundColor: 'red', height: '200px' } }>name: drugi</div>
          <div style={ { backgroundColor: 'yellow', height: '200px' } }>name: treci</div>
          <div style={ { backgroundColor: 'pink', height: '200px' } }>name: cetvrti</div>
          <div style={ { backgroundColor: 'green', height: '200px' } }>name: peti</div>
          <div style={ { backgroundColor: 'orange', height: '200px' } }>name: sesti</div>
          <div style={ { backgroundColor: 'gray', height: '200px' } }>name: sedmi</div>
          <div style={ { backgroundColor: 'purple', height: '200px' } }>name: osmi</div>
          <div style={ { backgroundColor: 'brown', height: '200px' } }>name: deveti</div>
          <div style={ { backgroundColor: 'maroon', height: '200px' } }>name: deseti</div>
        </LazySlider>
      </div>
    );
  }
}
