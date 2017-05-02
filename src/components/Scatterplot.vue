<template>
  <div class="content">
    <h1 class="title">Scatterplot Graph with D3.js v4</h1>
    <div id="graph"></div>
  </div>
</template>

<script>
import {
  axisBottom,
  axisLeft,
  json,
  max,
  mouse,
  scaleLinear,
  scaleTime,
  select,
  timeFormat
} from 'd3';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

export default {
  name: 'scatterplot',
  data() {
    return {
      color: '',
    };
  },
  mounted() {
    this.fetchAndDraw();
  },
  methods: {
    visualize(data) {
      const margins = {
        top: 10,
        right: 75,
        bottom: 20,
        left: 40,
      };
      const canvasWidth = window.innerWidth * 0.8;
      const canvasHeight = window.innerHeight * 0.75;
      const width = canvasWidth - margins.right - margins.left;
      const height = canvasHeight - margins.top - margins.bottom;
      const formatTime = timeFormat('%M:%S');
      const offsetInSeconds = data[0].Seconds;
      const extendX = 4 * 1000;
      const extendY = 1;

      // create svg canvas
      const svg = select('#graph')
        .append('svg')
          .attr('class', 'graph')
          .attr('width', canvasWidth)
          .attr('height', canvasHeight)
          .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

      const graph = svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);

      // add the tooltip
      const tooltip = select('#graph')
        .append('div')
          .attr('class', 'tooltip');

      // set ranges and scale the range of data
      const scaleX = scaleTime()
        .domain([
          max(data, d => (d.Seconds - offsetInSeconds) * 1000) + extendX,
          0,
        ])
        .rangeRound([0, width]);

      const scaleY = scaleLinear()
        .domain([
          max(data, d => d.Place) + extendY,
          0,
        ])
        .range([height, 0]);

      // define axes
      const axisX = axisBottom(scaleX)
        .tickFormat(formatTime)
        .ticks(12);
      const axisY = axisLeft(scaleY)
        .ticks(10);

      // add x axis
      graph.append('g')
        .attr('class', 'graph__axis graph__axis--x')
        .attr('transform', `translate(0, ${height})`)
        .call(axisX)
        .append('text')
          .attr('class', 'graph__label')
          .attr('transform', `translate(${width}, ${-margins.bottom})`)
          .attr('dy', '0.875em')
          .attr('text-anchor', 'end')
          .text('Time behind #1');

      // add y axis
      graph.append('g')
        .attr('class', 'graph__axis graph__axis--y')
        .call(axisY)
        .append('text')
          .attr('class', 'graph__label')
          .attr('transform', 'rotate(-90)')
          .attr('y', 15)
          .text('Place');

      // add the circles
      const circles = graph.append('g')
        .attr('class', 'graph__circles')
        .selectAll('.graph__circle')
        .data(data)
        .enter();

      const circlePosX = d => scaleX((d.Seconds - offsetInSeconds) * 1000);
      const circlePosY = d => scaleY(d.Place);

      circles.append('circle')
        .attr('class', d => (
          d.Doping ?
          'graph__circle graph__circle--doping' :
          'graph__circle'))
        .attr('r', 7)
        .attr('cx', d => circlePosX(d))
        .attr('cy', d => circlePosY(d))
        .style('transform-origin', d => `${circlePosX(d)}px ${circlePosY(d)}px`)
        .on('mouseover', (d) => {
          const tooltipX = `calc(${mouse(document.body)[0] - margins.left}px - 50%)`;
          const tooltipY = `calc(${mouse(document.body)[1]}px - 200%)`;
          const content = `
          <p class="tooltip__header">
            <span class="name">${d.Name}</span>
            <span class="country">${d.Nationality}</span>
            <span class="year">${d.Year}</span>
            <span class="time">${d.Time}</span>
          </p>
          <p class="tooltip__footer">Doping: ${d.Doping || 'None'}</p>`;

          tooltip.transition()
            .duration(200)
            .style('opacity', 1);

          tooltip.html(content)
            .style('transform', `translate(${tooltipX}, ${tooltipY})`);
        })
        .on('mouseout', () => {
          tooltip.transition()
            .duration(200)
            .style('opacity', 0);
          tooltip.html('');
        });

      circles.append('text')
        .attr('class', 'graph__name')
        .attr('x', d => circlePosX(d) + 10)
        .attr('y', d => circlePosY(d) + 4)
        .text(d => d.Name);
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
@import '~sassVars'

.graph
  width: 100%

  text
    font-weight: 300

  &__axis
    path
      fill: none
      stroke: $color-text
      shape-rendering: crispEdges

  &__label
    fill: $color-text

  &__circle
    cursor: pointer
    fill: rgba($color-green, .65)
    transition: transform .3s cubic-bezier(.7, -.55, .25, 1.55)

    &:hover
      transform: scale(2)

    &--doping
      fill: rgba($color-red, .65)

.tick
  line
    stroke: $color-text

  text
    fill: $color-text

.tooltip
  box-shadow: 0 .5rem 1.25rem -.5rem $color-text
  color: $color-text-light
  left: 0
  opacity: 0
  position: absolute
  text-align: center
  top: 0
  width: 200px

  &__header
    background-color: rgba($color-green, .9)
    display: flex
    justify-content: space-between

  &__footer
    background-color: rgba(black, .7)

  p
    margin: 0
    padding: .5em

</style>
