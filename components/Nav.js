import React from 'react'
import css from 'next/css'
import Link from 'next/link'

export default class Nav extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div {...navBar}>
        <Link href='/'>Home</Link>
        <Link href='/results'>Results</Link>
        <Link href='/about'>About / Privacy</Link>
      </div>
    )
  }
}

const navBar = css({
  position: 'absolute',
  top: '0px',
  width: '100%',
  padding: '0px',
  height: '40px',
  //borderBottom: '1px solid #ccc',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  font: '12px sans-serif',
  '& a:first-child': {
    marginLeft: '40px'
  },
  '& a' : {
    margin: '0px 5px',
    textDecoration: 'none',
    color: 'rgba(0,0,0,.4)'
  },
  '& a:hover' : {
    color: 'rgb(0,0,0)'
  }
})
