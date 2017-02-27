import React from 'react'
import css from 'next/css'
import PouchDB from 'pouchdb'
import Nav from '../components/Nav'
import Results from '../components/Results'

export default class ResultsPage extends React.Component {
  constructor(props){
    super(props);
    this.localDB = new PouchDB('responses'); 
    this.remoteDB = new PouchDB('https://svo.world/responses')
    this.state = {
      svo: 0,
      type: '(computing)'
    }
  }

  componentDidMount() {
    // Get some info from local storage
    let sessionId = window.localStorage.getItem('sessionId')
    let browser = JSON.parse(window.localStorage.getItem('browser'))
    let ip = window.localStorage.getItem('ip')

    // Get the SVO score and update the local db
    this.localDB.get(sessionId).then((doc) => {
      this.setState({svo: Math.round(doc.svo), type: doc.type}); 
      doc.browser = browser
      doc.ip = ip
      return this.localDB.put(doc)
    }).catch(err => console.log(err))

    // Sync the results 
    this.localDB.sync(this.remoteDB).on('complete', () => {
      console.log("synched!")
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
    font: '40px sans-serif',
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
