import React, { Component } from 'react';
import LazySlider from '../../components/Global/lazy-slider';

export default class Home extends Component {

  render() {
    return (
      <div className='Home' key='home'>
        <LazySlider
          slidesPerView={ 3 }
          animationDuration={ 1000 }
          showNavigation={ true }
          showArrows={ true }
          autoplay={ false }
          autoplayTurnTime={ 10000 }
          loop={ false }
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
          <div style={ { backgroundColor: 'olive', height: '200px' } }>name: jedanesti</div>
          <div style={ { backgroundColor: 'Beige', height: '200px' } }>name: dvanesti</div>
          <div style={ { backgroundColor: 'Chartreuse', height: '200px' } }>name: trinesti</div>
          <div style={ { backgroundColor: 'CornflowerBlue', height: '200px' } }>name: cetrnesti</div>

        </LazySlider>
      </div>
    );
  }
}
