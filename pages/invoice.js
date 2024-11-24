import Layout from "@/components/Layout";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { FaUserPlus } from "react-icons/fa";
import { CustomTable } from "@/components/Table";
import Modal from "react-modal";
import EntryForm from "@/components/EntryForm";

import { VscBellDot } from "react-icons/vsc";

import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { columns, tabs } from "@/lib/constant";

let initialValues = {
  vendorName: "",
  invoice: "",
  status: "All",
  netAmount: "",
  invoiceDate: "",
  dueDate: "",
  department: "",
  costCenter: "",
};

export default function PeoplePage() {


  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState(initialValues);
  const [activeTab, setActiveTab] = useState("All");
  const modalRef = useRef(null);
  const [searchType, setSearchType] = useState("byVendor");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDropdownChange = (e) => {
    setSearchType(e.target.value);
  };

  const filteredData = invoices.filter((invoice) => {
    const vendorName = invoice.vendorName || "";
    const invoiceNumber = invoice.invoice || "";
    return (
      vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const fetchInvoices = async () => {
    try {
      const statusQuery = activeTab === "All" ? "" : `${activeTab}`;
      const response = await fetch(`/api/invoice?status=${statusQuery}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const fomratedInvoice = data.map((invoice) => {
        return {
          ...invoice,
          invoiceDate: invoice.invoiceDate.split("T")[0],
          dueDate: invoice.dueDate.split("T")[0],
        };
      });
      setInvoices(fomratedInvoice);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSelect = (values) => {
    setSelectedRows({
      ...values,
    });
    openModal();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRows({});
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles} // Style for modal
        className="ReactModal__Content"
        overlayClassName="custom-overlay" //
      >
        <CustomModalContent>
          <EntryForm
            fetchInvoices={fetchInvoices}
            onRequestClose={closeModal}
            initialValues={selectedRows}
          />
        </CustomModalContent>
      </Modal>
      <Layout backgroundColor="black">
        <Container>
          <Headercontainer>
            <Header>Manage Invoices</Header>
            <Headerright>
              <ProfileIcon fontSize={"2rem"} />
              <Icons>
                {/* <Profileimage fontSize={"2rem"} /> */}
                <ProfileImage>
                  <Image
                    src="/profile-image.png"
                    alt="profile"
                    width={60}
                    height={40}
                  />
                </ProfileImage>

                <ProfileComponent>
                  <ProfileText>Rohit Sharma</ProfileText>
                  <ProfileEmail>rohit.shara@gmail.com</ProfileEmail>
                </ProfileComponent>
              </Icons>
            </Headerright>
          </Headercontainer>
          <Tabs>
            {tabs.map((tab) => (
              <Tab
                key={tab}
                active={activeTab === tab}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </Tab>
            ))}
          </Tabs>

          <ActionBar>
            <Box>
              <SearchContainer>
                <SearchIcon />
                <Dropdown value={searchType} onChange={handleDropdownChange}>
                  <Options value="byVendor">By Vendor</Options>
                  <Options value="byInvoice">By Invoice</Options>
                </Dropdown>
                <Input
                  type="text"
                  placeholder={`Search ${searchType === "byVendor" ? "Vendor Name" : "Invoice Number"
                    }`}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </SearchContainer>
              <ActionButton primary onClick={openModal}>
                <FaUserPlus fontSize={"1rem"} /> Add
              </ActionButton>
            </Box>
          </ActionBar>
          <CustomTable
            columns={columns}
            data={filteredData}
            onSelectRow={handleSelect}
          />
        </Container>
      </Layout>
    </>
  );
}

// Options
const Options = styled.option`
  font-size: 0.9rem;
  color: #000;
  padding: 0.5rem 1rem;
`;

const customStyles = {
  content: {
    top: "0",
    right: "0",
    position: "fixed",
    background: "rgb(255, 255, 255)",
    borderRadius: "4px",
    outline: "none",
    width: "30rem",
    overflow: "hidden",
    zIndex: 1000,
    opacity: 1, // Ensure it shows after opening
    transition: "opacity 0.3s ease-in-out",
    padding: 0,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
const Icons = styled.div`
  display: flex;
`;
const ProfileComponent = styled.div`
  display: flex;
  flex-direction: column;
`;
const ProfileText = styled.p`
  font-size: 10px;
  font-weight: 500;
  margin-top: 5px;
`;
const ProfileEmail = styled.p`
  font-size: 8px;
  font-weight: 300;
`;

const Flex = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const Headercontainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Headerright = styled.div`
  display: flex;
  gap: 10px;
`;

const ProfileIcon = styled(VscBellDot)`
  border: 1px solid gray;
  border-radius: 100%;
  padding: 2px 5px 2px 5px;
  color: red;
  font-size: 2rem;
`;
const ProfileImage = styled.div``;

const CustomModalContent = styled.div`
  &.ReactModal__Content {
    position: absolute;
    background: rgb(255, 255, 255);
    border-radius: 4px;
    outline: none;
    width: 25rem;
    height: 100%;
    right: 0%;
    padding: 0;
  }

  &.ReactModal__Content--after-open {
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
  }
`;

const Container = styled.div`
  padding: 1.5rem;
  padding-top: 0rem;
  width: 100%;
  margin: 1rem auto;
  margin-top: 0.8rem;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Header = styled.h1`
  width: 100%;
  height: 41px;
  top: 46px;
  left: 27px;
  font-weight: 600;
  font-size: 1.5rem;
`;

const Tabs = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
`;

// Search bar and button actions
const ActionBar = styled.div`
  width: 100%;

  margin-bottom: 10px;
  /* border: 1px solid red; */
  padding: 10px 0;
  margin-top: 10px;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
`;

const Box = styled.div`
  display: flex;
  justify-content: space-around;
  width: 90%;
  /* border: 1px solid blue;     */
  align-items: center;

  /* align-content: center; */
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  display: flex;
  padding: 7px 10px 7px 10px;
  gap: 5px;
  width: fit-content;
  border-radius: 3px 0px 0px 0px;
  opacity: 0px;
  font-size: 12px;
  font-weight: medium;
  justify-content: center;
  align-items: center;
  border: ${(props) => (props.primary ? "none" : "1px solid #000")};
  background-color: ${(props) => (props.primary ? "#000" : "#F0F0F0")};
  color: ${(props) => (props.primary ? "#fff" : "#000")};
  border: none;
  &:hover {
    background-color: ${(props) => (props.primary ? "#333" : "#f5f5f5")};
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  &:last-child {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const Tab = styled.button`
  height: 30px;
  padding: 15px 14px 25px 14px;
  text-wrap: wrap;
  gap: 10px;
  font-size: 13px;
  /* font-weight: bold; */
  /* border-radius: 50px; */
  margin-right: 10px;

  /* margin-bottom: 10px; */
  border-bottom: ${(props) => (props.active ? "3px solid #2e5b76" : "none")};
  font-weight: ${(props) => (props.active ? "500" : "400")};

  /* border: none; */
  cursor: pointer;
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f9fbfc;
  border: 2px solid #eaf1fb;
  border-radius: 6px;
  padding: 5px 10px;
  width: 300px;
`;

const Dropdown = styled.select`
  border: none;
  background: none;
  font-size: 0.9rem;
  color: #000;
  margin-right: 10px;
  outline: none;
  cursor: pointer;
`;

const Input = styled.input`
  border: none;
  flex: 1;
  font-size: 0.9rem;
  outline: none;
  background: none;
`;

const SearchIcon = styled(BiSearch)`
  margin-right: 8px;
  color: #888;
`;
