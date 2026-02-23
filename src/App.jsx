import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './components/ProductPage';
import CheckoutPage from './components/CheckoutPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
      {
        path: 'shop/:id',
        element: <ProductPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage/>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;