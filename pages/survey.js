import React from 'react'
import css from 'next/css'
import Head from 'next/head'
import ReactModal from 'react-modal'
import ReactGA from 'react-ga' 
import Nav from '../components/Nav'
import Survey from '../components/Survey'
import { ANALYTICS_TRACKING_ID, SURVEY_JSON } from '../config'

let SurveyForm
if (process.browser) {
  SurveyForm = require('survey-react/survey.react.min') 
  SurveyForm.Survey.cssType = "bootstrap"
}

export default class SurveyPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      demoComplete: false,
      acknowledged: false,
      loadSurvey: false
    }
    if (process.browser) {
      ReactGA.initialize(ANALYTICS_TRACKING_ID)
      this.model = new SurveyForm.Model(SURVEY_JSON)
    } 
  }

  componentDidMount() {
    const page = window.location.pathname;
    ReactGA.set({page: page})
    ReactGA.pageview(page)
    this.setState({loadSurvey: true})
  }

  handleRequestClose(ev) {
    // Nothin doin' don't let 'em close by clicking off
  }

  handleAcknowledgement(ev) {
    ReactGA.event({
      category: 'User',
      action: 'Acknowledged the instructions'
    });
    this.setState({acknowledged: true})
  }

  generateSurvey(){
    if (this.state.acknowledged) {
      return <Survey/>
    } else {
      return null
    }
  }

  render() {
    let demo
    if (this.state.loadSurvey) {
      let css = {navigationButton: "btn btn-sm"}
      demo = <SurveyForm.Survey 
        model={this.model} 
        css={css}
        onComplete={() => {this.setState({demoComplete: true})}} />
    }
    let survey = this.generateSurvey()

    return (
     <div> 
        <Head>
          <link rel="stylesheet" href="http://getbootstrap.com/dist/css/bootstrap.css" /> 
        </Head>
        <div {...styles}>
          <Nav/>
          <ReactModal
            isOpen={!this.state.demoComplete}
            onRequestClose={(ev) => {this.handleRequestClose(ev)}}
            contentLabel={'Modal'}
            style={{content: content, overlay: overlay}}>
              {demo}
          </ReactModal>

          <ReactModal 
            isOpen={!this.state.acknowledged && this.state.demoComplete}
            onRequestClose={(ev) => {this.handleRequestClose(ev)}}
            contentLabel={'Modal'}
            style={{content: content, overlay: overlay}}>
            <h3>Ok! Let's measure your SVO</h3>
            <p>The following tasks involve allocating a payoff between you and another person.  You can think of the other person as someone you might encounter randomly on the street.  The person isn't especially well-off or especially needy and there's nothing otherwise special about the circumstances.</p>
            <p> Your task is to adjust the slider below to the allocation between you and the other person that you most prefer.</p> 
            <p>The numbers at the slider handle represent the current allocation.  The numbers at the end represent the range of possible allocations.  Once you've adjusted the slider to your preferred allocation press the Submit button.</p>
            <div {...button} onClick={(ev) => {this.handleAcknowledgement(ev)}}>
              Got it!
            </div>
          </ReactModal>
          {survey}
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

const form = {
  '& fieldset': {
    border: '0px'
  }
}

const overlay = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // backgroundColor: 'rgba(255,255,255,.9)'
}

const content = {
  position: '',
  width: '450px',
  height: '500px',
  font: '18px sans-serif'
}

const button = css({
  width: '100px',
  height: '30px',
  font: "14px sans-serif",
  color: "white",
  margin: '0px auto',
  backgroundColor: '#3b5998',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '5px',
  ':hover': {
    cursor: 'pointer'
  }
});
