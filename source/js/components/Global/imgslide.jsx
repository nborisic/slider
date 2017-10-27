import React from 'react';
import ReactTransitionGroup from 'react-addons-css-transition-group';
import Book from '../../../assets/img/book1.jpg';

const ImgSlide = () => {
  return (
    <div className='page'>
      <p>neki naslov</p>
      <ReactTransitionGroup
        transitionAppear={ true }
        transitionAppearTimeout={ 5000 }
        transitionEnterTimeout={ 5000 }
        transitionLeaveTimeout={ 3000 }
        transitionName='example'
      >
        <img src={ Book } alt='' />
      </ReactTransitionGroup>
    </div>
  );
};
export default ImgSlide;
