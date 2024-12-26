import moment from 'moment';
import { area, stack, stackOffsetSilhouette } from 'd3-shape';
import { extent, merge, shuffle } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import { fruits } from '../data/';

const data = shuffle(fruits).slice(0, 20);

function genRandomSeries(m) {

  function bump(a) {
    let x = 1 / (0.1 + Math.random());
    let y = 2 * Math.random() - 0.5;
    let z = 10 / (0.1 + Math.random());

    for (let i = 0; i < m; i++) {
      let w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  let a = [];

  for (let i = 0; i < m; ++i) {
    a[i] = 0;
  }
  
  for (let i = 0; i < 5; ++i) {
    bump(a);
  } 
  return a.map(d => +Math.max(0, d).toFixed(5));
}

export function getInitialValues(days) {
  let timeNow = moment();
  
  let dates = {}; // All dates in utc format
  let names = {}; // All fruit names in data

  for (let i = 0; i < data.length; i++) {
    let name = data[i].name;
    names[name] = genRandomSeries(days);
  }

  let items = [];

  for (let i = 0; i < days; i++) {
    let date = timeNow.clone().subtract(i, 'days').toISOString();
    dates[date] = true;

    let item = {date};
    item.total = 0;

    for (let j = 0; j < data.length; j++) {
      let label = data[j].name;
      let value = Math.floor(names[label][i] * 100000); 
      item[label] = value;
      item.total += value;
    }

    items.push(item);
  }

  return [
    items,
    Object.keys(names).sort().map(d => ({name: d, show: true})),
    Object.keys(dates).sort()
  ];
}

function getPath(x, y, yVals, dates) {
  return area()
    .x(d => x(d))
    .y0((d, i) => y(yVals[i][0]))
    .y1((d, i) => y(yVals[i][1]))(dates);
}

export function getPathsAndScales(dims, data, names, dates) {

  let layout = stack()
    .keys(names)
    .value((d, key) => d[key])
    .offset(stackOffsetSilhouette)(data);

  let x = scaleBand()
    .range([0, dims[0]])
    .domain([dates[0], dates[dates.length - 1]]);

  let y = scaleLinear()
    .range([0, dims[1]])
    .domain(extent(merge(merge(layout))));

  let paths = {};

  for (let k = 0; k < names.length; k++) {
    paths[names[k]] = getPath(x, y, layout[k], dates);
  }

  return [paths, x, y];
}


