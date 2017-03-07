import React from 'react'
import Head from 'next/head'
import css from 'next/css'
import PouchDB from 'pouchdb'
import hat from 'hat'
import 'isomorphic-fetch'
import ReactModal from 'react-modal'
import ReactGA from 'react-ga'
import Nav from '../components/Nav'
import { ANALYTICS_TRACKING_ID } from '../config'
require('pouchdb-all-dbs')(PouchDB)


export default class IndexPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {modal: false}
    // Check for any dbs
    // If one exists prefixed w/ svo, use that one
    if (process.browser) {
      ReactGA.initialize(ANALYTICS_TRACKING_ID)
      PouchDB.allDbs().then((dbs) => {
        let db 
        let substr = "svo"
        let substrs = dbs.map((str) => { return str.slice(0, 3) })
        if (substrs.includes(substr)) {
          let index = substrs.indexOf(substr)
          db = dbs[index] 
        } else {
          db = "svo-" + hat()
        }
        this.localDB = new PouchDB(db);
        window.localStorage.setItem('db', db)
      }).catch(e => console.log(e))
    } 
  }

  componentDidMount(){
    // Set up the analytics
    const page = window.location.pathname;
    ReactGA.set({page: page})
    ReactGA.pageview(page)

    // TODO: Do some ip detection 
    fetch('https://api.ipify.org?format=json')
     .then(res => res.json())
     .then((data) => { window.localStorage.setItem('ip', data.ip) })
     .catch(e => console.log(e))

    // Do some browser detection
    let nav = this.getBrowserInfo() 
    window.localStorage.setItem('browser', JSON.stringify(nav))

    // Setup Facebook
    this.setupFacebook()
  }

  setupFacebook() {
    window.fbAsyncInit = function() {
      FB.init({
        appId: '1321352514570155',
        status: true,
        xfbml: true,
        version: 'v2.8'
      });
      FB.AppEvents.logPageView();
    };
    
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  getBrowserInfo() {
    let _navigator = {};
    for (let i in window.navigator) {
      let attrType = typeof(window.navigator[i])
      if (!['function', 'object'].includes(attrType)) {
        _navigator[i] = window.navigator[i];
      }
    }
    return _navigator
  }

  login(ev) {
    ReactGA.event({
      category: 'User',
      action: 'Clicked to go to survey'
    });

    FB.getLoginStatus((response) => {
      switch (response.status) {
        case 'connected':
          this.checkUser()
          break;
        case 'not_authorized':
          console.log('need authorization')
          break;
        default:
          this.loginUser()
      }
    });
  }

  loginUser() {
    FB.login((res) => { 
      if (res.status === 'connected') {
        this.fetchUser((user) => { 
          window.localStorage.setItem('user', JSON.stringify(user))
          window.location = '/survey'
        })
      } else {
        alert("Sorry, you must connect Facebook to take the survey!")
      }
    })
  }

  fetchUser(callback) {
    let fields = {fields: 'gender,age_range,locale,timezone,updated_time,verified'}
    FB.api('/me', fields, (user) => {
      user.userId = hat()
      callback(user)
    });
  }

  checkUser() {
    let user = window.localStorage.getItem('user')
    if (!user) {
      this.fetchUser((user) => { 
        window.localStorage.setItem('user', JSON.stringify(user))
        window.location = '/survey'
      }) 
    } else {
      window.location = '/survey'
    }
  }

  showModal(ev) {
    ev.preventDefault()
    this.setState({modal: true})
  }

  render() {
    return (
      <div {...styles}>
        <Nav/>

        <ReactModal 
          isOpen={this.state.modal}
          onRequestClose={(ev) => {}}
          contentLabel={'Modal'}
          style={{content: content, overlay: overlay}}>
          <h3>Facebook?  Really...?</h3>
          <p>We know that people are wary of how Facebook data can be used to invade their privacy.  We're using the service to access information about participants without them having to fill in a huge number of additional survey questions.</p>  
          <p><strong>We do not store, send, or use any personally identifying information (ids, names, email addresses, pictures) from the service.</strong></p>
          <p>Check out the <a href="/about"> about</a> page to find out more about what information we collect, how we use it, and the steps we've taken to keep it safe. </p>
          <div {...modalButton} onClick={(ev) => {this.setState({modal: false})}}>
            Got it!
          </div>
        </ReactModal>

        <div {...content_}>
          <h1>What's your Social Value Orientation?</h1>
          <div className={'description'}>
          <p>We all relate to people a little differently.  Some like to put others before themselves.  Some enjoy coming out on top in competition.  And others fall somewhere in between.  The <strong><a href="https://en.wikipedia.org/wiki/Social_value_orientations">social value orientation</a></strong> is a measure of where we fall on this scale from competitive to altruistic.</p> 
          <p>This site is part of a project to better understand how and why our SVOs differ.  To find out your orientation, click the link below!</p>
          <p className="note"><strong> Note:</strong> We use Facebook, but <strong>do not</strong> retain any identifying information. Click <a href="#" onClick={(ev) => {this.showModal(ev)}}>here</a> to learn more.</p> 
          </div>
          <div {...button} onClick={(ev) => {this.login(ev)}}>Go to the survey</div>
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
  // backgroundColor: '#edfdff',
  '& h1': {
    width: '500px',
    font: '35px sans-serif',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  '& .description': {
    margin: '5px 0px 25px 0px',
    width: '500px'
  },
  '& p': {
    font: '18px sans-serif'
  },
  '& .note': {
    fontSize: 16
  }
});

const note = css({
  fontSize: 'small'
})

const content_ = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '960px',
  height: '500px'
});

const button = css({
  width: '200px',
  height: '50px',
  font: "14px sans-serif",
  color: "white",
  backgroundColor: '#3b5998',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '10px',
  ':hover': {
    cursor: 'pointer'
  }
});

const overlay = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const content = {
  position: '',
  width: '450px',
  font: '18px sans-serif',
  '& div': {
    margin: '0px auto'
  }
}

const modalButton = css({
  width: '100px',
  height: '30px',
  font: "14px sans-serif",
  color: "white",
  margin: '0px auto',
  backgroundColor: '#3b5998',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '5px',
  ':hover': {
    cursor: 'pointer'
  }
});
