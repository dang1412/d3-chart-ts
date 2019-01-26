import { select, Selection } from 'd3-selection';
import { pie, arc, PieArcDatum } from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

interface ChartOption {

}

interface ChartDataItem {
  label: string;
  value: number;
}

export class PieChart {
  private svg: Selection<SVGSVGElement, {}, null, undefined>;

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

    console.log(width, height, radius);

    var d3Arc = arc<any, PieArcDatum<number | { valueOf(): number }>>()
      .innerRadius(radius - 100)
      .outerRadius(radius - 50);

    const pieContainer = this.svg.select('g.pie-container')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    const pieData = pie()(data.map(item => item.value));
    const d3Color = scaleOrdinal(schemeCategory10);

    var path = pieContainer.selectAll('path')
      .data(pieData)
      .enter().append('path')
      .attr('fill', function (d, i) { return d3Color(`${i}`); })
      .attr('d', (d) => d3Arc(d))
      
      // .duration(function (d, i) {
      //   return i * 800;
      // })
      // .attrTween('d', function (d) {
      //   var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
      //   return function (t) {
      //     d.endAngle = i(t);
      //     return arc(d);
      //   }
      // });
  }
}
