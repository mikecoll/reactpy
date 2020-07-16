const useReducerDebugger = (reducer, reducerName) => (state, action) => {
  const newState = reducer(state, action);

  // console.log(reducerName, { action, newState, prevState: state }); // eslint-disable-line

  return newState;
};

export default useReducerDebugger;
