import React from 'react'
import css from 'next/css'

export default class Status extends React.Component {
  constructor(props){
    super(props);
    console.log('derrr')
  }

  render(){
    return (
      <div {...container}>
       <p>Question {this.props.n} of 15</p>
      </div>
    )
  }
}

const container = css({
  border: '1px solid #ccc',
  display: 'flex',
  height: '30px',
  justifyContent: 'center',
  padding: '20px',
  margin: '20px',
  '& p': {
    justifyContent: 'center',
    alignSelf: 'center',
    font: '18px sans-serif',
  }
});


