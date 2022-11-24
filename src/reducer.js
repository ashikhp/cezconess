const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_SESSION":
      return {
        ...state,
        sessionData: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
