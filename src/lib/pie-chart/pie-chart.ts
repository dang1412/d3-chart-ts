import { select, Selection } from 'd3-selection';
import { pie, arc, PieArcDatum } from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { interpolate } from 'd3-interpolate';
import 'd3-transition';

interface ChartOption {

}

interface ChartDataItem {
  label: string;
  value: number;
}

const d3Color = scaleOrdinal(schemeCategory10);
const duration = 2000;

export class PieChart {
  private svg: Selection<SVGSVGElement, {}, null, undefined>;
  private previousStateMap = new Map<string, PieArcDatum<ChartDataItem>>();

  constructor(container: HTMLElement, data: ChartDataItem[], private options?: ChartOption) {
    this.svg = select(container).append('svg');

    // append element g.charts-container
    this.svg
      .append('g')
      .attr('class', 'pie-container');

    this.update(data, options);
  }

  update(data: ChartDataItem[], options?: ChartOption) {
    const svgNode = this.svg.node();

    if (!svgNode) {
      return;
    }

    const width = +svgNode.getBoundingClientRect().width;
    const height = +svgNode.getBoundingClientRect().height;
    const radius = Math.min(width, height) / 2;

    var d3Arc = arc<any, PieArcDatum<ChartDataItem>>()
      .innerRadius(radius - 100)
      .outerRadius(radius - 50);

    const pieContainer = this.svg.select('g.pie-container')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    const pieData = pie<ChartDataItem>().sort(null).value(d => d.value)(data);

    console.log('pieData', pieData);

    // update elements
    const pieces = pieContainer.selectAll('path')
      .data(pieData, (d, i) => data[i] ? data[i].label : '');
      // .data(pieData);

    // exit elements
    pieces.exit().remove();

    // enter elements, startAngle, endAngle: 2Pi
    const piecesEnter = pieces
      .enter().append('path')

    piecesEnter.merge(pieces as any)
      .attr('fill', (d) => d3Color(d.data.label))
      .attr('id', (d) => d.data.label)
      .transition()
      .duration(duration)
      .attrTween('d', (d) => {
        console.log('interpolate', d);
        const prevState = this.previousStateMap.get(d.data.label);
        const prevStartAngle = prevState ? prevState.startAngle : 0;
        const prevEndAngle = prevState ? prevState.endAngle : 0;
        const start = interpolate(prevStartAngle, d.startAngle);
        const end = interpolate(prevEndAngle, d.endAngle);

        return (t: number) => {
          d.startAngle = start(t);
          d.endAngle = end(t);

          return d3Arc(d)!;
        }
      });

    // update previous states
    setTimeout(() => {
      this.previousStateMap = new Map<string, PieArcDatum<ChartDataItem>>();
      pieData.forEach((d) => this.previousStateMap.set(d.data.label, {... d}));
    }, duration);
  }
}
