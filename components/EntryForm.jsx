import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
    vendorName: Yup.string().required("Vendor Name is required"),
    invoice: Yup.string().required("Invoice is required"),
    netAmount: Yup.number()
        .required("Net Amount is required")
        .positive("Net Amount must be positive"),
    invoiceDate: Yup.date().required("Invoice Date is required"),
    dueDate: Yup.date().required("Due Date is required"),
    department: Yup.string(),
    costCenter: Yup.string(),
    status: Yup.string().required("Status is required"),
});

const EntryForm = ({ fetchInvoices, onRequestClose, initialValues }) => {
    const handleFormSubmit = async (formData, isEditMode) => {
        if (isEditMode) {
            await updateData(formData);
        } else {
            await createNewData(formData);
        }
    };

    const updateData = async (formData) => {
        try {
            const response = await fetch(`https://finifi-backend-27au.onrender.com/api/invoices/${formData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            }

            fetchInvoices();
            onRequestClose();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const createNewData = async (values) => {
        try {
            const response = await fetch("https://finifi-backend-27au.onrender.com/api/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            }

            const data = await response.json();
            fetchInvoices();
            onRequestClose();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="w-full h-full relative">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    try {
                        await handleFormSubmit(values, Boolean(initialValues._id));
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting, handleChange, values }) => (
                    <Form className=" h-full fixed right-0 w-[400px] p-5 bg-white rounded-lg shadow-lg flex flex-col gap-3 scroll-my-2 overflow-y-scroll scroll-smooth">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {initialValues._id ? "Edit" : "Create"}
                        </h2>
                        {[
                            { label: "Vendor Name", name: "vendorName", type: "text" },
                            { label: "Invoice", name: "invoice", type: "text" },
                            { label: "Net Amount", name: "netAmount", type: "number" },
                            { label: "Invoice Date", name: "invoiceDate", type: "date" },
                            { label: "Due Date", name: "dueDate", type: "date" },
                            { label: "Department", name: "department", type: "text" },
                            { label: "Cost Center", name: "costCenter", type: "text" },
                        ].map(({ label, name, type }) => (
                            <div key={name} className="flex flex-col">
                                <label
                                    htmlFor={name}
                                    className="text-sm font-medium text-gray-700"
                                >
                                    {label}
                                </label>
                                <Field
                                    id={name}
                                    name={name}
                                    type={type}
                                    className="p-2 text-sm border rounded-md focus:ring-2 focus:ring-gray-400"
                                    onChange={handleChange}
                                    value={values[name]}
                                />
                                <div className="text-xs text-red-500">
                                    <Field name={name} component="div" />
                                </div>
                            </div>
                        ))}

                        <div className="flex flex-col">
                            <label
                                htmlFor="status"
                                className="text-sm font-medium text-gray-700 mb-1"
                            >
                                Status
                            </label>
                            <Field
                                as="select"
                                name="status"
                                className="p-2 text-sm border rounded-md focus:ring-2 focus:ring-gray-400"
                                onChange={handleChange}
                                value={values.status}
                            >
                                <option value="">Select Status</option>
                                {[
                                    "Open",
                                    "Awaiting Approval",
                                    "Approved",
                                    "Processing",
                                    "Paid",
                                    "Rejected",
                                    "Vendor Not Found",
                                    "Duplicate",
                                    "Void",
                                ].map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Field>
                            <div className="text-xs text-red-500">
                                <Field name="status" component="div" />
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-100"
                                onClick={onRequestClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isSubmitting ? "bg-gray-400" : "bg-black hover:bg-gray-800"
                                    }`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EntryForm;
