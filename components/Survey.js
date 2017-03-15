import React from 'react'
import css from 'next/css'
import PouchDB from 'pouchdb' 
import hat from 'hat'
import _ from 'lodash'
import Status from './Status'
import Slider from './Slider'
import Bar from './Bar'
import Label from './Label'
import { 
  equality_points,
  joint_gain_points,
  other_gain,
  own_gain,
  max_distances
} from '../config'

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
      saving: false,
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

  computeSVO(selfTotal, otherTotal) {
    let selfAvg = (selfTotal / 6) - 50 
    let otherAvg = (otherTotal / 6) - 50 
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
    let submitTime = new Date()
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
    // Update the database
    return this.localDB.get(this.sessionId).then((doc) => {
      doc.answers.push(answer)
      return this.localDB.put(doc)
    })
    .catch(err => console.log(err));
  }

  saveSVO() {
    let selfTotal = this.state.selfTotal + this.state.data[0]
    let otherTotal = this.state.otherTotal + this.state.data[1]
    let svo = this.computeSVO(selfTotal, otherTotal)
    let type = this.classifySVO(svo)

    return this.localDB.get(this.sessionId).then((doc) => {
      doc.completedAt = new Date();
      doc.svo = svo
      doc.type = type 
      doc.selfTotal = selfTotal
      doc.otherTotal = otherTotal
      return this.localDB.put(doc)
    }).then((res) => {
      return {svo, type}
    })
    .catch(err => console.log(err));
  }

  computeSecondaryType(answers) {
    let secondaryMeasures = answers.map((answer, ix) => {
      let dia = Math.abs(answer.self - equality_points[ix]) / max_distances[ix]  
      let djg = joint_gain_points[ix]  
        ? Math.abs(answer.self - joint_gain_points[ix]) / max_distances[ix]
        : 0
      let dal = Math.abs(answer.self - other_gain[ix]) / max_distances[ix]
      let dic = Math.abs(answer.self - own_gain[ix]) / max_distances[ix]
      return [dia, djg, dal, dic]
    })
    let transposed = _.unzip(secondaryMeasures)
    let [dia, djg, dal, dic] = transposed.map(a => _.sum(a) / 9)
    let ia;
    if (dia <= dal && dia <= dic && djg <= dal && djg <= dic) {
      ia = dia / (dia + djg)
    } else {
      ia = "does not fit criteria"
    }

    return {ia, dia, djg, dal, dic}
  }

  saveSecondaryType() {
    return this.localDB.get(this.sessionId).then((doc) => {
      let answers = doc.answers.slice(6)
      doc.secondaryMeasures = this.computeSecondaryType(answers)
      return this.localDB.put(doc)
    })
    .catch(e => console.log(e))
  }

  handleClick(ev) {
    ev.preventDefault();
    // Save the answer
    this.saveAnswer().then((doc) => {
      // take the next action 
      this.nextAction()
    })
  }

  nextAction() {
    let nextQuestion = this.state.question + 1;
    if (nextQuestion == 6) {
      this.saveSVO().then((doc) => {
        if (doc.type !== 'prosocial') {
          // TODO:  add something to make sure it doesn't the next question
          window.location = '/results'
        }  
      })
    } 

    if (nextQuestion != 15 && !this.state.saving) {
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
      // Compute and save the ia/jg type
      // Redirect to the results page
      this.saveSecondaryType().then((doc) => {
        window.location = '/results'
      })
      .catch(e => console.log(e))
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


