import React, {Component} from 'react';
import {scaleQuantile} from 'd3-scale';
import {setParameters} from 'luma.gl';

import DeckGL, {GeoJsonLayer, ArcLayer} from 'deck.gl';

export const inFlowColors = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [12, 44, 132]
];

export const outFlowColors = [
  [255, 255, 178],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [252, 78, 42],
  [227, 26, 28],
  [177, 0, 38]
];

export default class DeckGLOverlay extends Component {

  static get defaultViewport() {
    return {
      longitude: 20.6596,
      latitude: 30.0339,
      zoom: 1.6,
      maxZoom: 15,
      minZoom: 1.6,
      pitch: 20,
      bearing: -10,
    

    };
  }

  constructor(props) {
    super(props);
    this.state = {
      arcs: this._getArcs(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.year !== this.props.year) || (nextProps.data !== this.props.data)) {
      this.setState({
        arcs: this._getArcs(nextProps)
      });
    }
  }

  _getArcs(props) {
    const {data, year} = props;
    if (!data) {
      return null;
    }

    var yeardata = data.filter(function(d) {

  return d['MYEAR'] == year.toString() && d['latitude'] != "" && d['longitude'] != "";
});
    console.log(yeardata);

    
    //const {flows, centroid} = selectedFeature.properties;
    const arcs = yeardata.map(d => {
        var longitude = parseFloat(d['longitude'])
        var latitude = parseFloat(d['latitude'])
        var target = [longitude, latitude]
        return {
          source: [84.1240,28.3949],
          target: target,
    
        }
    
    });

    const scale = scaleQuantile()
      .domain(arcs.map(a => Math.abs(a.value)))
      .range(inFlowColors.map((c, i) => i));

    arcs.forEach(a => {
      a.gain = Math.sign(a.value);
      a.quantile = scale(Math.abs(a.value));
    });
    console.log(arcs);
    return arcs;
  }

  _initialize(gl) {
    setParameters(gl, {
      depthTest: true,
      depthFunc: gl.LEQUAL
    });
  }

  render() {
    console.log("deck-gl rerendered")
    const {viewport, strokeWidth, data} = this.props;
    const {arcs} = this.state;

    if (!arcs) {
      return null;
    }

    const layers = [
      new GeoJsonLayer({
        id: 'geojson',
        data,
        stroked: false,
        filled: true,
        getFillColor: () => [0, 0, 0, 0],
        onHover: this.props.onHover,
        onClick: this.props.onClick,
    
        pickable: Boolean(this.props.onHover || this.props.onClick)
      }),
      new ArcLayer({
        id: 'arc',
        data: arcs,
        opacity: 0.3,
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
 
        //getSourceColor: d => (d.gain > 0 ? inFlowColors : outFlowColors)[d.quantile],
        //getTargetColor: d => (d.gain > 0 ? outFlowColors : inFlowColors)[d.quantile],
        strokeWidth
      })
    ];

    return (
      <DeckGL {...viewport} layers={ layers } onWebGLInitialized={this._initialize} />
    );
  }
}
