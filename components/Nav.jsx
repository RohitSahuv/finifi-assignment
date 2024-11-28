import { useRouter } from "next/router";
import Link from "next/link";
import { TbInvoice } from "react-icons/tb";
import { VscDashboard } from "react-icons/vsc";
import { FaShop } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";

export default function Navbar({ sidebarOpen }) {
  const router = useRouter();
  const { pathname } = router;

  const links = [
    { href: "/", label: "Dashboard", icon: VscDashboard },
    { href: "/invoice", label: "Invoices", icon: TbInvoice },
    { href: "/vendors", label: "Vendors", icon: FaShop },
    { href: "/setting", label: "Settings", icon: FiSettings },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "block" : "hidden"
      } fixed md:relative md:block bg-blue-100 h-screen w-64 shadow-md transition-all`}
    >
      <div className="flex items-center py-4 px-6">
        <Link href="/" passHref>
          <img
            src="/logoass.png"
            alt="logo"
            className="w-36 h-8 object-cover"
          />
        </Link>
      </div>
      <nav className="mt-4 flex flex-col space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} passHref>
            <div
              className={`flex items-center px-6 py-3 rounded-l-full cursor-pointer ${
                pathname === link.href
                  ? "bg-blue-700 text-white border-l-4 border-blue-700"
                  : "text-gray-600 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <link.icon
                className={`w-6 h-6 ${
                  pathname === link.href ? "text-white" : "text-blue-700"
                }`}
              />
              <span
                className={`ml-4 font-medium ${
                  pathname === link.href ? "text-white" : "text-blue-700"
                }`}
              >
                {link.label}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
