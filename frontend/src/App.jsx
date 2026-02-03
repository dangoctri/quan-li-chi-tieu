import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Wallets from './pages/Wallets';
import Budgets from './pages/Budgets';

import Events from './pages/Events';
import Savings from './pages/Savings';
import Debts from './pages/Debts';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/wallets" element={<Wallets />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/savings" element={<Savings />} />
                    <Route path="/debts" element={<Debts />} />
                    <Route path="/categories" element={<Categories />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
