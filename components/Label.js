import React from 'react'
import css from 'next/css'

export default class Label extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div {...container}>
       <div className={'recipient'}>
        <p className={'recipient-label'}>You Receive</p>
        <p className={'recipient-amount'}>{Math.round(this.props.data[0])}</p>
       </div>
       <div className={'recipient'}>
        <p className={'recipient-label'}>Other receives</p>
        <p className={'recipient-amount'}>{Math.round(this.props.data[1])}</p>
       </div>
      </div>
    )
  }
}

const container = css({
  border: '1px solid #ccc',
  display: 'flex',
  flexDirection: 'column',
  height: '100px',
  width: '225px',
  justifyContent: 'center',
  padding: '0px 20px',
  margin: '0px 20px 0px 0px',
  '& .recipient': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  '& .recipient-label, .recipient-amount': {
    font: '18px sans-serif'
  },
});


