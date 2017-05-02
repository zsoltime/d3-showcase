<template>
  <div class="content">
    <h1 class="title">Heat Map with D3.js v4</h1>
    <h2 class="subtitle">Monthly Global Land-Surface Temperature</h2>
    <div id="heatmap"></div>
  </div>
</template>

<script>
import {
  axisBottom,
  axisLeft,
  json,
  max,
  min,
  mouse,
  range,
  select,
  scaleTime,
  scaleLinear,
  timeFormat
} from 'd3';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const getMonth = (num) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[num - 1];
};

export default {
  name: 'heatmap',
  data() {
    return {
      msg: '',
    };
  },
  mounted() {
    this.fetchAndDraw();
  },
  methods: {
    visualize({ baseTemperature, monthlyVariance }) {
      const margins = {
        top: 0,
        right: 20,
        bottom: 80,
        left: 60,
      };
      const canvasWidth = window.innerWidth * 0.9;
      const canvasHeight = window.innerHeight * 0.75;
      const width = canvasWidth - margins.right - margins.left;
      const height = canvasHeight - margins.top - margins.bottom;
      const colors = [
        '#1d91c0',
        '#41b6c3',
        '#c7e8b3',
        '#edf8b3',
        '#fee08b',
        '#ffb880',
        '#ff7b4d',
        '#df4b33',
        '#9e0343',
      ];

      const data = monthlyVariance.map(d => (Object.assign({}, d, {
        date: new Date(d.year, d.month - 1),
        monthName: getMonth(d.month),
      })));
      // tood: should not use magic numbers (-3)
      const rectHeight = Math.floor(height / 12) - 3;
      const rectWidth = Math.floor(width / (
        max(data, d => d.year) - min(data, d => d.year)
      ));

      const svg = select('#heatmap')
        .append('svg')
          .attr('class', 'heatmap')
          .attr('width', canvasWidth)
          .attr('height', canvasHeight)
          .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

      const heatmap = svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);

      const tooltip = select('#heatmap')
        .append('dl')
          .attr('class', 'tooltip');

      // set ranges and scale the range of data
      const scaleX = scaleTime()
        .domain([
          min(data, d => d.date),
          max(data, d => d.date),
        ])
        .rangeRound([0, width]);
      const scaleY = scaleLinear()
        .domain([
          min(data, d => d.month),
          max(data, d => d.month),
        ])
        .rangeRound([
          height - rectHeight,
          rectHeight,
        ]);

      // const scaleColor = scaleQuantile()
      //   .domain([0, colors.length, max(data, d => baseTemperature + d.variance)])
      //   .range(colors);

      const scaleColor = scaleLinear()
        .domain([
          min(data, d => baseTemperature + d.variance),
          baseTemperature,
          max(data, d => baseTemperature + d.variance),
        ])
        .range([
          colors[0],
          colors[Math.floor(colors.length / 2)],
          colors[colors.length - 1],
        ]);

      // define axes
      const axisX = axisBottom(scaleX)
        .ticks(12)
        .tickFormat(timeFormat('%Y'));
      const axisY = axisLeft(scaleY)
        .tickPadding(5)
        .tickFormat(d => getMonth(d));

      // add x axis
      heatmap.append('g')
        .attr('class', 'heatmap__axis heatmap__axis--x')
        .attr('transform', `translate(0, ${height})`)
        .call(axisX)
        .append('text')
          .attr('class', 'heatmap__label')
          .attr('transform', `translate(${width}, 6)`)
          .attr('dy', '1em')
          .attr('text-anchor', 'end')
          .style('opacity', 0.5)
          .text('Year');

      // add y axis
      const y = heatmap.append('g')
        .attr('class', 'heatmap__axis heatmap__axis--y')
        .call(axisY);

      y.selectAll('.tick text')
        .style('transform', `translateY(${rectHeight / 2}px)`);

      y.append('text')
        .attr('class', 'heatmap__label')
        .attr('transform', 'translate(-12, 0)')
        .attr('y', 25)
        .style('opacity', 0.5)
        .text('Month');

      heatmap.append('g')
        .attr('class', 'heatmap__bars')
        .selectAll('.heatmap__bar')
        .data(data)
        .enter()
        .append('rect')
          .attr('class', '.heatmap__bar')
          .attr('fill', d => scaleColor(baseTemperature + d.variance))
          .attr('x', d => scaleX(d.date))
          .attr('y', d => scaleY(d.month))
          .attr('width', rectWidth)
          .attr('height', rectHeight)
          .on('mouseover', (d) => {
            const date = `${getMonth(d.month)}, ${d.year}`;
            const temp = Math.round((baseTemperature + d.variance) * 1e4) / 1e4;
            const variance = d.variance > 0 ? `+${d.variance}` : d.variance;
            const tooltipX = `calc(${mouse(document.body)[0]}px - 50%)`;
            const tooltipY = `calc(${mouse(document.body)[1]}px - 250%)`;
            const content = `
              <dt>Date</dt>
              <dd>${date}</dd>
              <dt>Temperature</dt>
              <dd>${temp}˚C</dd>
              <dt>Difference</dt>
              <dd>${variance}˚C</dd>
            `;

            tooltip.html(content)
              .style('transform', `translate(${tooltipX}, ${tooltipY})`);
          });

      // gradient for the legend
      const scaleTemp = scaleLinear()
        .domain([0, max(data, d => baseTemperature + d.variance)])
        .range(0, width);

      const numberOfTicks = window.innerWidth > 700 ? 10 : 5;
      const countRange = scaleTemp.domain();
      countRange[2] = countRange[1] - countRange[0];
      const temperatureStops = [];

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < numberOfTicks; i++) {
        temperatureStops.push(
          ((i * countRange[2]) / (numberOfTicks - 1)) + countRange[0],
        );
      }

      svg.append('defs')
        .append('linearGradient')
        .attr('id', 'gradient-temp')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 1)
        .attr('y2', 0)
        .selectAll('stop')
        .data(range(numberOfTicks))
        .enter()
        .append('stop')
          .attr('offset', (d, i) => `${(i * 100) / numberOfTicks}%`)
          .attr('stop-color', (d, i) => scaleColor(temperatureStops[i]));

      // draw the legend
      const legendWidth = window.innerWidth > 700 ? width * 0.5 : width * 0.8;

      const legends = svg.append('g')
        .attr('transform', `translate(${(width / 2) + margins.left}, ${canvasHeight - 20})`);

      legends.append('rect')
        .attr('x', -legendWidth / 2)
        .attr('y', 0)
        .attr('width', legendWidth)
        .attr('height', 10)
        .style('fill', 'url(#gradient-temp)');

      legends.append('text')
        .attr('x', 0)
        .attr('y', -8)
        .style('text-anchor', 'middle')
        .text('Temperature in ˚C');

      const legendPosX = i => (i * (legendWidth / numberOfTicks)) +
        (-legendWidth / 2) +
        ((legendWidth * 0.3) / numberOfTicks);

      legends.append('g')
        .selectAll('.temp')
        .data(range(numberOfTicks))
        .enter()
        .append('text')
          .attr('class', 'temp')
          .attr('x', (d, i) => `${legendPosX(i)}`)
          .attr('y', '20')
          .text((d, i) => `${Math.round(temperatureStops[i])}˚C`);
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

.heatmap
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
    fill: rgba(0, 128, 0, .5)

    &--doping
      fill: rgba(192, 0, 0, .5)

.tick
  line
    stroke: $color-text

  text
    fill: $color-text

.tooltip
  align-items: center
  background-color: rgba(crimson, .9)
  box-shadow: -3px 7px 21px rgba(black, .3)
  color: $color-text-light
  display: flex
  flex-wrap: wrap
  font-weight: 300
  justify-content: space-between
  left: 0
  margin: 0
  opacity: 0
  padding: .5rem
  position: absolute
  top: 0
  width: 160px

dd, dt
  border-bottom: 1px solid rgba(white, .1)

dd
  flex: 1 0 50%
  margin: 0

dt
  flex: 1 0 38%
  margin-right: 1rem
  text-align: right

</style>
