import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlistActions";
import { addToCart } from "../../redux/actions/cartActions";
import { setProductID } from "../../redux/actions/productActions";
import Layout from "../../layouts/Layout";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Wishlist = ({ wishlistItems, removeFromWishlist, addToCart, cartID, defaultStore, userData, setProductID }) => {
  const { addToast } = useToasts();

  return (
    <Fragment>
      <MetaTags>
        <title>Wishlist</title>
      </MetaTags>
      <BreadcrumbsItem to="/">Home</BreadcrumbsItem>
      <BreadcrumbsItem to="/wishlist">Wishlist</BreadcrumbsItem>
      <Layout headerTop="visible">
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems.length === 0 ? (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like" style={{ fontSize: 60 }}></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items in wishlist <br />
                      <Link to="/">Shop Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-content table-responsive cart-table-content">
                    <table>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Unit Price</th>
                          <th>Add To Cart</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishlistItems.map((product, key) => (
                          <tr key={key}>
                            <td className="product-thumbnail">
                              <Link to={"/product/" + product.description.friendlyUrl} onClick={() => setProductID(product.id)}>
                                {product.image && (
                                  <img className="img-fluid" src={product.image.imageUrl} alt={product.description.name} style={{ width: 80 }} />
                                )}
                              </Link>
                            </td>
                            <td className="product-name">
                              <Link to={"/product/" + product.description.friendlyUrl} onClick={() => setProductID(product.id)}>
                                {product.description.name}
                              </Link>
                            </td>
                            <td className="product-price-cart">
                              <span className="amount">
                                {product.discounted ? product.finalPrice : product.originalPrice}
                              </span>
                            </td>
                            <td className="product-wishlist-cart">
                              {product.available && product.canBePurchased && product.quantity > 0 ? (
                                <button onClick={() => addToCart(product, addToast, cartID, 1, defaultStore, userData)}>
                                  Add to cart
                                </button>
                              ) : (
                                <button disabled>Out of Stock</button>
                              )}
                            </td>
                            <td className="product-remove">
                              <button onClick={() => removeFromWishlist(product, addToast)}>
                                <i className="fa fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

Wishlist.propTypes = {
  wishlistItems: PropTypes.array,
  removeFromWishlist: PropTypes.func,
  addToCart: PropTypes.func,
};

const mapStateToProps = state => ({
  wishlistItems: state.wishlistData.wishlistItems,
  cartID: state.cartData.cartID,
  defaultStore: state.merchantData.defaultStore,
  userData: state.userData.userData,
});

const mapDispatchToProps = dispatch => ({
  removeFromWishlist: (product, addToast) => dispatch(removeFromWishlist(product, addToast)),
  addToCart: (item, addToast, cartId, qty, store, userData) => dispatch(addToCart(item, addToast, cartId, qty, store, userData)),
  setProductID: (id) => dispatch(setProductID(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
