import React from 'react'
import * as d3 from 'd3'
import css from 'next/css'

export default class Results extends React.Component {
  constructor(props){
    super(props);
  }
  
  componentDidUpdate() {
    let dims = this._dims(this.props)
    let scales = this._scales(dims)
    let chart = d3.select('.results')
    this._update(chart, scales, dims, this.props)
  }
  
  componentDidMount(){
    this._create(this.props)
  }

  _create(props) {
    let svg = d3.select(".results-component");
    let dims = this._dims(this.props)
    let scales = this._scales(dims)

    let container = svg.append("g")
      .attr("class", "results-container")
      .attr("transform", "translate(" + dims.margin.left + "," + dims.margin.left + ")")

    let chart = container.append("g")
      .attr("class", "results")

    let xAxis = d3.axisBottom(scales.x).ticks(10)
    let yAxis = d3.axisLeft(scales.y).ticks(10)

    chart.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0, " + dims.height + ")")
      .call(xAxis.tickSizeInner(-dims.height))

    chart.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis.tickSizeInner(-dims.width))

    chart.append("g")
      .attr("class", "ring")

    chart.select(".ring").append('circle')
      .attr('cx', scales.x(50))
      .attr('cy', scales.y(50))
      .attr('r', scales.x(49))
      .style('fill', 'none')
      .style('stroke', 'gray')
      .style('stroke-width', 1)

    chart.select(".ring").append('circle')
      .attr('cx', scales.x(50))
      .attr('cy', scales.y(50))
      .attr('r', 5)

    chart.select(".ring").append("line")
      .attr("class", "svo-angle")
      .attr("x1", 0)
      .attr("x2", scales.x(49))
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("transform-origin", "left")
      .attr("transform", "translate(" + scales.x(50) + ", " + scales.y(50) +") rotate(0)")
      .style("stroke", "black")
      .style("stroke-width", 1)

    let coords1 = this.getCoords(51, 90);
    chart.append("text")
      .attr("x", scales.x(coords1.x) - 18) 
      .attr("y", scales.y(coords1.y))
      .attr("transform", "translate(" + scales.x(50) + ", " + -scales.y(50) +")") 
      .text("Altruist")
      .style("font-size", 12)

    let coords2 = this.getCoords(51, 45);
    chart.append("text")
      .attr("x", scales.x(coords2.x)) 
      .attr("y", scales.y(coords2.y))
      .attr("transform", "translate(" + scales.x(50) + ", " + -scales.y(50) +")") 
      .text("Prosocial")
      .style("font-size", 12)

    let coords3 = this.getCoords(51, 0);
    chart.append("text")
      .attr("x", scales.x(coords3.x)) 
      .attr("y", scales.y(coords3.y))
      .attr("transform", "translate(" + scales.x(50) + ", " + -scales.y(50) +")") 
      .text("Individualist")
      .style("font-size", 12)

    let coords4 = this.getCoords(52, -45);
    chart.append("text")
      .attr("x", scales.x(coords4.x)) 
      .attr("y", scales.y(coords4.y))
      .attr("transform", "translate(" + scales.x(50) + ", " + -scales.y(50) +")") 
      .text("Competitor")
      .style("font-size", 12)

    this._update(chart, scales, dims, props)
  }

  _update(chart, scales, dims, props) {
    chart.select(".svo-angle")
      .transition().duration(1200)
      .attr("transform", "translate(" + scales.x(50) + ", " + scales.y(50) +") rotate(-" + props.svo + ")")
  }
  
  _scales(dims) {
    let x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, dims.width]);

    let y = d3.scaleLinear()
      .domain([0, 100])
      .range([dims.width, 0]);

    return {x, y} 
  }

  _dims(props) {
    let margin = {right: 65, left: 50},
      width = props.width - margin.left - margin.right,
      height = props.height - margin.left - margin.right

    return { margin, width, height }
  }

  getCoords(z, deg) {
    let rads = deg * (Math.PI / 180)
    let x = z * Math.cos(rads)
    let y = z * Math.sin(rads)

    return {x, y}
  }

  render(){
    return (
      <div {...container}>
        <svg className={'results-component'} width={this.props.width} height={this.props.height}></svg>
      </div>
    )
  }
}

const container = css({
  display: 'flex',
  justifyContent: 'center',
  margin: '20px 0px',
  '& .ticks, .label': {
    font: '16px sans-serif',
    textAnchor: 'middle'
  },
  '& .tick line': {
    opacity: .1,
    strokeDasharray: "3,3"
  },
  '& .track, .track-inset, .track-overlay': {
    'strokeLinecap': 'round'
  },
  '& .track': {
    'stroke': '#000',
    'strokeOpacity': '0.3',
    'strokeWidth': '5px'
  },
  '& .track-overlay': {
    pointerEvents: 'stroke',
    strokeWidth: '20px',
    cursor: 'grab',
  },
  '& .handle': {
    fill: '#fff',
    stroke: '#000',
    strokeOpacity: '0.5',
    strokeWidth: '1.25px',
  },
  '& .track-overlay:active': {
    cursor: 'grabbing'
  }
});


