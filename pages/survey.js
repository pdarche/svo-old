import React from 'react'
import css from 'next/css'
import ReactModal from 'react-modal'
import Nav from '../components/Nav'
import Survey from '../components/Survey'

export default class SurveyPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {acknowledged: false}
  }

  handleRequestClose(ev) {
    // this.setState({acknowledged: true})
  }

  handleAcknowledgement(ev) {
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
    let survey = this.generateSurvey()
    return (
      <div {...styles}>
        <Nav/>
        <ReactModal 
          isOpen={!this.state.acknowledged}
          onRequestClose={(ev) => {this.handleRequestClose(ev)}}
          contentLabel={'Modal'}
          style={{content: content, overlay: overlay}}>
          <h3>Instructions</h3>
          <p>The following tasks involve allocating a payoff between you and another person.  You can think of the other person as someone you might encounter randomly on the street.  The person isn't especially well-off or especially needy and there's nothing otherwise special about the circumstances.</p>
          <p> Your task is to adjust the slider below to the allocation between you and the other person that you most prefer.</p> 
          <p>The numbers at the slider handle represent the current allocation.  The numbers at the end represent the range of possible allocations.  Once you've adjusted the slider to your preferred allocation press the Submit button.</p>
          <div {...button} onClick={(ev) => {this.handleAcknowledgement(ev)}}>Got it!</div>
        </ReactModal>
        {survey}
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

const overlay = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // backgroundColor: 'rgba(255,255,255,.9)'
}

const content = {
  position: '',
  width: '450px',
  height: '425px',
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
