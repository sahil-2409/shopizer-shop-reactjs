# Shopizer Shop — React Frontend Documentation

> Version: 3.0.0 | Bootstrapped with Create React App | Node v16.13.0+

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Folder Structure](#3-folder-structure)
4. [Configuration](#4-configuration)
5. [Routing](#5-routing)
6. [State Management (Redux)](#6-state-management-redux)
7. [API Layer](#7-api-layer)
8. [Key Features](#8-key-features)
9. [Internationalization](#9-internationalization)
10. [Theming](#10-theming)
11. [Payment Integration](#11-payment-integration)
12. [Running the App](#12-running-the-app)
13. [Docker Deployment](#13-docker-deployment)
14. [CI/CD](#14-cicd)
15. [Environment Variables Reference](#15-environment-variables-reference)

---

## 1. Project Overview

This is the **React.js storefront** for [Shopizer](https://www.shopizer.com/) — an open-source e-commerce platform. It connects to the Shopizer Java backend via a REST API and provides a full shopping experience including product browsing, cart management, checkout, user accounts, and order tracking.

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    React Application                     │   │
│  │                                                          │   │
│  │  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐   │   │
│  │  │    Pages    │   │  Components  │   │   Wrappers  │   │   │
│  │  │  Home       │   │  Header      │   │  HeroSlider │   │   │
│  │  │  Category   │   │  Footer      │   │  Product    │   │   │
│  │  │  Product    │   │  Product     │   │  Footer     │   │   │
│  │  │  Cart       │   │  Cart        │   │  Breadcrumb │   │   │
│  │  │  Checkout   │   │  Newsletter  │   │  Newsletter │   │   │
│  │  │  MyAccount  │   │  Consent     │   └─────────────┘   │   │
│  │  │  Orders     │   │  Loader      │                      │   │
│  │  └──────┬──────┘   └──────────────┘                      │   │
│  │         │                                                 │   │
│  │  ┌──────▼──────────────────────────────────────────────┐ │   │
│  │  │                  Redux Store                        │ │   │
│  │  │                                                     │ │   │
│  │  │  productData │ cartData │ userData │ merchantData   │ │   │
│  │  │  content     │ loading  │ multilanguage             │ │   │
│  │  └──────┬──────────────────────────────────────────────┘ │   │
│  │         │                                                 │   │
│  │  ┌──────▼──────────────────────────────────────────────┐ │   │
│  │  │              WebService (Axios)                     │ │   │
│  │  │         GET / POST / PUT / DELETE / PATCH           │ │   │
│  │  │         Bearer Token Auth via Interceptors          │ │   │
│  │  └──────┬──────────────────────────────────────────────┘ │   │
│  └─────────┼────────────────────────────────────────────────┘   │
└────────────┼────────────────────────────────────────────────────┘
             │  HTTP REST (JSON)
             ▼
┌────────────────────────────────┐
│   Shopizer Backend (Java)      │
│   http://localhost:8080        │
│   /api/v1/                     │
│                                │
│  Products, Categories, Cart    │
│  Orders, Customers, Content    │
│  Shipping, Payments, Auth      │
└────────────────────────────────┘
```

### Data Flow

```
User Action
    │
    ▼
React Component
    │
    ├──► Redux Action (e.g. cartActions, userAction)
    │         │
    │         ▼
    │    WebService.get/post/put/delete
    │         │
    │         ▼
    │    Shopizer REST API
    │         │
    │         ▼
    │    Redux Reducer updates Store
    │         │
    │         ▼
    └──► Component re-renders with new state
```

---

## 3. Folder Structure

```
shopizer-shop-reactjs/
├── public/
│   ├── env-config.js          # Runtime environment config (injected at startup)
│   ├── index.html
│   ├── manifest.json
│   └── assets/                # Static images and banners
│
├── src/
│   ├── App.js                 # Root component — routing setup
│   ├── index.js               # Redux store init + ReactDOM render
│   │
│   ├── pages/                 # Top-level route pages
│   │   ├── home/              # Home page
│   │   ├── category/          # Product category listing
│   │   ├── product-details/   # Single product view
│   │   ├── search-product/    # Search results
│   │   ├── content/           # CMS content pages
│   │   └── other/             # Cart, Checkout, Account, Orders, Auth
│   │
│   ├── components/            # Reusable UI components
│   │   ├── header/
│   │   ├── footer/
│   │   ├── product/
│   │   ├── hero-slider/
│   │   ├── newsletter/
│   │   ├── consent/           # Cookie consent banner
│   │   ├── loader/            # Global loading spinner
│   │   ├── contact/
│   │   ├── feature-icon/
│   │   └── section-title/
│   │
│   ├── wrappers/              # Layout wrappers (combine components + data)
│   │   ├── header/
│   │   ├── footer/
│   │   ├── product/
│   │   ├── hero-slider/
│   │   ├── breadcrumb/
│   │   ├── newsletter/
│   │   ├── promos/
│   │   └── feature-icon/
│   │
│   ├── redux/
│   │   ├── actions/           # Redux action creators
│   │   │   ├── cartActions.js
│   │   │   ├── userAction.js
│   │   │   ├── productActions.js
│   │   │   ├── storeAction.js
│   │   │   ├── contentAction.js
│   │   │   └── loaderActions.js
│   │   └── reducers/          # Redux reducers
│   │       ├── rootReducer.js
│   │       ├── cartReducer.js
│   │       ├── userReducer.js
│   │       ├── productReducer.js
│   │       ├── storeReducer.js
│   │       ├── contentReducer.js
│   │       └── loaderReducer.js
│   │
│   ├── util/
│   │   ├── webService.js      # Axios HTTP client wrapper
│   │   ├── constant.js        # API endpoint path constants
│   │   └── helper.js          # Utility functions (localStorage, etc.)
│   │
│   ├── helpers/
│   │   ├── product.js         # Product filtering/sorting helpers
│   │   └── scroll-top.js      # Scroll restoration on route change
│   │
│   ├── translations/
│   │   ├── english.json       # EN i18n strings
│   │   └── french.json        # FR i18n strings
│   │
│   ├── data/                  # Static JSON data (hero sliders, feature icons)
│   ├── assets/                # SCSS styles and fonts
│   └── layouts/
│       └── Layout.js          # Shared page layout wrapper
│
├── conf/                      # Nginx config for Docker
├── .circleci/                 # CI/CD pipeline config
├── Dockerfile
├── env.sh                     # Env variable injection script (Docker)
├── .env                       # Local dev environment variables
└── package.json
```

---

## 4. Configuration

### Local Development — `.env`

```
APP_PRODUCTION=false
APP_BASE_URL=http://localhost:8080
APP_API_VERSION=/api/v1/
APP_MERCHANT=DEFAULT
APP_PRODUCT_GRID_LIMIT=15
APP_MAP_API_KEY=
APP_NUVEI_TERMINAL_ID=
APP_NUVEI_SECRET=
APP_PAYMENT_TYPE=STRIPE
APP_STRIPE_KEY=
APP_THEME_COLOR=#D1D1D1
```

### Runtime Config — `public/env-config.js`

This file is loaded at runtime (not build time) and exposes config via `window._env_`. This allows Docker deployments to inject environment-specific values without rebuilding the app.

```js
window._env_ = {
  APP_BASE_URL: "http://localhost:8080",
  APP_MERCHANT: "DEFAULT",
  APP_PAYMENT_TYPE: "STRIPE",
  APP_THEME_COLOR: "#D1D1D1",
  // ...
}
```

> In Docker, `env.sh` rewrites this file at container startup using environment variables passed via `-e` flags.

---

## 5. Routing

All routes are defined in `src/App.js` using `react-router-dom` v5. All pages are **lazy-loaded** via `React.lazy()`.

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Homepage with hero slider, featured products |
| `/category/:id` | `Category` | Product listing by category |
| `/product/:id` | `ProductDetail` | Single product detail page |
| `/search/:id` | `SearchProduct` | Search results |
| `/content/:id` | `Content` | CMS content pages |
| `/cart` | `Cart` | Shopping cart |
| `/checkout` | `Checkout` | Checkout flow |
| `/order-confirm` | `OrderConfirm` | Post-purchase confirmation |
| `/order-details/:id` | `OrderDetails` | Specific order detail |
| `/recent-order` | `RecentOrder` | Recent orders list |
| `/login` | `LoginRegister` | Login form |
| `/register` | `LoginRegister` | Registration form |
| `/my-account` | `MyAccount` | Account dashboard |
| `/forgot-password` | `ForgotPassword` | Password reset request |
| `/customer/:code/reset/:id` | `ResetPassword` | Password reset confirmation |
| `/contact` | `Contact` | Contact form |
| `*` | `NotFound` | 404 page |

---

## 6. State Management (Redux)

The Redux store is initialized in `src/index.js` with `redux-thunk` middleware and `redux-localstorage-simple` for persistence.

### Store Shape

```
{
  multilanguage: { currentLanguageCode: "en" },
  productData:   { ... },   // product listings, filters
  merchantData:  { ... },   // store/merchant info
  cartData:      { ... },   // cart items, cart ID
  loading:       { ... },   // global loader state
  userData:      { ... },   // logged-in user, token
  content:       { ... }    // CMS content pages
}
```

### Actions

| File | Manages |
|---|---|
| `cartActions.js` | Add/remove/update cart items, cart ID (cookie-based) |
| `userAction.js` | Login, logout, register, token management |
| `productActions.js` | Fetch product listings |
| `storeAction.js` | Fetch merchant/store configuration |
| `contentAction.js` | Fetch CMS content |
| `loaderActions.js` | Show/hide global loading spinner |

---

## 7. API Layer

`src/util/webService.js` wraps Axios with a static class:

```js
WebService.get(endpoint)
WebService.post(endpoint, payload)
WebService.put(endpoint, payload)
WebService.patch(endpoint, payload)
WebService.delete(endpoint)
```

Base URL is constructed as: `APP_BASE_URL + APP_API_VERSION` → e.g. `http://localhost:8080/api/v1/`

**Auth:** JWT Bearer token is automatically attached to every request via an Axios request interceptor. Token is read from localStorage.

**Error handling:** 401 and 404 responses are caught in the response interceptor.

### API Endpoint Constants (`src/util/constant.js`)

Key paths used across the app:

| Constant | Path |
|---|---|
| `STORE` | `store/` |
| `CATEGORY` | `category/` |
| `PRODUCT` | `product/` |
| `PRODUCTS` | `products/` |
| `CART` | `cart/` |
| `CUSTOMER` | `customer/` |
| `LOGIN` | `login/` |
| `CHECKOUT` | `checkout` |
| `ORDERS` | `orders/` |
| `SEARCH` | `search/` |
| `SHIPPING` | `shipping` |
| `NEWSLETTER` | `newsletter/` |
| `CONTACT` | `contact/` |

---

## 8. Key Features

- **Product Catalog** — Browse by category, search, view product details with images and variants
- **Shopping Cart** — Persistent cart via cookie (`{MERCHANT}_shopizer_cart`), synced with backend
- **Checkout** — Multi-step checkout with shipping address, shipping options, and payment
- **Payments** — Stripe (default) and Nuvei payment gateway support
- **User Accounts** — Register, login, manage profile, view order history
- **Password Reset** — Forgot password + email-based reset flow
- **CMS Pages** — Dynamic content pages served from backend
- **Cookie Consent** — GDPR-compliant cookie consent banner
- **Newsletter** — Email subscription
- **Contact Form** — Contact page with Google Maps integration
- **Lazy Loading** — All pages are code-split and lazy-loaded

---

## 9. Internationalization

Uses `redux-multilanguage`. Languages are loaded in `App.js`:

```js
loadLanguages({
  languages: {
    en: require("./translations/english.json"),
    fr: require("./translations/french.json")
  }
})
```

To add a new language, add a JSON translation file in `src/translations/` and register it here.

---

## 10. Theming

The primary theme color is controlled via a CSS custom property:

```js
document.documentElement.style.setProperty('--theme-color', window._env_.APP_THEME_COLOR)
```

Set `APP_THEME_COLOR` in your environment to change the accent color across the entire UI. Default: `#D1D1D1`.

---

## 11. Payment Integration

Configured via `APP_PAYMENT_TYPE` environment variable.

| Gateway | Config Keys |
|---|---|
| Stripe | `APP_STRIPE_KEY` (publishable key) |
| Nuvei | `APP_NUVEI_TERMINAL_ID`, `APP_NUVEI_SECRET` |

Switch between gateways by changing `APP_PAYMENT_TYPE` to `STRIPE` or `NUVEI`.

---

## 12. Running the App

### Prerequisites

- Node.js v16.13.0+
- Shopizer backend running at `APP_BASE_URL`

### Install

```bash
npm i
# if it fails:
npm install --legacy-peer-deps
```

### Start Dev Server

```bash
npm run dev
# → http://localhost:3000
```

### Build for Production

```bash
npm run build
```

---

## 13. Docker Deployment

### Build Image

```bash
docker build . -t shopizerecomm/shopizer-shop:latest
```

### Run Container

```bash
docker run \
  -e "APP_MERCHANT=DEFAULT" \
  -e "APP_BASE_URL=http://localhost:8080" \
  -e "APP_THEME_COLOR=#D1D1D1" \
  -e "APP_PAYMENT_TYPE=STRIPE" \
  -e "APP_STRIPE_KEY=your_stripe_key" \
  -it --rm -p 80:80 \
  shopizerecomm/shopizer-shop:latest
# → http://localhost
```

### How it works

```
Docker Build:
  node:13.12.0-alpine  →  npm ci + npm run build  →  /app/build

Docker Run:
  nginx:stable-alpine  →  env.sh rewrites env-config.js  →  nginx serves /app/build
```

`env.sh` reads Docker `-e` environment variables and injects them into `public/env-config.js` at container startup, so the React app picks them up via `window._env_` without a rebuild.

---

## 14. CI/CD

CircleCI pipeline is configured at `.circleci/config.yml`. It handles automated build and deployment on push.

---

## 15. Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `APP_PRODUCTION` | `false` | Production mode flag |
| `APP_BASE_URL` | `http://localhost:8080` | Shopizer backend URL |
| `APP_API_VERSION` | `/api/v1/` | API version prefix |
| `APP_MERCHANT` | `DEFAULT` | Merchant code |
| `APP_PRODUCT_GRID_LIMIT` | `15` | Products per page |
| `APP_MAP_API_KEY` | _(empty)_ | Google Maps API key |
| `APP_PAYMENT_TYPE` | `STRIPE` | Payment gateway (`STRIPE` or `NUVEI`) |
| `APP_STRIPE_KEY` | _(empty)_ | Stripe publishable key |
| `APP_NUVEI_TERMINAL_ID` | _(empty)_ | Nuvei terminal ID |
| `APP_NUVEI_SECRET` | _(empty)_ | Nuvei secret |
| `APP_THEME_COLOR` | `#D1D1D1` | Primary UI accent color (CSS variable) |
