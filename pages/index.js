import React from 'react'
import css from 'next/css'
import Slider from '../components/Slider'


export default class Index extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <Slider 
          width={500}
          height={100}
          scales={{min1: 0, max1: 50, min2: 50, max2: 100}}
        />
      </div>
    )
  }
}

