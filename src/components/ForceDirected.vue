<template>
  <div>
    <h1 class="title">Force Directed Graph with D3.js v4</h1>
    <h2 class="subtitle">National Contiguity</h2>
    <div id="graph"></div>
  </div>
</template>

<script>
import {
  drag,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  event,
  json,
  mouse,
  select
} from 'd3';
import 'flags';

const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

export default {
  name: 'force-directed',
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
      const margins = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10,
      };
      const canvasWidth = window.innerWidth * 0.935;
      const canvasHeight = window.innerHeight * 0.8;
      const width = canvasWidth - margins.right - margins.left;
      const height = canvasHeight - margins.top - margins.bottom;
      const linkDistance = 20;
      const flagHeight = 16;
      const flagWidth = 12;

      const graph = select('#graph');
      const svg = graph.append('svg')
        .attr('class', 'graph')
        .attr('width', canvasWidth)
        .attr('height', canvasHeight);

      const simulation = forceSimulation()
        .nodes(data.nodes);
      const links = forceLink(data.links)
        .distance(linkDistance);

      simulation.force('link', links)
        .force('charge', forceManyBody().distanceMax(250).distanceMin(5))
        .force('center', forceCenter(width / 2, height / 2))
        .force('collide', forceCollide().radius(4));

      const dragStarted = () => {
        if (!event.active) {
          simulation.alphaTarget(0.3).restart();
        }
      };
      const dragged = (d) => {
        d.fx = event.x;
        d.fy = event.y;
      };
      const dragEnded = (d) => {
        if (!event.active) {
          simulation.alphaTarget(0);
        }
        d.fx = undefined;
        d.fy = undefined;
      };

      const flags = graph.append('div')
        .attr('class', 'flags');

      const relativeTop = y => Math.max(0, Math.min(height, y));
      const relativeLeft = x => Math.max(0, Math.min(width, x));

      const tooltip = select('body')
        .append('div')
          .attr('class', 'tooltip');

      const node = flags.selectAll('.node')
        .data(simulation.nodes(), d => d.code)
        .enter()
        .append('img')
          .attr('width', flagWidth)
          .attr('height', flagHeight)
          .attr('class', d => `flag-icon flag-icon-${d.code}`)
          .on('mouseover', (d) => {
            const tooltipX = `calc(${mouse(document.body)[0]}px - 50%)`;
            const tooltipY = `calc(${mouse(document.body)[1]}px - 100%)`;

            tooltip.text(d.country)
              .style('transform', `translate(${tooltipX}, ${tooltipY})`)
              .transition()
                .duration(200)
                .style('opacity', 1);
          })
          .on('mouseout', () => {
            tooltip.transition()
              .duration(100)
              .style('opacity', 0);
          })
          .call(drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded));

      const link = svg.selectAll('.link')
        .data(links.links())
        .enter()
        .append('line')
          .attr('class', 'link');

      simulation.on('tick', () => {
        node.style('transform', d => (
          `translate(${relativeLeft(d.x - (flagWidth / 2))}px,
            ${relativeTop(d.y - (flagHeight / 2))}px)`)
        );
        link
          .attr('x1', d => `${relativeLeft(d.source.x)}px`)
          .attr('y1', d => `${relativeTop(d.source.y)}px`)
          .attr('x2', d => `${relativeLeft(d.target.x)}px`)
          .attr('y2', d => `${relativeTop(d.target.y)}px`);
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
.graph
  width: 100%

.link
  stroke: rgba(white, .75)
  stroke-width: .5px

.flags
  left: 0
  position: absolute
  top: 0

.flag-icon
  box-shadow: 0 0 4px rgba(black, .4)
  cursor: pointer
  height: 18px
  position: absolute
  width: 24px

.tooltip
  background-color: rgba(black, .6)
  border-radius: 2px
  color: rgba(white, .8)
  left: 0
  opacity: 0
  padding: .25rem .5rem
  position: absolute
  top: 0

</style>
