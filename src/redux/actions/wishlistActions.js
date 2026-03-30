export const ADD_TO_WISHLIST = "ADD_TO_WISHLIST";
export const REMOVE_FROM_WISHLIST = "REMOVE_FROM_WISHLIST";
export const GET_WISHLIST = "GET_WISHLIST";

export const addToWishlist = (product, addToast) => {
  return dispatch => {
    // TODO: POST auth/customer/wishlist when backend endpoint is confirmed
    if (addToast) {
      addToast("Added to wishlist", { appearance: "success", autoDismiss: true });
    }
    dispatch({ type: ADD_TO_WISHLIST, payload: product });
  };
};

export const removeFromWishlist = (product, addToast) => {
  return dispatch => {
    // TODO: DELETE auth/customer/wishlist/:id when backend endpoint is confirmed
    if (addToast) {
      addToast("Removed from wishlist", { appearance: "error", autoDismiss: true });
    }
    dispatch({ type: REMOVE_FROM_WISHLIST, payload: product });
  };
};
