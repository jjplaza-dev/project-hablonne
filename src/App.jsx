import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './components/ProductPage';
// import Shop from './pages/Shop';
// import Product from './pages/Product';
// import Cart from './pages/Cart';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <ErrorPage />, // Good to add later for a 404 page
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'shop',
        element: <Shop />, // Replace with <Shop />
      },
      {
        path: 'shop/:id',
        element: <ProductPage />, // Replace with <Product />
      },
      {
        path: 'cart',
        element: <div>Shopping Cart</div>, // Replace with <Cart />
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;