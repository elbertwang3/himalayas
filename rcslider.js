import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, {Component} from 'react';
import {render} from 'react-dom';
import Tooltip from 'rc-tooltip';
import Slider, { createSliderWithTooltip } from 'rc-slider';
//const style = { width: 600, margin: 50 };

const SliderWithTooltip = createSliderWithTooltip(Slider);


export default class SliderClass  extends Component {
	
	
	constructor(props) {
    	super(props);
    	
	   
    }
    




	render() {
		
		const wrapperStyle = { width: 400, margin: 50 };
		
		
		return (<div>
		    <div style={wrapperStyle}>
		      <p>Slider with custom handle</p>
		      <SliderWithTooltip min={1963} max={2004} defaultValue={2004} step={1}  tipFormatter={percentFormatter} onChange={this.props._onSliderChange} onAfterChange={this.props._onAfterChange} />
		    </div>
		    
		  </div>)
	}
}

function log(value) {
	  console.log(value); //eslint-disable-line
}

function percentFormatter(v) {
  return `${v}`;
}