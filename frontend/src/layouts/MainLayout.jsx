import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../components/Navbar";

function MainLayout() {
  const { pathname } = useLocation(); // Get current route path

  // Scroll to top whenever the path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-55">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default MainLayout;
