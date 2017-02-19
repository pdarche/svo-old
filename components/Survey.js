import React from 'react'
import css from 'next/css'
import _ from 'lodash'
import Status from './Status'
import Slider from './Slider'
import Bar from './Bar'
import Label from './Label'


export default class Survey extends React.Component {
  constructor(props){
    super(props);
    this.values = [
      {min1: 85, max1: 86, min2: 85, max2: 15},
      {min1: 85, max1: 100, min2: 15, max2: 50},
      {min1: 50, max1: 85, min2: 100, max2: 85},
      {min1: 50, max1: 85, min2: 100, max2: 15},
      {min1: 100, max1: 50, min2: 50, max2: 100},
      {min1: 100, max1: 85, min2: 50, max2: 85},
      {min1: 100, max1: 70, min2: 50, max2: 100},
      {min1: 90, max1: 100, min2: 100, max2: 90},
      {min1: 100, max1: 50, min2: 70, max2: 100},
      {min1: 100, max1: 90, min2: 70, max2: 100},
      {min1: 70, max1: 100, min2: 100, max2: 70},
      {min1: 50, max1: 100, min2: 100, max2: 90},
      {min1: 50, max1: 100, min2: 100, max2: 50},
      {min1: 100, max1: 70, min2: 90, max2: 100},
      {min1: 90, max1: 100, min2: 100, max2: 50},
    ]

    this.state = {
      question: 0,
      ranges: this.values[0],
      data: [85, 50],
      reset: false,
      selfTotal: 0,
      otherTotal: 0
    }
  }

  componentDidUpdate() {
    if (this.state.surveyComplete) {
      let svo = this.computeSVO(this.state.selfTotal, this.state.otherTotal) 
      let type = this.classifySVO(svo)
      window.localStorage.setItem('svo', svo)
      window.localStorage.setItem('type', type)
      window.location = '/results'
    }
  }

  classifySVO(svo) {
    if (svo > 22.45 && svo <= 57.15) {
      return 'prosocial'
    } else if (svo > -12.04 && svo <= 22.45) {
      return 'individualist'
    } else if (svo > 57.15) {
      return 'altruist'
    } else if (svo <= -12.04) {
      return 'competitive'
    }
  }

  computeSVO(selfTotal, otherTotal){
    let selfAvg = (selfTotal / 15) - 50 
    let otherAvg = (otherTotal / 15) - 50 
    let ratio = otherAvg / selfAvg
    let svo = Math.atan(ratio) * 180 / Math.PI
    return svo
  }

  onSlide(val) {
    this.setState({data: val, reset: false})
  }

  centerPoint(ranges){
    let a = [ranges.min1, ranges.max1] 
    let b = [ranges.min2, ranges.max2]
    return [Math.round(_.sum(a) / 2), Math.round(_.sum(b) / 2)]
  }

  handleClick(ev) {
    ev.preventDefault();
    let nextQuestion = this.state.question + 1;
    if (nextQuestion !== 15) {
      let ranges = this.values[nextQuestion]
      this.setState({
        question: nextQuestion,
        ranges: ranges,
        data: this.centerPoint(ranges),
        reset: true,
        selfTotal: this.state.selfTotal + this.state.data[0],
        otherTotal: this.state.otherTotal + this.state.data[1]
      });
    } else {
      this.setState({
        surveyComplete: true,
        selfTotal: this.state.selfTotal + this.state.data[0],
        otherTotal: this.state.otherTotal + this.state.data[1]
      })    
    }
  }

  render(){
    return (
      <div {...styles}>
        <div {...container}>
          <Status n={this.state.question + 1}/>
          <div {...labels}>
            <Label data={this.state.data} />
            <Bar width={200} height={96} data={this.state.data}/>
          </div>
          <Slider 
            width={500}
            height={100}
            data={this.state.data}
            scales={this.state.ranges}
            reset={this.state.reset}
            handleSlide={(val) => {this.onSlide(val)}}
          />
          <button onClick={(ev) => {this.handleClick(ev)}}>Submit</button>
        </div>
      </div>
    )
  }
}

const styles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '90vh'
});

const container = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '960px',
  height: '500px',
  padding: '40px',
  // border: '1px solid #ccc',
  '& button': {
    border: '1px solid #333',
    width: '140px',
    height: '30px',
    backgroundColor: 'white',
    // margin: '40px 0px 20px 0px'
  },
  '& button:hover': {
    backgroundColor: '#ccc',
    cursor: 'pointer'
  }
});

const labels = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '10px 0px'
});


