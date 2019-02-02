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
  private prevData: ChartDataItem[] = [];

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

    // calculate current state map
    const currentStateMap = new Map<string, PieArcDatum<ChartDataItem>>();
    pieData.forEach((d) => currentStateMap.set(d.data.label, { ...d }));

    // update elements
    const pieces = pieContainer.selectAll('path')
      .data(pieData, (d) => d ? (d as PieArcDatum<ChartDataItem>).data.label : '');

    const previousStateMap = this.previousStateMap;
    const prevData = this.prevData;

    // exit elements
    pieces.exit()
      .transition()
      .duration(duration)
      .attrTween('d', function () {
        const label = select(this).attr('id');
        const index = prevData.findIndex(item => item.label === label);
        const closestIndex = findClosestHasStateIndex(currentStateMap, prevData, index);

        let endAnimationAngle = 0;
        if (closestIndex >= 0) {
          const closestCurrentState = currentStateMap.get(prevData[closestIndex].label)!;
          endAnimationAngle = closestCurrentState.endAngle;
        }

        const prevState = previousStateMap.get(label)!;

        const start = interpolate(prevState.startAngle, endAnimationAngle);
        const end = interpolate(prevState.endAngle, endAnimationAngle);

        return (t: number) => {
          const startAngle = start(t);
          const endAngle = end(t);

          return d3Arc({ startAngle, endAngle } as any)!;
        }
      })
      .remove();

    // enter elements, startAngle, endAngle: 2Pi
    const piecesEnter = pieces
      .enter().append('path')

    piecesEnter.merge(pieces as any)
      .attr('fill', (d) => d3Color(d.data.label))
      .attr('id', (d) => d.data.label)
      .transition()
      .duration(duration)
      .attrTween('d', (d, i) => {
        const hasStateIndex = findClosestHasStateIndex(previousStateMap, data, i);
        const startAngles = determineAnimationStartingAngle(previousStateMap, data, hasStateIndex, i);
        const start = interpolate(startAngles[0], d.startAngle);
        const end = interpolate(startAngles[1], d.endAngle);

        return (t: number) => {
          d.startAngle = start(t);
          d.endAngle = end(t);

          return d3Arc(d)!;
        }
      });

    // update previous states
    this.previousStateMap = currentStateMap;
    this.prevData = [...data];
  }
}

/**
 * Find closest position to this index that its prevState exist
 * 
 * @param previousStateMap 
 * @param currentData 
 * @param index 
 */
function findClosestHasStateIndex(previousStateMap: Map<string, PieArcDatum<ChartDataItem>>, currentData: ChartDataItem[], index: number): number {
  if (index >= currentData.length) {
    throw new Error('index is outside of currentData range');
  }

  let closestIndex = index;
  while (closestIndex >= 0 && !previousStateMap.has(currentData[closestIndex].label)) { closestIndex--; }

  return closestIndex;
}

/**
 * 
 * @param previousStateMap 
 * @param closestIndex 
 * @param index 
 */
function determineAnimationStartingAngle(previousStateMap: Map<string, PieArcDatum<ChartDataItem>>, currentData: ChartDataItem[], closestIndex: number, index: number): [number, number] {
  if (closestIndex === -1) {
    return [0, 0];
  }

  const closestPrevState = previousStateMap.get(currentData[closestIndex].label);
  if (!closestPrevState) {
    throw new Error('closestIndex is inappropriate');
  }

  if (closestIndex === index) {
    return [closestPrevState.startAngle, closestPrevState.endAngle];
  }

  return [closestPrevState.endAngle, closestPrevState.endAngle]
}
