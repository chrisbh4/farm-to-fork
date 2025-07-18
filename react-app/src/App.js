import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import ProductDetails from './components/Products/ProductDetails';
import HomePage from './components/Home/Homepage';
import ProductEditForm from './components/Products/ProductEditForm';
import { authenticate } from './store/session';
import ProductCreateForm from './components/Products/ProductCreateForm';
import { fetchAllProducts } from './store/products';
import AllProductsPage from './components/Products/AllProductsPage';
import OrdersPage from './components/Orders/OrdersPage';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      await dispatch(fetchAllProducts());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>
        <ProtectedRoute path='/products' exact={true} >
          <AllProductsPage />
        </ProtectedRoute>
        <ProtectedRoute path='/products/create' exact={true}>
          <ProductCreateForm />
        </ProtectedRoute>
        <Route path='/products/:id' exact={true} >
          <ProductDetails  />
        </Route>
        <Route path='/products/:id/edit' exact={true} >
          <ProductEditForm />
        </Route>
        <ProtectedRoute path='/orders' exact={true} >
          <OrdersPage />
        </ProtectedRoute>
        <Route path='/' exact={true} >
          <HomePage />
        </Route>
        <Route>
          404 page not found
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
