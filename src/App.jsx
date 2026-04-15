import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AccountPage from './pages/AccountPage'
import CheckoutPage from './pages/CheckoutPage'
import WishlistPage from './pages/WishlistPage'

// Admin
import AdminRoute from './admin/AdminRoute'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminProducts from './admin/AdminProducts'
import AdminCategories from './admin/AdminCategories'
import AdminOrders from './admin/AdminOrders'
import AdminCustomers from './admin/AdminCustomers'
import AdminBanners from './admin/AdminBanners'

function StoreFront({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Storefront routes */}
            <Route path="/" element={<StoreFront><HomePage /></StoreFront>} />
            <Route path="/products" element={<StoreFront><ProductsPage /></StoreFront>} />
            <Route path="/category/:slug" element={<StoreFront><ProductsPage /></StoreFront>} />
            <Route path="/product/:slug" element={<StoreFront><ProductDetailPage /></StoreFront>} />
            <Route path="/cart" element={<StoreFront><CartPage /></StoreFront>} />
            <Route path="/checkout" element={<StoreFront><CheckoutPage /></StoreFront>} />
            <Route path="/login" element={<StoreFront><LoginPage /></StoreFront>} />
            <Route path="/signup" element={<StoreFront><SignupPage /></StoreFront>} />
            <Route path="/account" element={<StoreFront><AccountPage /></StoreFront>} />
            <Route path="/wishlist" element={<StoreFront><WishlistPage /></StoreFront>} />

            {/* Admin routes - no Navbar/Footer */}
            <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
            <Route path="/admin/customers" element={<AdminRoute><AdminLayout><AdminCustomers /></AdminLayout></AdminRoute>} />
            <Route path="/admin/banners" element={<AdminRoute><AdminLayout><AdminBanners /></AdminLayout></AdminRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}