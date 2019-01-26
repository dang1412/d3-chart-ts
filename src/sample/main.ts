import { PieChart } from '../lib/pie-chart/pie-chart';

function main() {
  const container = document.getElementById('chart');
  const data = [
    { label: 'a', value: 10 },
    { label: 'b', value: 15 }
  ]
  const pieChart = new PieChart(container!, data);
}

main();
