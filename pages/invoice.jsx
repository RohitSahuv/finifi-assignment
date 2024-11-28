import Layout from "@/components/Layout";
import { useEffect, useRef, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { CustomTable } from "@/components/Table";
import Modal from "react-modal";
import EntryForm from "@/components/EntryForm";
import { VscBellDot } from "react-icons/vsc";
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { columns, tabs } from "@/lib/constant";
import { toast, Toaster } from "react-hot-toast";

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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const statusQuery = activeTab === "All" ? "" : `${activeTab}`;
      const response = await fetch(`https://finifi-backend-27au.onrender.com/api/invoices?status=${statusQuery}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      const formattedInvoice = data.map((invoice) => {
        return {
          ...invoice,
          invoiceDate: invoice.invoiceDate.split("T")[0],
          dueDate: invoice.dueDate.split("T")[0],
        };
      });
      setInvoices(formattedInvoice);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
    } finally {
      setIsLoading(false);
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


  const handlerDeleteRow = async function (row) {
    try {
      const response = await fetch(`https://finifi-backend-27au.onrender.com/api/invoices/${row._id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success("Invoice deleted successfully");
        fetchInvoices();
      } else {
        throw new Error("Failed to delete invoice");
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error("Failed to delete invoice");
    }
  };

  return (
    <>
      <Toaster />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: "0",
            right: "0",
            position: "fixed",
            background: "#fff",
            borderRadius: "4px",
            outline: "none",
            width: "30rem",
            overflow: "hidden",
            zIndex: 1000,
            opacity: 1,
            transition: "opacity 0.3s ease-in-out",
            padding: 0,
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
        className="ReactModal__Content"
        overlayClassName="custom-overlay"
      >
        <div ref={modalRef} className="">
          <EntryForm
            fetchInvoices={fetchInvoices}
            onRequestClose={closeModal}
            initialValues={selectedRows}
          />
        </div>
      </Modal>
      <Layout backgroundColor="black">
        <div className="px-4 py-2 w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Manage Invoices</h1>
            <div className="flex items-center gap-3">
              <VscBellDot className="text-2xl text-red-500 border border-gray-300 rounded-full p-1" />
              <div className="flex items-center gap-2">
                <Image
                  src="/profile-image.png"
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">Rohit Sharma</p>
                  <p className="text-xs text-gray-500">rohit.shara@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex border-y border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-2 py-2 text-sm ${activeTab === tab
                  ? "border-b-2 border-blue-500 font-medium"
                  : "text-gray-500 md:px-4"
                  } `}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center my-4">
            <div className="flex items-center gap-4">
              <div className="flex justify-center align-middle items-center text-center border border-gray-300 rounded px-2 py-2 bg-gray-50">
                <BiSearch className="text-gray-500" />
                <select
                  value={searchType}
                  onChange={handleDropdownChange}
                  className="outline-none bg-transparent text-sm"
                >
                  <option value="byVendor">By Vendor</option>
                  <option value="byInvoice">By Invoice</option>
                </select>
                <input
                  type="text"
                  placeholder={`Search ${searchType === "byVendor" ? "Vendor Name" : "Invoice Number"
                    } `}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="px-4 flex-grow outline-none bg-transparent text-sm font-medium"
                />
              </div>
            </div>
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded text-sm"
            >
              <FaUserPlus />
              Add
            </button>
          </div>

          <CustomTable
            columns={columns}
            data={filteredData}
            onSelectRow={handleSelect}
            onDeleteRow={handlerDeleteRow}
            isLoading={isLoading}
          />
        </div>
      </Layout>
    </>
  );
}
