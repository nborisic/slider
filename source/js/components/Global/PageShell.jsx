import React from 'react';
import ReactTransitionGroup from 'react-addons-css-transition-group';

const PageShell = Page => {
  return props =>
    <div className='page'>
      <p>neki naslov</p>
      <ReactTransitionGroup
        transitionAppear={ true }
        transitionAppearTimeout={ 5000 }
        transitionEnterTimeout={ 5000 }
        transitionLeaveTimeout={ 3000 }
        transitionName={ 'SlideOut' }
      >
        <Page { ...props } />
      </ReactTransitionGroup>
    </div>;
};
export default PageShell;
