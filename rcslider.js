import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, {Component} from 'react';
import {render} from 'react-dom';
import Tooltip from 'rc-tooltip';
import Slider, { createSliderWithTooltip } from 'rc-slider';
//const style = { width: 600, margin: 50 };

const SliderWithTooltip = createSliderWithTooltip(Slider);

const marks = {1960: '1960', 1970: '1970', 1980: '1980', 1990: '1990', 2000: '2000', 2010: '2010'}
export default class SliderClass  extends Component {
	
	
	constructor(props) {
		console.log(props);
    	super(props);
    	
	   
    }
    




	render() {
		
		const wrapperStyle = { width: 400, margin: '30 auto', display: 'block'};
		const labelStyle = {'font-family': "Roboto", 'text-align': "center", 'font-weight': "700"};
		
		
		return (<div>
		    <div style={wrapperStyle}>
		      <Slider
		      min={1953} max={2017} defaultValue={2017} step={1} 
        trackStyle={{ backgroundColor: 'grey'}}
        handleStyle={{
          borderColor: 'grey',
         }}
         dotStyle={{borderColor: 'grey'}}
         activeDotStyle={{ borderColor: 'grey' }}
          marks={marks}
            onChange={this.props.onChange} 
		      onAfterChange={this.props.onAfterChange}
        
        />
		     

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