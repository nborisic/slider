import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';

const slidesData = [
  {
    name: 'prvi',
    color: 'blue',
  },
  {
    name: 'drugi',
    color: 'red',
  },
  {
    name: 'treci',
    color: 'yellow',
  },
  {
    name: 'cetvrti',
    color: 'pink',
  },
  {
    name: 'peti',
    color: 'green',
  },
  {
    name: 'sesti',
    color: 'orange',
  },
  {
    name: 'sedmi',
    color: 'gray',
  },
  {
    name: 'osmi',
    color: 'purple',
  },
  {
    name: 'deveti',
    color: 'brown',
  },
  {
    name: 'deseti',
    color: 'maroon',
  },
  {
    name: 'jedanesti',
    color: 'fuchsia',
  },
  {
    name: 'dvanesti',
    color: 'navy',
  },
  {
    name: 'trinesti',
    color: 'olive',
  },
  // {
  //   name: 'cetrnaest',
  //   color: 'black',
  // },
];


const ANIMATION_DURATION = 1000;
const SLIDES_PER_VIEW = 3;
const slidesToRender = 3 * SLIDES_PER_VIEW;

class LazySlider extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
  }

  constructor(props) {
    super(props);

    const { slideView } = props.match.params;
    const redirectIndex = slideView % SLIDES_PER_VIEW ? Math.floor(slideView / SLIDES_PER_VIEW) * SLIDES_PER_VIEW + 1 : (Math.floor(slideView / SLIDES_PER_VIEW) - 1) * SLIDES_PER_VIEW + 1;
    const newActiveIndex = (slideView > slidesData.length || slideView < 0 || !slideView) ? 1 : redirectIndex;
    props.history.push(`/${ newActiveIndex }`);
    // window.history.pushState({}, 'bla', `/${ newActiveIndex }`);
    this.state = {
      activeIndex: newActiveIndex - 1,
      slides: slidesData,
      animate: null,
      jump: false,
      shift: null,
    };
    this.jumpRender = this.jumpRender.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { slideView } = this.props.match.params;
    if (slideView !== nextProps.match.params.slideView) {
      const animate = (slideView - nextProps.match.params.slideView === SLIDES_PER_VIEW
        || nextProps.match.params.slideView - slideView === slidesData.length - SLIDES_PER_VIEW
        || (slideView - nextProps.match.params.slideView !== SLIDES_PER_VIEW && slideView - nextProps.match.params.slideView > 0 && slideView < nextProps.match.params.slideView)
      ) ? 'left' : 'right';
      // slucaj gde slider ulazi u loop
      const translateDistace = -(Math.floor(slidesToRender / 2) - Math.floor(SLIDES_PER_VIEW / 2)) / slidesToRender * 100;
      if (slideView > slidesData.length - SLIDES_PER_VIEW + 1 && nextProps.match.params.slideView <= SLIDES_PER_VIEW) {
        this.setState({
          shift: `translateX(${ translateDistace - 1 / slidesToRender * 100 * (slidesData.length - slideView + 1) }%)`,
        });
      } else if (Number(slideView) === 1 && nextProps.match.params.slideView >= slidesData.length - SLIDES_PER_VIEW + 1) {
        this.setState({
          shift: `translateX(${ translateDistace + 1 / slidesToRender * 100 * (slidesData.length - (Math.ceil(slidesData.length / SLIDES_PER_VIEW) - 1) * SLIDES_PER_VIEW) }%)`,
        });
      } else if (slideView <= SLIDES_PER_VIEW && Number(slideView) !== 1 && Number(nextProps.match.params.slideView) === 1) {
        this.setState({
          shift: `translateX(${ translateDistace + 1 / slidesToRender * 100 * (slideView - 1) }%)`,
        });
      }

      if (Math.abs(slideView - nextProps.match.params.slideView) - SLIDES_PER_VIEW !== 0) {
        this.setState({
          jump: true,
        });
      }
      this.setState({
        animate,
      });

      setTimeout(() => {
        this.setState({
          jump: false,
          animate: null,
          activeIndex: nextProps.match.params.slideView - 1,
          shift: null,
        });
      }, ANIMATION_DURATION);
    }
  }

  changeSlide(offset) {
    const { animate, slides, activeIndex } = this.state;

    if (animate) {
      return;
    }

    let newIndex = (activeIndex + offset) % slides.length;
    if (activeIndex + offset > slides.length) newIndex = 0;
    if (activeIndex === 0 && activeIndex + offset < 0) newIndex = (Math.ceil(slidesData.length / SLIDES_PER_VIEW) - 1) * SLIDES_PER_VIEW;
    newIndex = newIndex < 0 ? 0 : newIndex;

    this.props.history.push(`/${ newIndex + 1 }`);
  }

  jumpRender() {
    const { slides, activeIndex, animate } = this.state;
    const { slideView } = this.props.match.params;
    const slideElements = [];
    const concatElements = [];

    const startIndex = slides.length - (Math.floor(slidesToRender / 2) - activeIndex) + Math.floor(SLIDES_PER_VIEW / 2);
    const slideWidth = 1 / slidesToRender * SLIDES_PER_VIEW * 100;
    for (let i = 0; i < slidesToRender; i++) {
      const slide = slides[(startIndex + i) % slides.length];
      slideElements.push(
        <div
          style={ {
            width: `${ slideWidth }%`,
            height: 300,
            backgroundColor: slide.color,
          } }
          key={ startIndex + i }
        >
          { slide.name }
        </div>
      );
    }
    for (let i = 0; i < SLIDES_PER_VIEW; i++) {
      const slide = slides[(slideView - 1 + i) % slides.length];
      concatElements.push(
        <div
          style={ {
            width: `${ slideWidth }%`,
            height: 300,
            backgroundColor: slide.color,
          } }
          key={ `jump${ i }` }
        >
          { slide.name }
        </div>
      );
    }

    const leftElements = slideElements.slice(0, 2 * SLIDES_PER_VIEW);
    const rightElements = slideElements.slice(SLIDES_PER_VIEW, 3 * SLIDES_PER_VIEW);
    return animate === 'right' ? leftElements.concat(concatElements) : concatElements.concat(rightElements);
  }

  renderSlides() {
    const { slides, activeIndex } = this.state;

    const slideElements = [];

    const startIndex = slides.length - (Math.floor(slidesToRender / 2) - activeIndex) + Math.floor(SLIDES_PER_VIEW / 2);

    const slideWidth = 1 / slidesToRender * SLIDES_PER_VIEW * 100;
    for (let i = 0; i < slidesToRender; i++) {
      const slide = slides[(startIndex + i) % slides.length];
      slideElements.push(
        <div
          style={ {
            width: `${ slideWidth }%`,
            height: 300,
            backgroundColor: slide.color,
          } }
          key={ i }
        >
          { slide.name }
        </div>
      );
    }
    return slideElements;
  }

  renderBoxes() {
    const { slides } = this.state;
    const boxElements = [];
    for (let i = 0; i < Math.ceil(slides.length / SLIDES_PER_VIEW); i++) {
      boxElements.push(
        <NavLink to={ `/${ i * SLIDES_PER_VIEW + 1 }` } key={ i } activeClassName='active'><div
          style={ {
            width: '20px',
            height: '20px',
            backgroundColor: 'grey',
            margin: '5px',
          } }
        />
        </NavLink>
      );
    }
    return boxElements;
  }

  render() {
    const { animate, shift } = this.state;


    const translateDistace = -(Math.floor(slidesToRender / 2) - Math.floor(SLIDES_PER_VIEW / 2)) / slidesToRender * 100;
    let transform = `translateX(${ translateDistace }%)`;
    if (animate === 'left') {
      transform = `translateX(${ translateDistace + 1 / slidesToRender * 100 * SLIDES_PER_VIEW }%)`;
    } else if (animate === 'right') {
      transform = `translateX(${ translateDistace - 1 / slidesToRender * 100 * SLIDES_PER_VIEW }%)`;
    }
    transform = shift || transform;
    return (
      <div id='slider'>
        <div style={ { width: '100%', overflow: 'hidden' } }>
          <div
            style={ {
              width: '300%',
              display: 'flex',
              transform,
              transition: animate ? `transform ${ ANIMATION_DURATION }ms` : null,
            } }
          >
            {this.state.jump && !shift ? this.jumpRender() : this.renderSlides() }
          </div>
          <div style={ { display: 'flex' } } className={ animate ? 'deactivate' : '' } >
            { this.renderBoxes() }
          </div>
        </div>
        <button onClick={ () => this.changeSlide(-SLIDES_PER_VIEW) }>prev</button>
        <button onClick={ () => this.changeSlide(SLIDES_PER_VIEW) }>next</button>
      </div>
    );
  }
}
export default withRouter(LazySlider);
