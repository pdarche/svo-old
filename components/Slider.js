import React from 'react'
import * as d3 from 'd3'
import css from 'next/css'

export default class Slider extends React.Component {
  constructor(props){
    super(props);
  }
  
  componentDidUpdate() {
    if (this.props.reset) {
      d3.select('.slider-container').remove()
      this._create(this.props)
    }
  }
  
  componentDidMount(){
    this._create(this.props)
  }

  _createLabel(slider, x, y, text) {
    let ul = slider.append("text")
      .attr("class", "label")
      .attr("x", x)
      .attr("y", y)
      .text(text)
  }

  _create(props) {
    let svg = d3.select(".slider-component");
    let dims = this._dims(this.props)
    let scales = this._scales(dims)

    let sliderContainer = svg.append("g")
      .attr("class", "slider-container")
      .attr("transform", "translate(" + dims.margin.left + "," + dims.height / 2 + ")")

    let slider = sliderContainer.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(75, 0)")

    this._createLabel(sliderContainer, 0, -13, "You receive")
    this._createLabel(sliderContainer, 0, 24, "Others receive")

    this._createLabel(slider, 0, -13, props.scales.min1)
    this._createLabel(slider, dims.width, -13, props.scales.max1)
    this._createLabel(slider, 0, 25, props.scales.min2)
    this._createLabel(slider, dims.width, 25, props.scales.max2)

    this._update(slider, scales, dims, props)
  }

  _update(slider, scales, dims, props) {
    var _this = this;
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
             _this.props.handleSlide([Math.round(d1), Math.round(d2)])
          }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + -18 + ")")

    let handleGroup = slider.insert("g", ".track-overlay") 
      .attr("class", "handle-group")
      .attr("transform", "translate(" + scales.x1(props.data[0]) + ",0)");
        
    let handle = handleGroup.append("circle") 
      .attr("class", "handle")
      .attr("r", 7)

    let text1 = handleGroup.append("text")
      .attr("class", "label")
      .attr("y", -13)
      .text(props.data[0])

    let text2 = handleGroup.append("text")
      .attr("class", "label")
      .attr("y", 25)
      .text(props.data[1])
  }
  
  _scales(dims) {
    let x1 = d3.scaleLinear()
      .domain([this.props.scales.min1, this.props.scales.max1])
      .range([0, dims.width])
      .clamp(true);

    let x2 = d3.scaleLinear()
      .domain([this.props.scales.min2, this.props.scales.max2])
      .range([0, dims.width])
      .clamp(true);

    return {x1, x2}
  }

  _dims(props) {
    let margin = {right: 50, left: 60},
      width = props.width - margin.left - margin.right - 50,
      height = props.height

    return { margin, width, height }
  }

  render(){
    return (
      <div {...container}>
        <svg className={'slider-component'} width={this.props.width} height={this.props.height}></svg>
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


