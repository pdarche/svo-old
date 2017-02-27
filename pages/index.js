import React from 'react'
import css from 'next/css'
import PouchDB from 'pouchdb'
import hat from 'hat'
import 'isomorphic-fetch'
import Nav from '../components/Nav'

export default class Index extends React.Component {
  constructor(props){
    super(props);
    this.localDB = new PouchDB('responses');
  }

  componentDidMount(){
    // TODO: Do some ip detection 
    fetch('https://api.ipify.org?format=json')
     .then(res => res.json())
     .then((data) => { window.localStorage.setItem('ip', data.ip) })
     .catch(e => console.log(e))

    // Do some browser detection
    let nav = this.getBrowserInfo() 
    window.localStorage.setItem('browser', JSON.stringify(nav))

    // Setup Facebook 
    window.fbAsyncInit = function() {
      FB.init({
        appId: '1321352514570155',
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
    FB.getLoginStatus((response) => {
      // if the user is connected, log them in and start a session
      if (response.status === 'connected') {
        this.fetchUserData(() => {
          window.location = '/survey'
        })
      } else if (response.status === 'not_authorized') { 
        // Send them somewhere
      } else {
        // Log them in and then redirect
        FB.login((res) => { 
          if (res.status === 'connected') {
            this.fetchUserData(() => {
              window.location = '/survey'
            })
          } else {
            alert("Sorry, you have to connect Facebook to take the survey!")
            console.log('bummer') 
          }
        })
      }
      // If the decline the faceook login, ask for email
    });
  }

  fetchUserData(callback) {
    let fields = {fields: 'first_name,last_name,email,gender,picture,age_range,locale,timezone,updated_time,verified,cover'}
    FB.api('/me', fields, (user) => {
      this.setUser(user)
      callback()
    });
  }

  setUser(user) {
    window.localStorage.setItem('user', JSON.stringify(user))
  }

  render() {
    return (
      <div {...styles}>
        <Nav/>
        <div {...content}>
          <h1>What's your Social Value Orientation?</h1>
          <div className={'description'}>
          <p>The <strong>social value orientation</strong> is a measure of how we relate to other people.  On the next page you'll find a series of sliders.  You as the decision maker can register choices by moving a slider to change payoff allocations between you and some other person.  Once you have made your choice, press the submit button and go to the next question. </p>
          <p>There are no right or wrong answers, this is all about personal preferences.  As you'll see, your choices will influence both the amount of money you receive as well as the amount of money the other receives.</p>
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
    font: '40px sans-serif',
    marginBottom: '5px'
  },
  '& .description': {
    margin: '5px 0px 25px 0px',
    width: '500px'
  },
  '& p': {
    font: '16px sans-serif'
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
