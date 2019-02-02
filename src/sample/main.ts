import { PieChart } from '../lib';

const data1 = [{ label: 'a', value: 10 }, { label: 'b', value: 15 }, { label: 'c', value: 15 }];
// const data2 = [{ label: 'c', value: 10 }];
const data2 = [{ label: 'x', value: 20 }, { label: 'a', value: 20 }, { label: 'c', value: 15 }, { label: 'b', value: 10 }, { label: 'd', value: 25 }, { label: 'e', value: 25 }];
const data3 = [{ label: 'a', value: 10 }, { label: 'c', value: 15 }, { label: 'b', value: 20 }, { label: 'e', value: 25 }];

function main() {
  const container = document.getElementById('chart');
  const pieChart = new PieChart(container!, data1);

  setTimeout(() => {
    pieChart.update(data2);
    setTimeout(() => {
      pieChart.update(data3);
    }, 3000);
  }, 3000);

  // TODO handle remove, insert animation
}

setTimeout(main, 1000);
