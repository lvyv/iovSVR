<template>
<d2-container>
    <div id="leaflet-map"></div>
    <div class="areaChartBox box"></div>
</d2-container>
</template>

<script>
/* eslint-disable */
    import L from 'leaflet'
    import markerClusterGroup from 'leaflet.markercluster'
    import $ from 'jquery'
    import * as d3 from 'd3'
    import * as moment from 'moment'
    import 'moment/locale/zh-cn'

    moment.locale('zh-cn');
    console.log(moment.locale());
    
    // import mapProvider from '../utilities/leaflet.MapProviders.js'
    // import easyButton from '../utilities/leaflet.EasyButton.vue'
    // const MAP_IMAGE_PATH = "//cdn.bootcss.com/leaflet/1.0.0-rc.2/images/";
    
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// })
    const MAP_IMAGE_PATH = "../../assets/images/leaflet/";
    export default {
        props: ['mapData'],
        data () {
            return {
                map: null,
                markers: null,
                geoJsonLayer: null,
                init_map_data: null,
                reset_btn: null,
                map_config: {
                    zoom: 4,
                    center: [37.5, 106],
                    minZoom: 3,
                    maxZoom: 18,
                    attribution: "&copy; OSM",
                },
            };
        },
        mounted() {
            this.initMap();
            this.addMapLayer();
            // this.addMapBtn();
            // this.initListenMsg();
            this.createAreaChart();
            $('.box').fadeIn(250);
        },
        methods: {
            initMap() {
                // need set default L.Icon.Default.imagePath
                L.Icon.Default.imagePath = MAP_IMAGE_PATH;
                this.map = L.map("leaflet-map",{
                    center: this.map_config.center,
                    zoom: this.map_config.zoom,
                    minZoom: this.map_config.minZoom,
                    maxZoom: this.map_config.maxZoom,
                    // scrollWheelZoom: false,
                });
                this.map.on("zoomend", (event) => {
                    if(this.reset_btn && this.map.getZoom() !== this.map_config.zoom) {
                        this.reset_btn.enable();
                    }
                })
            },
            addMapLayer() {
                // L.tileLayer.mapProvider('GaoDe.Normal.Map',
                //   {attribution: this.map_config.attribution}).addTo(this.map);
                L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                  {attribution: '&copy; OpenStreetMap contributors, &copy;'}).addTo(this.map);
            },
            addMapBtn() {
                // add rest button
                this.reset_btn = L.easyButton('fa-refresh', () => {
                    this.$bus.$emit('map-data-reset');
                });
                this.reset_btn.addTo(this.map);
                this.reset_btn.disable();
            },
            createAreaChart () {
                var svg = d3.select(this.map.getPanes().overlayPane).append('svg'),
                g = svg.append('g').attr('class', 'leaflet-zoom-hide')

                // area chart
                var margin = { top: 30, right: 20, bottom: 20, left: 40 },
                areaChartWidth = $('#leaflet-map').width(), //$(window).width() - margin.left - margin.right - 40,
                areaChartHeight = 140 - margin.top - margin.bottom
                
                //console.log()
                console.log(areaChartWidth,areaChartHeight)
                
                var parseDate = d3.timeFormat('%d-%b-%y').parse

                var x = d3.scaleLinear()
                .range([0, areaChartWidth])

                var y = d3.scaleLinear()
                .range([areaChartHeight, 0])

                var xAxis = d3.axisBottom(x);
                var yAxis = d3.axisLeft(y).ticks(4);

                var area = d3.area()
                .x(function (d) { return x(d.time) })
                .y0(areaChartHeight)
                .y1(function (d) { return y(d.runningFare) })

                var areaChartSvg = d3.select('.areaChartBox').append('svg')
                .attr('width', areaChartWidth + margin.left + margin.right)
                .attr('height', areaChartHeight + margin.top + margin.bottom)
                .attr('class', 'areaChart')
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

                var markerLine = areaChartSvg.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', areaChartHeight)
                .attr('class', 'markerLine')

                var dummyData = []

                x.domain([0, 24])
                y.domain([0, 600])

                var chartPath = areaChartSvg.append('path')
                .datum(dummyData)
                .attr('class', 'area')
                // .attr("d", area);

                areaChartSvg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + areaChartHeight + ')')
                .call(xAxis)
                .append('text')
                .attr('y', 9)
                .attr('x', 39)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Hour')

                areaChartSvg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Fares ($)')
                // end area chart
            },
            addClusterLayer(geoJsonData) {
                // clear pervious layer
                if(this.markers) {
                    this.markers.clearLayers();
                }
                this.markers = L.markerClusterGroup();
                this.geoJsonLayer = L.geoJson(geoJsonData, {
                    onEachFeature: this.onEachFeature
                });
                this.markers.addLayer(this.geoJsonLayer);
                this.markers.addTo(this.map);
            },
            onEachFeature(feature, layer) {
                layer.bindPopup(feature.properties.name);
            },
            updateMapData(map_data) {
                if(map_data.features.length !== 0) {
                    this.addClusterLayer(map_data);
                    this.map.fitBounds(this.markers.getBounds());
                    this.createAreaChart();
                }
            },
            initListenMsg() {
                this.$bus.$on('map-data-init', (map_data) => {
                    this.init_map_data = map_data;
                    this.updateMapData(this.init_map_data);
                });
                this.$bus.$on('map-data-update', (map_data) => {
                    this.updateMapData(map_data);
                    
                    // enable reset button 
                    if(this.reset_btn) {
                        this.reset_btn.enable();
                    }
                });
                this.$bus.$on('map-data-reset', () => {
                    if(this.init_map_data !== null) {
                        this.updateMapData(this.init_map_data);
                    }
                    // disable reset button 
                    if(this.reset_btn) {
                        this.reset_btn.disable();
                    }
                });
            }
        }
    }
</script>

<style scoped>
@import "../../../node_modules/leaflet/dist/leaflet.css";
@import "../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css";
@import "./style.css";
    #leaflet-map {
        /*width: 100%;
        height: 450px;*/
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        position: absolute;
        width: auto;
        height: auto;
        z-index: 0;
    }
    /* icon style */
    #leaflet-map .easy-button-button {
        border: none;
        border-radius: 2px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        background-color: #fff;
    }
    #leaflet-map .easy-button-button .fa {
        vertical-align: 0;
        font-size: 1.3em;
    }
    @media (max-width: 768px) {
        #leaflet-map {
            height: 300px;
        }
    }
</style>
