import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../actions/wishlistActions";

const initState = { wishlistItems: [] };

const wishlistReducer = (state = initState, action) => {
  if (action.type === ADD_TO_WISHLIST) {
    const exists = state.wishlistItems.find(item => item.id === action.payload.id);
    if (exists) return state;
    return { ...state, wishlistItems: [...state.wishlistItems, action.payload] };
  }
  if (action.type === REMOVE_FROM_WISHLIST) {
    return {
      ...state,
      wishlistItems: state.wishlistItems.filter(item => item.id !== action.payload.id)
    };
  }
  return state;
};

export default wishlistReducer;
