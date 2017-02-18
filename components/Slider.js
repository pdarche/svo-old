import React from 'react'
import * as d3 from 'd3'
import css from 'next/css'

export default class Slider extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      min1: props.scales.min1,
      max1: props.scales.max1,
      min2: props.scales.min2,
      max2: props.scales.max2
    }
  }
  
  componentDidMount(){
    this._create()
  }

  handleChange(ev) {
    console.log('changing', ev)
    // this._update()
  }

  _createLabel(slider, x, y, text) {
    let ul = slider.append("text")
      .attr("class", "label")
      .attr("x", x)
      .attr("y", y)
      .text(text)
  }

  _create() {
    let svg = d3.select("svg");
    let dims = this._dims(this.props)
    let scales = this._scales(dims)

    let sliderContainer = svg.append("g")
      .attr("class", "slider-container")
      .attr("transform", "translate(" + dims.margin.left + "," + dims.height / 2 + ")")

    let slider = sliderContainer.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(50, 0)")

    this._createLabel(sliderContainer, 0, -13, "You receive")
    this._createLabel(sliderContainer, 0, 17, "They receive")

    this._createLabel(slider, 0, -13, this.state.min1)
    this._createLabel(slider, dims.width, -13, this.state.max1)
    this._createLabel(slider, 0, 19, this.state.min2)
    this._createLabel(slider, dims.width, 19, this.state.max2)

    this._update(slider, scales, dims, this.props, this.state)
  }

  _update(slider, scales, dims, props, state) {
    slider.append("line")
       .attr("class", "track")
       .attr("x1", scales.x1.range()[0])
       .attr("x2", scales.x1.range()[1])
     .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
       .attr("class", "track-inset")
     .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
       .attr("class", "track-overlay")
       .call(d3.drag()
           .on("start drag", function() {
             let d1 = scales.x1.invert(d3.event.x)
             let d2 = scales.x2.invert(d3.event.x)
             handleGroup.attr("transform", "translate(" + scales.x1(d1) + ",0)");
             text1.text(Math.round(d1))
             text2.text(Math.round(d2))
          }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + -18 + ")")

    let handleGroup = slider.insert("g", ".track-overlay") 
      .attr("class", "handle-group")
      .attr("transform", "translate(" + scales.x1(25) + ",0)");
        
    let handle = handleGroup.append("circle") 
      .attr("class", "handle")
      .attr("r", 7)

    let text1 = handleGroup.append("text")
      .attr("class", "label")
      .attr("y", -13)
      .text(this.state.max1/2)

    let text2 = handleGroup.append("text")
      .attr("class", "label")
      .attr("y", 20)
      .text(this.state.max2/2)
  }
  
  _scales(dims) {
    let x1 = d3.scaleLinear()
      .domain([this.state.min1, this.state.max1])
      .range([0, dims.width])
      .clamp(true);

    let x2 = d3.scaleLinear()
      .domain([this.state.min2, this.state.max2])
      .range([0, dims.width])
      .clamp(true);

    return {x1, x2}
  }

  _dims(props) {
    let margin = {right: 50, left: 50},
      width = props.width - margin.left - margin.right -50,
      height = props.height,
      offset = 50

    return { margin, width, height, offset }
  }

  render(){
    return (
      <div {...container}>
        <svg width={this.props.width} height={this.props.height}></svg>
      </div>
    )
  }
}

const container = css({
  '& .ticks, .label': {
    font: '10px sans-serif',
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

