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
            <p>This application part of research project on social value orientation.  The goal is to better understand what explains the variation orientations.  Peter Darche is the principal investigator.  Please reach out to him with any questions or feedback <a href="mailto:pdarche@gmail.com">here</a>.</p>          
            <h2>Data Privacy</h2>
            <p>The data associated with this survey will not be shared with anyone.  Information will never be posted to facebook and only you and the research team will see anything associated with application.  Most data is stored on your computer and only sent to us once over a secure connection.</p>
            <p>The application accesses the following information:</p>
            <ul>
              <li>Gender</li>
              <li>Age range</li>
              <li>Verified Status</li>
              <li>Update time</li>
            </ul>
            <p>We do not collect name, email address, or profile picture</p>
            <h2>For the nerdish</h2>
            <p>The application was developed using next.js and is hosted by Zeit.  The code can be found <a href="https://github.com/pdarche/svo">here</a>.  The data is stored in a CouchDB instance hosted on AWS.  We use the one user per database security model.  Notebooks and models will be included in the repository upon project completion.</p>
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
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '960px',
  top: 75
});

const text = css({
  width: '500px',
  font: '16px sans-serif'
});
