import React from 'react'
import css from 'next/css'
import ReactModal from 'react-modal'

export default class Status extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      info: false
    }
  }

  openModal() {
    this.setState({info: true})
  }

  handleRequestClose() {
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
         <h1>Question {this.props.n} of 15</h1>
         <span onClick={() => {this.openModal()}}>i</span>
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
    font: '40px sans-serif',
  },
  '& span': {
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '15px',
    border: '1px solid black',
    fontSize: '18px',
    margin: '20px 0px',
    '&:hover': {
      cursor: 'pointer'
    }
  }

  // border: '1px solid #ccc',
 // display: 'flex',
 // height: '30px',
 // justifyContent: 'center',
 // padding: '20px',
 // margin: '10px',
 // '& h1': {
 //   //justifyContent: 'center',
 //   //alignSelf: 'center',
 //   font: '28px sans-serif',
 // }
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

