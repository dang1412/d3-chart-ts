import { PieChart } from '../lib';

const data1 = [{ label: 'a', value: 10 }, { label: 'b', value: 15 }];
const data2 = [{ label: 'a', value: 10 }, { label: 'c', value: 15 }, { label: 'b', value: 20 }];

function main() {
  const container = document.getElementById('chart');
  const pieChart = new PieChart(container!, data1);

  setTimeout(() => {
    pieChart.update(data2);
    setTimeout(() => {
      pieChart.update(data1);
    }, 3000);
  }, 3000);

  // TODO handle remove, insert animation
}

main();
