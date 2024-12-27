import {
  EXAMPLE_REMOVED_NODE,
  EXAMPLE_TOGGLED_NAME,
  EXAMPLE_UPDATE_PATHS,
  EXAMPLE_ALTER_OFFSET
} from '../actions';

import { getInitialValues, getPathsAndScales } from './utils';

let [data, names, dates] = getInitialValues(150);

let initialState = {
  data: data,
  view: [500, 325],         // ViewBox: Width, Height
  trbl: [15, 10, 10, 30],   // Margins: Top, Right, Bottom, Left
  names: names,
  dates: dates,
  offset: 'stream',
  yScale: () => {},         // Ordinal y-scale
  xScale: () => {},         // Linear x-scale
  mounted: {},              // Currently Mounted Nodes
  removed: {}               // Nodes removed since last update
};

function updateNodes(state, names, offset) {
  let {view, trbl, data, dates, mounted, removed} = state;

  let nodes = {};

  let dims = [
    view[0] - trbl[1] - trbl[3],
    view[1] - trbl[0] - trbl[2]
  ];

  let [paths, x, y] = getPathsAndScales(dims, data, names, dates, offset);

  for (let key in paths) {
    nodes[key] = {
      udid: key,
      path: paths[key]
    };

    if (mounted[key] && !removed[key]) {
      nodes[key].type = 'UPDATING';
    } else {
      nodes[key].type = 'MOUNTING';
    }
  }

  for (let key in mounted) {
    if (!nodes[key] && !removed[key]) {
      nodes[key] = {
        udid: mounted[key].udid,
        path: mounted[key].path, 
        type: 'REMOVING'
      };
    }
  }

  return {
    mounted: nodes,
    removed: {},
    names: names,
    dates: dates,
    offset: offset,
    xScale: x,
    yScale: y
  };
}

function toggleNode(state, action) {
  let {index} = action;

  let names = [
    ...state.names.slice(0, index),
    {name: state.names[index].name, show: !state.names[index].show},
    ...state.names.slice(index + 1)
  ];

  return updateNodes(state, names, state.offset);
}


function removedNode(state, udid) {
  let removed = {};
  removed[udid] = true;

  return Object.assign({}, state.removed, removed);
}

export function reducer(state = initialState, action) {

  switch (action.type) {

  case EXAMPLE_TOGGLED_NAME:
    return Object.assign({}, state, toggleNode(state, action));

  case EXAMPLE_REMOVED_NODE:
    return Object.assign({}, state, {
      removed: removedNode(state, action.udid)
    });

  case EXAMPLE_UPDATE_PATHS:
    let { names, offset } = state;
    return Object.assign({}, state, updateNodes(state, names, offset));

  case EXAMPLE_ALTER_OFFSET:
    return Object.assign({}, state, updateNodes(state, state.names, action.name));

  default:
    return state;
  }
}
