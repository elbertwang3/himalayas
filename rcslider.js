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
		console.log(props);
    	super(props);
    	
	   
    }
    




	render() {
		
		const wrapperStyle = { width: 400, margin: '30 auto', display: 'block'};
		
		
		return (<div>
		    <div style={wrapperStyle}>
		      <p>Slide to change year</p>
		      <SliderWithTooltip min={1953} max={2017} defaultValue={2017} step={1}  tipFormatter={percentFormatter} 
		      onChange={this.props.onChange} onAfterChange={this.props.onAfterChange} 
		       trackStyle={{ backgroundColor: 'grey'}} />
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