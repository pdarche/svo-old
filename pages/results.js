import React from 'react'
import css from 'next/css'
import PouchDB from 'pouchdb'
import ReactGA from 'react-ga' 
import Nav from '../components/Nav'
import Results from '../components/Results'
import { ANALYTICS_TRACKING_ID } from '../config'


export default class ResultsPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      svo: 0,
      type: '(computing)',
      sessionId: null
    }
    if (process.browser) {
      ReactGA.initialize(ANALYTICS_TRACKING_ID)
      let db = window.localStorage.getItem('db')
      this.localDB = new PouchDB(db); 
      this.remoteDB = new PouchDB(`https://svo.world/${db}`)
      this.remoteDB.info()
    } 
  }

  componentDidMount() {
    // Analytics
    const page = window.location.pathname;
    ReactGA.set({page: page})
    ReactGA.pageview(page)

    // Get some info from local storage
    let sessionId = window.localStorage.getItem('sessionId')
    let browser = JSON.parse(window.localStorage.getItem('browser'))
    let ip = window.localStorage.getItem('ip')

    // Get the SVO score and update the local db
    this.localDB.get(sessionId).then((doc) => {
      this.setState({svo: Math.round(doc.svo), type: doc.type, sessionId: sessionId}); 
      doc.browser = browser
      doc.ip = ip
      return this.localDB.put(doc)
    }).catch(err => console.log(err))

    // Sync the results 
    this.localDB.sync(this.remoteDB).on('complete', () => {
      ReactGA.event({
        category: 'User',
        action: 'Synched data'
      });
    })
  }

  render(){
    return (
      <div {...styles} >
        <Nav/>
        <div {...content}>
          <h1> Your SVO is: {this.state.svo}&deg;</h1>
          <p>That means you're <strong>{this.state.type}</strong></p>
          <div className={'results-container'}>
            <Results width={400} height={400} svo={this.state.svo}/>
          </div>
          <div {...surveyInfo}>
            <p>Survey Id: {this.state.sessionId}</p>
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
  height: '90vh',
  '& h1': {
    width: '500px',
    font: '30px sans-serif',
    fontWeight: 'bold',
    marginBottom: '5px',
    textAlign: 'center'
  },
  '& .description': {
    margin: '5px 0px 25px 0px',
    width: '500px'
  },
  '& p': {
    font: '16px sans-serif'
  },
  '& .results-container div': {
    margin: '0px'
  }
});

const content = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '960px',
  height: '500px'
});

const surveyInfo = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px 0px',
  width: '500px',
  '& p': {
    fontSize: 10,
    color: '#333'
  }
});
