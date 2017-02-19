import React from 'react'
import css from 'next/css'

export default class Status extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div {...container}>
       <h1>Question {this.props.n} of 15</h1>
      </div>
    )
  }
}

const container = css({
  '& h1': {
    width: '500px',
    font: '40px sans-serif',
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


