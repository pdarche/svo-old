import React from 'react'
import css from 'next/css'
import Survey from '../components/Survey'

export default class Index extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <Survey/>
      </div>
    )
  }
}
