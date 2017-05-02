<template>
  <div class="content">
    <h1 class="title">Bar Chart with D3.js v4</h1>
    <div id="chart"></div>
  </div>
</template>

<script>
import {
  axisBottom,
  axisLeft,
  extent,
  format,
  json,
  max,
  mouse,
  select,
  scaleLinear,
  scaleTime,
  timeFormat
} from 'd3';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

export default {
  name: 'bar-chart',
  data() {
    return {
      msg: 'This is the bar chart',
    };
  },
  mounted() {
    this.fetchAndDraw();
  },
  methods: {
    visualize(data) {
      const margins = {
        top: 5,
        right: 10,
        bottom: 80,
        left: 40,
      };
      const canvasWidth = 800;
      const canvasHeight = 450;
      const height = canvasHeight - margins.top - margins.bottom;
      const width = canvasWidth - margins.left - margins.right;

      // create svg canvas
      const svg = select('#chart')
        .append('svg')
          .attr('class', 'chart')
          .attr('width', canvasWidth)
          .attr('height', canvasHeight)
          .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

      // add the tooltip
      const tooltip = select('#chart')
        .append('div')
          .attr('class', 'tooltip');

      // add linear gradients
      const gradientGreen = svg.append('defs')
        .append('linearGradient')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 0)
          .attr('y2', '100%')
          .attr('id', 'gradient-green');

      gradientGreen.append('stop')
        .attr('offset', '15%')
        .attr('stop-color', '#2e7d32');
      gradientGreen.append('stop')
        .attr('offset', '90%')
        .attr('stop-color', '#4caf50');

      const gradientRed = svg.append('defs')
        .append('linearGradient')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 0)
          .attr('y2', '100%')
          .attr('id', 'gradient-red');

      gradientRed.append('stop')
        .attr('offset', '15%')
        .attr('stop-color', 'crimson');
      gradientRed.append('stop')
        .attr('offset', '90%')
        .attr('stop-color', 'tomato');

      const gradientBlue = svg.append('defs')
      .append('linearGradient')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', '100%')
        .attr('id', 'gradient-blue');

      gradientBlue.append('stop')
      .attr('offset', '15%')
      .attr('stop-color', 'steelblue');
      gradientBlue.append('stop')
      .attr('offset', '90%')
      .attr('stop-color', 'lightseagreen');

      // set ranges and scale the range of data
      const scaleX = scaleTime()
        .domain(extent(data, d => new Date(d[0])))
        .rangeRound([0, width]);
      const scaleY = scaleLinear()
        .domain([0, max(data, d => d[1])])
        .rangeRound([height, 0]);

      // define axes
      const axisX = axisBottom(scaleX)
        .ticks(10);
      const axisY = axisLeft(scaleY)
        .ticks(10);

      const chart = svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);

      // add x axis
      chart.append('g')
        .attr('class', 'chart__axis chart__axis--x')
        .attr('transform', `translate(0, ${height})`)
        .call(axisX)
        .append('text')
          .attr('class', 'chart__label')
          .attr('transform', `translate(${width / 2}, ${margins.bottom / 1.5})`)
          .attr('dy', '0.875em')
          .attr('text-anchor', 'middle')
          .text('Gross Domestic Product, USA (1947 - 2015)');

      // add y axis
      chart.append('g')
        .attr('class', 'chart__axis chart__axis--y')
        .call(axisY)
        .append('text')
          .attr('class', 'chart__label')
          .attr('transform', 'rotate(-90)')
          .attr('y', 10)
          .attr('dy', '0.875em')
          .attr('text-anchor', 'end')
          .text('GDP (USD Billion)');

      // add the bars
      chart.append('g')
        .attr('class', 'chart__bars')
        .selectAll('.chart__bar')
        .data(data)
        .enter()
        .append('rect')
          .attr('class', 'chart__bar')
          .attr('x', d => scaleX(new Date(d[0])))
          .attr('y', d => scaleY(d[1]))
          .attr('width', Math.ceil(width / data.length))
          .attr('height', d => height - scaleY(d[1]))
          .on('mouseover', (d) => {
            const dateFormat = timeFormat('%B %Y');
            const currency = format(',.7r');
            const content = `
              <p>${currency(d[1])} Billion</p>
              <p>${dateFormat(new Date(d[0]))}</p>
            `;
            const tooltipX = `calc(${mouse(document.body)[0]}px - 50%)`;
            const tooltipY = `calc(${mouse(document.body)[1]}px - 225%)`;

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

      // append gradient selectors
      svg.append('circle')
        .attr('class', 'selector')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 16)
        .style('transform', 'translate(60px, 425px) rotate(-30deg)')
        .attr('fill', 'url(#gradient-green)')
        .on('click', () => {
          svg.selectAll('.chart__bar')
            .style('fill', 'url(#gradient-green)');
        });

      // todo: don't repeat them
      svg.append('circle')
        .attr('class', 'selector')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 16)
        .style('transform', 'translate(110px, 425px) rotate(-30deg)')
        .attr('fill', 'url(#gradient-blue)')
        .on('click', () => {
          svg.selectAll('.chart__bar')
            .style('fill', 'url(#gradient-blue)');
        });

      svg.append('circle')
        .attr('class', 'selector')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 16)
        .style('transform', 'translate(160px, 425px) rotate(-30deg)')
        .attr('fill', 'url(#gradient-red)')
        .on('click', () => {
          svg.selectAll('.chart__bar')
            .style('fill', 'url(#gradient-red)');
        });
    },
    fetchAndDraw() {
      json(url, (err, { data }) => {
        if (err) throw err;
        this.visualize(data);
      });
    },
  },
};
</script>

<style lang="sass">
@import '~sassVars'

.chart
  position: relative
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

  &__bar
    fill: url(#gradient-green)
    transition: opacity .1s ease-in-out

    &:hover
      opacity: .75

.tick
  line
    stroke: $color-text

  text
    fill: $color-text

.selector
  cursor: pointer

.tooltip
  box-shadow: 0 .5rem 1.25rem -.5rem $color-text
  color: #444
  left: 0
  min-width: 10em
  opacity: 0
  position: absolute
  text-align: center
  top: 0
  transition: all 75ms ease-in-out

  p
    margin: 0
    padding: .5em

    &:first-child
      background: $color-text
      color: #ddd

    &:last-child
      background: rgba(white, .5)

</style>
