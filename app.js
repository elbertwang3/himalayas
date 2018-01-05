/* global window,document */

import React, {Component} from 'react';
import * as d3 from 'd3';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import SliderClass from './rcslider.js'
import {json as requestJson} from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZWxiZXJ0d2FuZyIsImEiOiJjajk3dmw4amUwYmV2MnFydzl3NDIyaGFpIn0.46xwSuceSuv2Fkeqyiy0JQ'; // eslint-disable-line

// Source data GeoJSON
const DATA_URL = 'data/geocodedeverest.csv'; // eslint-disable-line

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 1220,
        height: 650
      },
      data: null,
      year: 2017
    };

    d3.csv(DATA_URL, (error, response) => {
      console.log(response.length)
      if (!error) {
        var nested_data = d3.nest()
      .key(function(d) { return d['MYEAR']; })
      .entries(response);
        this.setState({
          data: response,
          //selectedCounty: response.features.find(f => f.properties.name === 'Charleston, SC')
        });
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onHover(info) {
    // Hovered over a county
  }

  _onClick(info) {
    // Clicked a county
    //this.setState({selectedCounty: info.object});
  }

  _onSliderChange(value) {
    this.setState({year:
        value
      });
  }
    
  _onAfterChange(value) {
      this.setState({year:
        value
      });
      
     
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  render() {
    const {viewport, data,year} = this.state;
    
    return (
      <div>
      <SliderClass onChange={this._onSliderChange.bind(this)} onAfterChange={this._onAfterChange.bind(this)}/>
      <MapGL 
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data={data}
          year={year}
          onHover={this._onHover.bind(this)}
          onClick={this._onClick.bind(this)}
          strokeWidth={2}
          />
      </MapGL>
      </div>
    );
  }
}

render(<Root />, document.getElementById("countriesdiv"));

function log(value) {
    console.log(value); //eslint-disable-line
}
