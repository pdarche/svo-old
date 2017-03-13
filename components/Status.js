import React from 'react'
import css from 'next/css'
import ReactGA from 'react-ga'
import ReactModal from 'react-modal'
import { ANALYTICS_TRACKING_ID } from '../config'


export default class Status extends React.Component {
  constructor(props){
    super(props);
    this.state = { info: false }
    if (process.browser) {
      ReactGA.initialize(ANALYTICS_TRACKING_ID)
    } 
  }

  openModal() {
    ReactGA.event({
      category: 'User',
      action: 'Opened the help instructions'
    })
    this.props.onInstructionEvent('Opened help instructions')
    this.setState({info: true})
  }

  handleRequestClose() {
    ReactGA.event({
      category: 'User',
      action: 'Closed the help instructions'
    })
    this.props.onInstructionEvent('Closed help instructions')
    this.setState({info: false})
  }

  render() {
    return (
      <div {...container}>
        <ReactModal
          isOpen={this.state.info}
          onRequestClose={() => {this.handleRequestClose()}}
          contentLabel={'Modal'}
          style={{content: content, overlay: overlay}}>
          <p>Below, you see a slider.  You can change the slider to adjust the amount of money you and the other person will receive.</p>
          <p>The numbers at the ends of the slider show the range of possible distributions for you and the other person.</p>
          <p>Once you have moved the slider to the distribution you most prefer press the Submit button.</p>
        </ReactModal>
        
        <div {...heading}>
         <h1> Task {this.props.n} of 15</h1>
         <span onClick={() => {this.openModal()}}>instructions</span>
        </div>
     </div>
    )
  }
}

const container = css({
  width: '500px',
  '& p': {
    width: '500px'
  }
})

const heading = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '500px',
  '& h1': {
    width: '500px',
    font: '30px sans-serif',
    fontWeight: 'bold'
  },
  '& span': {
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    width: '30px',
    height: '30px',
    // borderRadius: '15px',
    // border: '1px solid black',
    fontSize: '18px',
    color: '#aaa',
    margin: '20px 0px',
    '&:hover': {
      cursor: 'pointer',
      color: '#333'
    }
  }
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
  height: '250px',
  font: '18px sans-serif'
}

