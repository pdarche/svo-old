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
        <div {...content}>
          <div {...text}>
            <h2>About the Project</h2>
            <p>This application part of research project on social value orientation.  The goal is to better understand what explains the variation in people's orientations.  Peter Darche is the principal investigator.  Please reach out to him with any questions or feedback <a href="mailto:pmd2139@columbia.edu">here</a>.</p>          
            <h2>Data Privacy</h2>
            <p>The data associated with this survey will not be shared with anyone.  Information will never be posted to facebook and only you and the research team will see anything associated with application.  Most data is stored on your computer and only sent to us once over a secure connection.</p>
          </div>
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

const content = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '960px',
  height: '500px'
});

const text = css({
  width: '500px',
  font: '16px sans-serif'
});
