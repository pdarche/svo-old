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

    let xAxis = d3.axisBottom(scales.x)
    let yAxis = d3.axisLeft(scales.y)

    chart.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0, " + dims.height + ")")
      .call(xAxis)

    chart.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis)

    chart.append("g")
      .attr("class", "ring")
      .attr("transform", "translate(" + dims.margin.left + "," + dims.margin.left + ")")

    chart.select(".ring").append('circle')
      .attr('cx', 50)
      .attr('cy', 50)
      .attr('r', 75)
      .style('fill', 'none')
      .style('stroke', 'gray')
      .style('stroke-width', 1)

    chart.select(".ring").append('circle')
      .attr('cx', 50)
      .attr('cy', 50)
      .attr('r', 5)

    chart.select(".ring").append("line")
      .attr("class", "svo-angle")
      .attr("x1", 0)
      .attr("x2", 75)
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("transform-origin", "left")
      .attr("transform", "translate(50, 50) rotate(0)")
      .style("stroke", "black")
      .style("stroke-width", 1)

    chart.append("text")
      .attr("x", scales.x(50)) // minus text width
      .attr("y", scales.y(90))
      .text("Altruist")
      .style("font-size", 12)

    chart.append("text")
      .attr("x", scales.x(78)) // minus text width
      .attr("y", scales.y(78))
      .text("Prosocial")
      .style("font-size", 12)

    chart.append("text")
      .attr("x", scales.x(90)) // minus text width
      .attr("y", scales.y(50))
      .text("Individualist")
      .style("font-size", 12)

    chart.append("text")
      .attr("x", scales.x(78)) // minus text width
      .attr("y", scales.y(20))
      .text("Competitor")
      .style("font-size", 12)

    this._update(chart, scales, dims, props)
  }

  _update(chart, scales, dims, props) {
    chart.select(".svo-angle")
      .transition(5000)
      .attr("transform", "translate(50, 50) rotate(-" + props.svo + ")")
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
    let margin = {right: 50, left: 50},
      width = props.width - margin.left - margin.right,
      height = props.height - margin.left - margin.right

    return { margin, width, height }
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


