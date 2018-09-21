<template>
<d2-container>
    <div id="leaflet-map"></div>
    <div class="areaChartBox box"></div>
    <!-- 首页对话框 -->
    <div class="wrappert">
        <div class="wrapper">
        <div class="container overlay">
        <div class="jumbotron" id="begin" v-on:click="onStart">
            <h1>开始</h1>
        </div>
        </div>
        </div>
    <!-- 日期时间对话框 -->
    </div>
        <div class="dateTimeBox box">
        <div class = "date">{{pos_time_.YMD}}</div>
        <div class = "time"><d2-icon name="clock-o"/><span class = "readableTime">{{pos_time_.HMS}}</span></div>
        <div>
            <el-button size="mini" plain v-on:click="pos_time_.time_factor--"><d2-icon name="fast-backward"/><span></span> 减慢</el-button>
            <el-button size="mini" plain v-on:click="pos_time_.time_factor++">加快 <span ></span><d2-icon name="fast-forward"/> </el-button>
        </div>
        <div class = "timeFactor">时间尺度: <span>{{pos_time_.time_factor}}</span> 分钟/每秒 </div>
    </div>
</d2-container>
</template>

<script>
/* eslint-disable */
import * as L from "leaflet";
import "leaflet-easybutton";
import markerClusterGroup from "leaflet.markercluster";
import $ from "jquery";
import * as d3 from "d3";
import * as moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");
export default {
  props: ["mapData"],
  data() {
    return {
      map: null,
      markers: null,
      geoJsonLayer: null,
      init_map_data: null,
      reset_btn: null,
      // areaChartSvg: null,
      map_config: {
        zoom: 14,
        center: [40.7127, -74.0059],
        minZoom: 3,
        maxZoom: 18,
        attribution: "&copy; OSM"
      },
      pos_time_: {
        time: null,
        time_factor: 5,
        timer_id: null,
        YMD: "",
        HMS: ""
      },
      map_svg_: null,
      map_svg_g_: null,
      topLeft_: null,
      bottomRight_: null
    };
  },
  mounted() {
    this.initMap();
    this.addMapBtn();
    this.createAreaChart();
    // this.loadTrajectories();
    this.timerOn();
    // this.initListenMsg();
  },
  created() {
    //   this.$bus.$on('add-todo', this.addTodo);
    //   this.$bus.$on('delete-todo', this.deleteTodo);
  },
  // 最好在组件销毁前
  // 清除事件监听
  beforeDestroy: function() {
    //   this.$bus.$off('add-todo', this.addTodo);
    //   this.$bus.$off('delete-todo', this.deleteTodo);
    this.timerOff();
    this.map_svg_ = null;
    this.map_svg_g_ = null;
  },
  methods: {
    initMap() {
      // need set default L.Icon.Default.imagePath
      // L.Icon.Default.imagePath = MAP_IMAGE_PATH;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png")
      });
      this.map = L.map("leaflet-map", {
        center: this.map_config.center,
        zoom: this.map_config.zoom,
        minZoom: this.map_config.minZoom,
        maxZoom: this.map_config.maxZoom,
        zoomControl: false
        // scrollWheelZoom: false,
      });
      // this.map.on("zoomend", event => {
      //   if (this.reset_btn && this.map.getZoom() !== this.map_config.zoom) {
      //     this.reset_btn.enable();
      //   }
      // });
      // Creating a marker
      var marker = L.marker(this.map_config.center);
      // Adding marker to the map
      marker.addTo(this.map);
      // Adding map layers
      // L.tileLayer.mapProvider('GaoDe.Normal.Map',
      //   {attribution: this.map_config.attribution}).addTo(this.map);
      L.tileLayer(
        "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: "&copy; OpenStreetMap contributors, &copy;" }
      ).addTo(this.map);
      this.map_svg_ = d3.select(this.map.getPanes().overlayPane).append("svg");
      this.map_svg_g_ = this.map_svg_
        .append("g")
        .attr("class", "leaflet-zoom-hide");
    },
    addMapBtn() {
      // add rest button
      this.reset_btn = L.easyButton(
        "fa-location-arrow",
        () => {
          console.log("reset_btn emit a map-data-reset message!");
          this.$bus.$emit("map-data-reset");
        },
        { position: "topright" }
      );
      this.reset_btn.addTo(this.map);
    },
    createAreaChart() {
      var svg = this.map_svg_;
      var g = this.map_svg_g_;

      // area chart
      var margin = { top: 30, right: 20, bottom: 20, left: 40 },
        areaChartWidth = $("#leaflet-map").width(), //$(window).width() - margin.left - margin.right - 40,
        areaChartHeight = 140 - margin.top - margin.bottom;

      var parseDate = d3.timeFormat("%d-%b-%y").parse;

      var x = d3.scaleLinear().range([0, areaChartWidth - 100]);

      var y = d3.scaleLinear().range([areaChartHeight, 0]);

      var xAxis = d3.axisBottom(x);
      var yAxis = d3.axisLeft(y).ticks(4);

      var area = d3
        .area()
        .x(function(d) {
          return x(d.time);
        })
        .y0(areaChartHeight)
        .y1(function(d) {
          return y(d.runningFare);
        });

      var areaChartSvg = d3
        .select(".areaChartBox")
        .append("svg")
        .attr("width", areaChartWidth + margin.left + margin.right)
        .attr("height", areaChartHeight + margin.top + margin.bottom)
        .attr("class", "areaChart")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var markerLine = areaChartSvg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", areaChartHeight)
        .attr("class", "markerLine");

      var dummyData = [];

      x.domain([0, 24]);
      y.domain([0, 600]);

      var chartPath = areaChartSvg
        .append("path")
        .datum(dummyData)
        .attr("class", "area");
      // .attr("d", area);

      areaChartSvg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + areaChartHeight + ")")
        .call(xAxis)
        .append("text")
        .attr("y", 9)
        .attr("x", 39)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("小时");

      areaChartSvg
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("油 耗 (￥)");
      // end area chart
    },
    addClusterLayer(geoJsonData) {
      // clear pervious layer
      if (this.markers) {
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
      if (map_data.features.length !== 0) {
        this.addClusterLayer(map_data);
        this.map.fitBounds(this.markers.getBounds());
      }
    },
    initListenMsg() {
      this.$bus.$on("map-data-init", map_data => {
        this.init_map_data = map_data;
        this.updateMapData(this.init_map_data);
      });
      this.$bus.$on("map-data-update", map_data => {
        this.updateMapData(map_data);
        // enable reset button
        if (this.reset_btn) {
          this.reset_btn.enable();
        }
      });
      this.$bus.$on("map-data-reset", () => {
        if (this.init_map_data !== null) {
          this.updateMapData(this.init_map_data);
        }
        // disable reset button
        if (this.reset_btn) {
          this.reset_btn.disable();
        }
      });
    },
    playGpsTrajectory(index) {
      var map = this.map;
      var topLeft, bottomRight;
      function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
      }
      var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

      var transform = d3.geoTransform({
          point: projectPoint
        }),
        d3path = d3.geoPath().projection(transform);

      //get a random number between 0 and 11
      // var number = Math.floor(Math.random() * 15);
      // number = 0; 
      d3.json("data/taxiday" + index + ".geojson").then(function(data) {
        function iterate() {
          transition(svg.selectAll("path.trip0"));
          function tweenDash() {
            var ll = this.getTotalLength();
            var ii = d3.interpolateString("0," + ll, ll + "," + ll);
            var it = this;
            return function(t) {
              var p = it.getPointAtLength(t * ll);
              var newCenter = map.layerPointToLatLng(new L.Point(p.x, p.y));
              map.panTo(newCenter, 14);
              return ii(t);
            };
          }
          function transition(selection) {
            console.log("transition begin!", selection.length);
            selection.each(function() {
              d3
                .select(this)
                .attr("style", "opacity:.7")
                .transition()
                .duration(2000)
                .attrTween("stroke-dasharray", tweenDash);
            });
          }
        }
        // Reposition the SVG to cover the features.
        function reset() {
          var bounds = d3path.bounds(data);
          (topLeft = bounds[0]), (bottomRight = bounds[1]);

          svg
            .attr("width", bottomRight[0] - topLeft[0] + 100)
            .attr("height", bottomRight[1] - topLeft[1] + 100)
            .style("left", topLeft[0] - 50 + "px")
            .style("top", topLeft[1] - 50 + "px");

          g.attr(
            "transform",
            "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")"
          );

          feature.attr("d", d3path);

          //TODO: Figure out why this doesn't work as points.attr...
          g.selectAll(".point").attr("transform", function(d) {
            return translatePoint(d);
          });
        }

        function translatePoint(d) {
          var point = map.latLngToLayerPoint(new L.LatLng(d[1], d[0]));
          return "translate(" + point.x + "," + point.y + ")";
        }

        var feature = g
          .selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
          .attr("class", function(d) {
            if (d.properties.hasfare == true) {
              return "trip" + d.properties.key * 2 + " " + d.properties.hasfare;
            } else {
              return (
                "trip" + (d.properties.key * 2 + 1) + " " + d.properties.hasfare
              );
            }
          })
          .attr("style", "opacity:0");

        map.on("viewreset", reset);
        map.on("zoomend", reset);
        reset();
        iterate();
      });
    },
    /* vue component events */
    timerOn() {
      function updateTimes(that) {
        that.pos_time_.time = that.pos_time_.time.add(1, "minutes");
        that.pos_time_.YMD = that.pos_time_.time.format("dddd, MMMM Do YYYY");
        that.pos_time_.HMS = that.pos_time_.time.format("h:mm a");
        that.pos_time_.timer_id = setTimeout(
          updateTimes,
          1000 / that.pos_time_.time_factor,
          that
        );
      }
      this.pos_time_.time = moment();
      this.pos_time_.timer_id = setTimeout(
        updateTimes,
        1000 / this.pos_time_.time_factor,
        this
      );
      console.log("timer_id %d on", this.pos_time_.timer_id);
    },
    timerOff() {
      console.log("timer off");
      this.pos_time_.time = null;
      clearInterval(this.pos_time_.timer_id);
    },
    /* event handlers */
    onStart() {
      $(".overlay").fadeOut(250);
      $(".box").fadeIn(250);
      this.playGpsTrajectory(1);
    }
  }
};
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
  background-color: rgb(255, 255, 255);
}
#leaflet-map .easy-button-button .fa {
  vertical-align: 0;
  font-size: 1.5em;
}
@media (max-width: 768px) {
  #leaflet-map {
    height: 300px;
  }
}
</style>
