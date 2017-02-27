import React from 'react'
import css from 'next/css'
import Nav from '../components/Nav'
import Survey from '../components/Survey'

export default class SurveyPage extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div {...styles}>
        <Nav/>
        <Survey/>
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
