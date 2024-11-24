
import { useRouter } from "next/router";

import styled from "styled-components";
import Link from "next/link";
import { TbInvoice } from "react-icons/tb";

import { VscDashboard } from "react-icons/vsc";
import { FaShop } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";

const Aside = styled.aside`
  padding: 0rem 0 0 1.5rem;

  position: fixed;
  width: 16rem;
  background-color: #eaf1fb;
  height: 100vh;
  transition: all 0.3s;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.show ? "block" : "none")};
  @media (min-width: 768px) {
    width: 16rem;
    position: relative;
  }
`;

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const NavLink = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 12px 0px 12px 18px;
  color: ${(props) => (props.$active ? "#2e5b76" : "#4B5563")};
  border-radius: ${(props) => (props.$active ? "20px 0px 0px 20px" : "0%")};
  background-color: ${(props) => (props.$active ? "#2e5b76" : "transparent")};
  cursor: pointer;
  border-left: 3px solid
    ${(props) => (props.$active ? "#2e5b76" : "transparent")};

  &:hover {
    background-color: #6ba4bb;
    border-radius: 20px 0px 0px 20px;
  }
`;

const Icon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  color: #2e5b76;
  color: ${(props) => (props.$active ? "#fff" : "#2e5b76")};
  &:hover {
    color: #fff;
    font-weight: 400;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  padding: 12px 0px 12px 5px;
`;

const Label = styled.span`
  color: #2e5b76;
  font-weight: 500;
  color: ${(props) => (props.$active ? "#fff" : "#2e5b76")};
  font-weight: ${(props) => (props.$active ? "400" : "500")};
  &:hover {
    color: #fff;
    font-weight: 400;
  }
`;

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
    <>
      <Aside show={sidebarOpen}>
        <LogoContainer>
          <Link href="/" passHref>
            <Img src="/logoass.png" alt="logo" width={"150px"} height={"30px"} />
          </Link>
        </LogoContainer>
        <NavContainer>
          {links.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <NavLink key={link.href} $active={pathname === link.href}>
                <Icon as={link.icon} $active={pathname === link.href} />
                <Label $active={pathname === link.href}>{link.label}</Label>
              </NavLink>
            </Link>
          ))}
        </NavContainer>
      </Aside>
    </>
  );
}

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  object-fit: cover;
`;
