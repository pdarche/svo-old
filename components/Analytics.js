import React from 'react'
import css from 'next/css'
import ReactGA from 'react-ga'
import { ANALYTICS_TRACKING_ID } from '../config'


export default class Analytics extends React.Component {
  constructor(props){
    super(props);
    if (process.browser) {
      ReactGA.initialize(ANALYTICS_TRACKING_ID)
    } 
  }

  componentDidMount() {
    const page = window.location.pathname;
    ReactGA.set({page: window.location.pathname})
    ReactGA.pageview(window.location.pathname)
  }

  render() {
    return (<div></div>)
  }
}
