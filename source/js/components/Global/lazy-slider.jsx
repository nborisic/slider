import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class LazySlider extends Component {
  static propTypes = {
    match: PropTypes.object,

    children: PropTypes.array,
  }

  static defaultProps = {
    animationDuration: 500,
    slidesPerView: 1,
    activeIndex: 0,
    showNavigation: true,
    showArrows: true,
    loop: true,
    onChange: null,
    autoplay: false,
    autoplayTimeout: 1000, // ?
  }

  constructor(props) {
    super(props);
    const { match: { params: { slideView } }, slidesPerView } = this.props;

    const redirectIndex = slideView % slidesPerView ?
      Math.floor(slideView / slidesPerView) * slidesPerView + 1 :
      (Math.floor(slideView / slidesPerView) - 1) * slidesPerView + 1;
    const newActiveIndex = (slideView > this.props.children.length || slideView < 0 || !slideView) ? 1 : redirectIndex;
    this.state = {
      activeIndex: newActiveIndex - 1,
      slides: this.props.children,
      slidesToRender: 3 * slidesPerView,
      animate: null,
      jump: false,
      shift: null,
      jumpIndex: newActiveIndex - 1,
    };
    this.jumpRender = this.jumpRender.bind(this);
    this.boxJump = this.boxJump.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { slideView } }, animationDuration } = this.props;

    this.setAnimation(nextProps.match.params, slideView);

    this.setState({
      jumpIndex: nextProps.match.params.slideView - 1,
    });

    setTimeout(() => {
      this.setState({
        jump: false,
        animate: null,
        activeIndex: nextProps.match.params.slideView - 1,
        shift: null,
      });
    }, animationDuration);
  }

  setAnimation(newUrlIndex, activeUrlIndex) {
    const { slidesPerView } = this.props;
    const { slidesToRender, slides } = this.state;

    const animateSlide = (activeUrlIndex - newUrlIndex === slidesPerView
      || newUrlIndex - activeUrlIndex === slides.length - slidesPerView
      || (activeUrlIndex - newUrlIndex !== slidesPerView && activeUrlIndex - newUrlIndex > 0 && activeUrlIndex < newUrlIndex)
    ) ? 'left' : 'right';
    // slucaj gde slider ulazi u loop
    const translateDistace = -(Math.floor(slidesToRender / 2) - Math.floor(slidesPerView / 2)) / slidesToRender * 100;
    if (activeUrlIndex > slides.length - slidesPerView + 1 && newUrlIndex <= slidesPerView) {
      this.setState({
        shift: `translateX(${ translateDistace - 1 / slidesToRender * 100 * (slides.length - activeUrlIndex + 1) }%)`,
      });
    } else if (Number(activeUrlIndex) === 1 && newUrlIndex >= slides.length - slidesPerView + 1) {
      this.setState({
        shift: `translateX(${ translateDistace + 1 / slidesToRender * 100 * (slides.length - (Math.ceil(slides.length / slidesPerView) - 1) * slidesPerView) }%)`,
      });
    } else if (activeUrlIndex <= slidesPerView && Number(activeUrlIndex) !== 1 && Number(newUrlIndex) === 1) {
      this.setState({
        shift: `translateX(${ translateDistace + 1 / slidesToRender * 100 * (activeUrlIndex - 1) }%)`,
      });
    }

    if (Math.abs(activeUrlIndex - newUrlIndex) - slidesPerView !== 0) {
      this.setState({
        jump: true,
      });
    }
    this.setState({
      animate: animateSlide,
    });
  }

  changeSlide(offset) {
    const { animate, slides, activeIndex } = this.state;
    const { animationDuration, slidesPerView } = this.props;
    if (animate) {
      return;
    }

    let newIndex = (activeIndex + offset) % slides.length;
    if (activeIndex + offset > slides.length) {
      newIndex = 0;
    } else if (activeIndex === 0 && activeIndex + offset < 0) {
      newIndex = (Math.ceil(slides.length / slidesPerView) - 1) * slidesPerView;
    }
    newIndex = newIndex < 0 ? 0 : newIndex;

    const newUrlIndex = newIndex + 1;
    const activeUrlIndex = activeIndex + 1;
    this.setAnimation(newUrlIndex, activeUrlIndex);

    this.setState({
      jumpIndex: newIndex,
    });

    setTimeout(() => {
      this.setState({
        jump: false,
        animate: null,
        activeIndex: newIndex,
        shift: null,
      });
    }, animationDuration);

    history.pushState(null, null, `/${ newIndex + 1 }`);
  }

  boxJump(i) {
    const { animationDuration, slidesPerView } = this.props;
    const { activeIndex } = this.state;
    const newUrlIndex = i * slidesPerView + 1;
    const activeUrlIndex = activeIndex + 1;

    this.setAnimation(newUrlIndex, activeUrlIndex);

    this.setState({
      jumpIndex: i * slidesPerView,
    });

    setTimeout(() => {
      this.setState({
        jump: false,
        animate: null,
        activeIndex: i * slidesPerView,
        shift: null,
      });
    }, animationDuration);

    history.pushState(null, null, `/${ i * slidesPerView + 1 }`);
  }

  jumpRender() {
    const { slides, activeIndex, animate, jumpIndex, slidesToRender } = this.state;
    const { slidesPerView } = this.props;

    const slideElements = [];
    const concatElements = [];
    const startIndex = slides.length - (Math.floor(slidesToRender / 2) - activeIndex) + Math.floor(slidesPerView / 2);
    const slideWidth = 1 / slidesToRender * slidesPerView * 100;
    for (let i = 0; i < slidesToRender; i++) {
      const slide = slides[(startIndex + i) % slides.length];
      slideElements.push(
        <div
          style={
          {
            width: `${ slideWidth }%`,
            height: 300,
          }
        }
          key={ startIndex + i }
        >
          { slide }
        </div>
      );
    }
    for (let i = 0; i < slidesPerView; i++) {
      const slide = slides[(jumpIndex + i) % slides.length];
      concatElements.push(
        <div
          style={
          {
            width: `${ slideWidth }%`,
            height: 300,
          }
        }
          key={ `jump${ i }` }
        >
          { slide }
        </div>
      );
    }

    const leftElements = slideElements.slice(0, 2 * slidesPerView);
    const rightElements = slideElements.slice(slidesPerView, 3 * slidesPerView);
    return animate === 'right' ? leftElements.concat(concatElements) : concatElements.concat(rightElements);
  }

  renderSlides() {
    const { slides, activeIndex, slidesToRender } = this.state;
    const { slidesPerView } = this.props;

    const slideElements = [];

    const startIndex = slides.length - (Math.floor(slidesToRender / 2) - activeIndex) + Math.floor(slidesPerView / 2);
    const slideWidth = 1 / slidesToRender * slidesPerView * 100;
    for (let i = 0; i < slidesToRender; i++) {
      const slide = slides[(startIndex + i) % slides.length];
      slideElements.push(
        <div
          style={
          {
            width: `${ slideWidth }%`,
            height: 300,
          }
        }
          key={ i }
        >
          { slide }
        </div>
      );
    }
    return slideElements;
  }

  renderBoxes() {
    const { slides, jumpIndex } = this.state;
    const { slidesPerView } = this.props;

    const boxElements = [];
    for (let i = 0; i < Math.ceil(slides.length / slidesPerView); i++) {
      const activeClass = (i * slidesPerView <= jumpIndex && jumpIndex < (i + 1) * slidesPerView) ? 'active' : '';
      boxElements.push(
        <a href='/' onClick={ (e) => { this.boxJump(i); e.preventDefault(); } } key={ i } className={ activeClass } ><div
          style={ {
            width: '20px',
            height: '20px',
            backgroundColor: 'grey',
            margin: '5px',
          } }
        />
        </a>
      );
    }
    return boxElements;
  }

  render() {
    const { animate, shift, slidesToRender } = this.state;
    const { animationDuration, slidesPerView } = this.props;

    const translateDistace = -(Math.floor(slidesToRender / 2) - Math.floor(slidesPerView / 2)) / slidesToRender * 100;
    let transform = `translateX(${ translateDistace }%)`;
    if (animate === 'left') {
      transform = `translateX(${ translateDistace + 1 / slidesToRender * 100 * slidesPerView }%)`;
    } else if (animate === 'right') {
      transform = `translateX(${ translateDistace - 1 / slidesToRender * 100 * slidesPerView }%)`;
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
              transition: animate ? `transform ${ animationDuration }ms` : null,
            } }
          >
            {this.state.jump && !shift ? this.jumpRender() : this.renderSlides() }
          </div>
          <div style={ { display: 'flex' } } className={ animate ? 'deactivate' : '' } >
            { this.renderBoxes() }
          </div>
        </div>
        <button onClick={ () => this.changeSlide(-slidesPerView) }>prev</button>
        <button onClick={ () => this.changeSlide(slidesPerView) }>next</button>
      </div>
    );
  }
}
export default withRouter(LazySlider);
