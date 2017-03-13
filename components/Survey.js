import React from 'react'
import css from 'next/css'
import PouchDB from 'pouchdb' 
import hat from 'hat'
import _ from 'lodash'
import Status from './Status'
import Slider from './Slider'
import Bar from './Bar'
import Label from './Label'

export default class Survey extends React.Component {
  constructor(props){
    super(props);
    this.values = [
      {min1: 85, max1: 85.01, min2: 85, max2: 15},
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
    let db = window.localStorage.getItem('db')
    this.localDB = new PouchDB(db); 
    this.events = new Array()
    this.state = {
      question: 0,
      ranges: this.values[0],
      data: [85, 50],
      reset: false,
      selfTotal: 0,
      otherTotal: 0
    }
  }

  componentDidMount() {
    let user = window.localStorage.getItem('user')
    if (user) {
      user = JSON.parse(user)
      this.createSession(user)
    } else {
      alert("Sorry, you have to log in first!")
      window.location = '/'
    }
  }

  createSession(user) {
    let id = hat()
    window.localStorage.setItem('sessionId', id)
    this.sessionId = id // TODO: move this to state
    // Create a new session
    this.localDB.put({
      _id: id,
      user: user,
      answers: new Array(),
      startedAt: new Date(),
      events: new Array()
    })
    // Set the start time for the first question
    this.setState({
      startTime: new Date()
    })
  }

  classifySVO(svo) {
    if (svo > 22.45 && svo <= 57.15) {
      return 'prosocial'
    } else if (svo > -12.04 && svo <= 22.45) {
      return 'individualistic'
    } else if (svo > 57.15) {
      return 'altruistic'
    } else if (svo <= -12.04) {
      return 'competitive'
    }
  }

  computeSVO(selfTotal, otherTotal, denom) {
    let selfAvg = (selfTotal / denom) - 50 
    let otherAvg = (otherTotal / denom) - 50 
    let ratio = otherAvg / selfAvg
    let svo = Math.atan(ratio) * 180 / Math.PI
    return svo
  }

  onSlide(val) {
    // Push the event to the events array
    this.events.push({
      _id: hat(),
      question: this.state.question,
      sessionId: this.sessionId,
      category: 'Survey',
      type: 'Moved Slider', 
      occuredAt: new Date(),
      selfStart: this.state.data[0],
      self: val[0],
      otherStart: this.state.data[1],
      other: val[1]
    })
    
    // Set the state with the new value
    this.setState({data: val, reset: false})
  }

  onInstructionEvent(type) {
    this.events.push({
      _id: hat(),
      question: this.state.question,
      sessionId: this.state.sessionId,
      category: 'Survey',
      type: type, 
      value: null,
      occuredAt: new Date()
    })
  }

  centerPoint(ranges){
    let a = [ranges.min1, ranges.max1] 
    let b = [ranges.min2, ranges.max2]
    return [_.sum(a) / 2, _.sum(b) / 2]
  }

  saveAnswer() {
    let selfTotal = this.state.selfTotal + this.state.data[0]
    let otherTotal = this.state.otherTotal + this.state.data[1]
    let svo = this.computeSVO(selfTotal, otherTotal, this.values.length)
    let type = this.classifySVO(svo)
    let submitTime = new Date()
    console.log('current svo', svo)
    console.log('current class', type)
    let answer = {
      _id: hat(),
      sessionId: this.sessionId,
      self: this.state.data[0],
      other: this.state.data[1],
      question: this.state.question,
      startTime: this.state.startTime,
      submitTime: submitTime,
      resonseTime: submitTime - this.state.startTime,
      ranges: this.state.ranges
    }
    // Post it to the database
    this.localDB.get(this.sessionId).then((doc) => {
      doc.answers.push(answer)
      doc.completedAt = new Date();
      doc.svo = svo
      doc.type = type 
      doc.selfTotal = selfTotal
      doc.otherTotal = otherTotal
      doc.events = this.events
      return this.localDB.put(doc)
    })
    .catch(err => console.log(err));
  }

  handleClick(ev) {
    ev.preventDefault();
    // Save the answer
    this.saveAnswer();
    // Update the state, if appropriate
    let nextQuestion = this.state.question + 1;
    if (nextQuestion !== this.values.length) {
      // set the state for the next question
      let ranges = this.values[nextQuestion]
      this.setState({
        startTime: new Date(),
        question: nextQuestion,
        ranges: ranges,
        data: this.centerPoint(ranges),
        reset: true,
        selfTotal: this.state.selfTotal + this.state.data[0],
        otherTotal: this.state.otherTotal + this.state.data[1]
      });
    } else {
      window.location = '/results'
    }
  }

  render(){
    return (
      <div {...container}>
        <Status 
          n={this.state.question + 1}
          onInstructionEvent={(type) => {this.onInstructionEvent(type)}}/>
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


