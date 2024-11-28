import { useState, useEffect } from "react";
import Nav from "./Nav";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize(); // Ensure correct state on initial load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex bg-white-100">
      <Nav sidebarOpen={sidebarOpen} />
      <div className="flex-grow w-full">{children}</div>
    </div>
  );
}
