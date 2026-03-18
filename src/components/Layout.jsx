import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
      {/* ScrollRestoration ensures page moves to the top on navigation changes */}
      <ScrollRestoration />
    </div>
  );
};

export default Layout;
