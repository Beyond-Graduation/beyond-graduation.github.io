export const initialState = {
  userData: {},
  userId: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_ID":
      return {
        ...state,
        userId: action.item,
      };
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.item,
      };
    default:
      return state;
  }
};

export default reducer;
