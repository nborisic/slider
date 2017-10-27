import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const slides = [{ name: 'prvi' }, { name: 'drugi' }, { name: 'treci' }, { name: 'cetvrti' }, { name: 'peti' }];
const width = 200;
const noOfSlidesPerView = 1;

class Slider extends Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
  }
  constructor(props) {
    super(props);

    this.state = {
      position: '',
      startingSlides: [],
      noOfStartingSlides: '',
      noOfPreSlides: '',
    };

    this.slideDOMElements = [];

    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentWillMount() {
    const { number } = this.props.match.params;
    if (number === undefined || number > Math.ceil(slides.length / noOfSlidesPerView) || number < 1) {
      this.props.history.push('/1');
    }
    // postavlja inicijalni slide na vidljivu poziciju
    const delateCount = slides.length - number + 1;
    const firstSlide = slides.splice(number - 1, delateCount);
    const reorderedSlides = firstSlide.concat(slides);
    const noOfStartingSlides = reorderedSlides.length;
    const noOfPreSlides = noOfSlidesPerView > Math.ceil(noOfStartingSlides / 2) ? noOfSlidesPerView : Math.ceil(noOfStartingSlides / 2);
    const noOfPostSlides = noOfStartingSlides - noOfPreSlides;
    // kloniranje elementa u zavisnosti od broja slidova u viewpointu
    const preClonedSlides = [];
    const postClonedSlides = [];
    for (let i = 1; i <= noOfPreSlides; i++) {
      preClonedSlides.push(reorderedSlides[reorderedSlides.length - i]);
    }
    for (let i = 1; i <= noOfPostSlides; i++) {
      postClonedSlides.push(reorderedSlides[i - 1]);
    }
    const initialSlides = preClonedSlides.reverse().concat(reorderedSlides).concat(postClonedSlides);
    this.setState({
      noOfStartingSlides,
      noOfPreSlides,
      startingSlides: initialSlides,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { startingSlides, noOfStartingSlides } = this.state;
    const { number } = this.props.match.params;
    if ((nextProps.match.params.number - number === 1) || (number - nextProps.match.params.number === noOfStartingSlides - 1)) {
      const slidesToModify = startingSlides.slice();
      const slideToMove = slidesToModify.splice(0, 1);
      const movedSlides = slidesToModify.concat(slideToMove);
      this.setState({
        startingSlides: movedSlides,
      });
    } else {
      const slidesToModify = startingSlides.slice();
      const slideToMove = slidesToModify.splice(-1, 1);
      const movedSlides = slideToMove.concat(slidesToModify);
      this.setState({
        startingSlides: movedSlides,
      });
    }
  }

  handlePrev() {
    const { number } = this.props.match.params;
    const { position, noOfStartingSlides } = this.state;
    let to = number - noOfSlidesPerView;
    if (to < 1) to = Math.ceil(noOfStartingSlides / noOfSlidesPerView);
    this.props.history.push(`/${ to }`);
    const movedPosition = Number(position) + width;
    this.setState({
      position: movedPosition,
    });
  }
  handleNext() {
    const { number } = this.props.match.params;
    const { position, noOfStartingSlides } = this.state;
    let to = parseInt(number, 10) + 1;
    if (to > noOfStartingSlides) to = 1;
    this.props.history.push(`/${ to }`);
    const movedPosition = position - width;
    this.setState({
      position: movedPosition,
    });
  }

  render() {
    const { noOfPreSlides } = this.state;
    const items = this.state.startingSlides.map((slide, i) => {
      const refNo = i + 1;
      return (
        <div ref={ el => this.slideDOMElements[i] = el } id={ `slide${ refNo }` } className='slide' key={ this.slideDOMElements[i] }> { slide.name } </div> // znaaam!
      );
    });
    const divPositon = {
      left: `-${ noOfPreSlides * width }px`,
      transform: `translateX(${ this.state.position * noOfSlidesPerView }px)`,
      transition: '700ms',
      position: 'absolute',
    };
    return (
      <div>
        <div className='container' >
          <div className='relativeDiv'>
            <div className='slider' ref={ c => this.slide = c } style={ divPositon } >
              { items }
            </div>
          </div>
        </div>
        <button onClick={ this.handlePrev } > Prev </button>
        <button onClick={ this.handleNext }> Next </button>
      </div>
    );
  }
}
export default withRouter(Slider);
