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
    case "REMOVE_USER_DATA":
      return {
        ...state,
        userData: {},
      };
    default:
      return state;
  }
};

export default reducer;
