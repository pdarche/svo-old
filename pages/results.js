import React from 'react'
import css from 'next/css'
import Results from '../components/Results'

export default class SurveyPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      svo: '(computing)',
      type: '(computing)'
    }
  }

  componentDidMount(){
    let svo = Math.round(window.localStorage.getItem('svo'), 2)
    let type = window.localStorage.getItem('type')
    this.setState({svo, type}) 
  }

  render(){
    return (
      <div {...styles} >
        <div {...content}>
          <h1> Your SVO is: {this.state.svo}</h1>
          <p>That means you're a {this.state.type}</p>
          <div className={'results-container'}>
            <Results width={300} height={300} svo={this.state.svo}/>
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
