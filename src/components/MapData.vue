<template>
  <div class="content">
    <h1 class="title">Map Data Across the Globe with D3.js v4</h1>
    <h2 class="subtitle">Meteroite Landings</h2>
    <div id="map"></div>
  </div>
</template>

<script>
import {
  event,
  geoMercator,
  geoPath,
  json,
  max,
  mouse,
  scaleSqrt,
  select,
  timeFormat,
  zoom
} from 'd3';
import { feature as topojsonFeature } from 'topojson';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';
const mapUrl = 'https://d3js.org/world-50m.v1.json';

const displayMass = (mass) => {
  if (!mass) {
    return 'N/A';
  } else if (mass > 1e6) {
    return `${mass / 1e6}t`;
  } else if (mass > 1e3) {
    return `${mass / 1e3}kg`;
  }
  return `${mass}g`;
};

const formatDate = (date) => {
  if (!date) {
    return 'N/A';
  }
  return timeFormat('%Y')(new Date(date));
};

export default {
  name: 'map',
  data() {
    return {
      msg: '',
    };
  },
  mounted() {
    this.fetchAndDraw();
  },
  methods: {
    visualize(data) {
      const width = window.innerWidth;
      const height = window.innerHeight * 0.8;
      const white = 'rgba(255, 255, 255, 0.25)';
      const red = '#f44336';

      const svg = select('#map')
        .append('svg')
          .attr('class', 'map')
          .attr('width', width)
          .attr('height', height);

      const map = svg.append('g');
      const tooltip = select('#map')
        .append('dl')
          .attr('class', 'tooltip');

      svg.call(zoom()
        .on('zoom', () => {
          map.attr('transform', event.transform);
        }));

      // https://en.wikipedia.org/wiki/Web_Mercator
      const projection = geoMercator()
        .translate([width / 2, height])
        .scale(width / 3);

      const path = geoPath()
        .projection(projection);

      json(mapUrl, (err, world) => {
        if (err) throw err;
        map.selectAll('path')
          .data(topojsonFeature(world, world.objects.countries).features)
          .enter()
          .append('path')
            .attr('fill', white)
            .attr('stroke', white)
            .attr('strokeWidth', '0.5px')
            .style('vector-effect', 'non-scaling-stroke')
            .attr('d', path);

        const meteoriteSize = scaleSqrt()
          .range([1, 75])
          .domain([0, max(data.features.map((d) => {
            const { mass } = d.properties;
            return mass ? mass * 1 : 0;
          }))]);

        // meteorites
        map.append('g')
          .selectAll('circle')
            .data(data.features.sort((a, b) => b.properties.mass - a.properties.mass))
            .enter()
            .append('circle')
              .attr('class', 'meteor')
              .attr('cx', d => projection([
                d.properties.reclong,
                d.properties.reclat,
              ])[0])
              .attr('cy', d => projection([
                d.properties.reclong,
                d.properties.reclat,
              ])[1])
              .attr('r', d => meteoriteSize(d.properties.mass))
              .attr('fill', white)
              .attr('stroke', red)
              .attr('strokeWidth', '0.5px')
              .style('vector-effect', 'non-scaling-stroke')
              .on('mouseover', (d) => {
                const { mass, name, year } = d.properties;
                const [lat, lon] = d.geometry.coordinates;
                const tooltipX = `calc(${mouse(document.body)[0]}px - 50%)`;
                const tooltipY = mouse(document.body)[1] / window.innerHeight > 0.7 ?
                  `calc(${mouse(document.body)[1]}px - 225%)` :
                  `calc(${mouse(document.body)[1]}px - 75%)`;
                const content = `
                  <dt>Name</dt>
                  <dd>${name}</dd>
                  <dt>Mass</dt>
                  <dd>${displayMass(mass)}</dd>
                  <dt>Year</dt>
                  <dd>${formatDate(year)}</dd>
                  <dt>Coordinates</dt>
                  <dd>${lat.toFixed(2)}, ${lon.toFixed(2)}</dd>
                `;
                tooltip.html(content)
                  .style('transform', `translate(${tooltipX}, ${tooltipY})`);
                tooltip.transition()
                  .duration(200)
                  .style('opacity', 1);
              })
              .on('mouseout', () => {
                tooltip.transition()
                  .duration(100)
                  .style('opacity', 0);
              });
      });
    },
    fetchAndDraw() {
      json(url, (err, data) => {
        if (err) throw err;
        this.visualize(data);
      });
    },
  },
};
</script>

<style lang="sass">
.tooltip
  align-items: center
  background-color: rgba(#f44336, .8)
  box-shadow: -3px 7px 21px rgba(black, .3)
  display: flex
  flex-wrap: wrap
  font-weight: 300
  justify-content: space-between
  left: 0
  margin: 0
  opacity: 0
  padding: 1rem
  position: absolute
  top: 0
  width: 192px

dd, dt
  border-bottom: 1px solid rgba(white, .1)
  line-height: 1.3

dd
  flex: 1 0 50%
  margin: 0

dt
  flex: 1 0 33%
  margin-right: 1rem
  text-align: right

</style>

<style lang="sass" scoped>
.content
  background-color: #7bc087
</style>
