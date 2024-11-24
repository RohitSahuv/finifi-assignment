import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

// Validation schema using Yup
const validationSchema = Yup.object({
    vendorName: Yup.string().required('Vendor Name is required'),
    invoice: Yup.string().required('Invoice is required'),
    netAmount: Yup.number().required('Net Amount is required').positive('Net Amount must be positive'),
    invoiceDate: Yup.date().required('Invoice Date is required'),
    dueDate: Yup.date().required('Due Date is required'),
    department: Yup.string(),
    costCenter: Yup.string(),
    status: Yup.string().required('Status is required'),
});

const EntryForm = ({ fetchInvoices, onRequestClose, initialValues }) => {

    const handleFormSubmit = (formData, isEditMode) => {
        if (isEditMode) {
            updateData(formData);

        } else {
            createNewData(formData);
        }
    };


    const updateData = async (formData) => {
        console.log('formData', formData)
        try {
            const response = await fetch('/api/submitForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            fetchInvoices()
            onRequestClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }



    const createNewData = async (values) => {
        try {
            const response = await fetch('/api/submitForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            const data = await response.json();
            fetchInvoices()
            onRequestClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Box>
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
                    <StyledForm>
                        <HeaderText>
                            {initialValues._id ? 'Edit' : 'Create'}
                        </HeaderText>
                        <FormField>
                            <label htmlFor="vendorName">Vendor Name</label>
                            <StyledField
                                name="vendorName"
                                type="text"
                                as={Field}
                                onChange={handleChange}
                                value={values.vendorName}
                            />
                            <ErrorMessage name="vendorName" component="ErrorText" />
                        </FormField>

                        <FormField>
                            <label htmlFor="invoice">Invoice</label>
                            <StyledField
                                name="invoice"
                                type="text"
                                as={Field}
                                onChange={handleChange}
                                value={values.invoice}
                            />
                            <ErrorMessage name="invoice" component="ErrorText" />
                        </FormField>

                        <FormField>
                            <label htmlFor="netAmount">Net Amount</label>
                            <StyledField
                                name="netAmount"
                                type="number"
                                as={Field}
                                onChange={handleChange}
                                value={values.netAmount}
                            />
                            <ErrorMessage name="netAmount" component="ErrorText" />
                        </FormField>

                        <FormField>
                            <label htmlFor="invoiceDate">Invoice Date</label>
                            <StyledField
                                name="invoiceDate"
                                type="date"
                                as={Field}
                                onChange={handleChange}
                                value={values.invoiceDate}
                            />
                            <ErrorMessage name="invoiceDate" component="ErrorText" />
                        </FormField>

                        <FormField>
                            <label htmlFor="dueDate">Due Date</label>
                            <StyledField
                                name="dueDate"
                                type="date"
                                as={Field}
                                onChange={handleChange}
                                value={values.dueDate}
                            />
                            <ErrorMessage name="dueDate" component="ErrorText" />
                        </FormField>

                        <FormField>
                            <label htmlFor="department">Department</label>
                            <StyledField
                                name="department"
                                type="text"
                                as={Field}
                                onChange={handleChange}
                                value={values.department}
                            />
                            <ErrorMessage name="department" component="ErrorText" />
                        </FormField>

                        <FormField>
                            <label htmlFor="costCenter">Cost Center</label>
                            <StyledField
                                name="costCenter"
                                type="text"
                                as={Field}
                                onChange={handleChange}
                                value={values.costCenter}
                            />
                            <ErrorMessage name="costCenter" component="ErrorText" />
                        </FormField>

                        <FormField>
                            <label htmlFor="status">Status</label>
                            <Field
                                as="select"
                                name="status"
                                onChange={handleChange}
                                value={values.status}
                            >
                                <option value="">Select Status</option>
                                {[
                                    'Open',
                                    'Awaiting Approval',
                                    'Approved',
                                    'Processing',
                                    'Paid',
                                    'Rejected',
                                    'Vendor Not Found',
                                    'Duplicate',
                                    'Void',
                                ].map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="status" component="ErrorText" />
                        </FormField>

                        <ButtonContainer>
                            <CancelButton type="button" onClick={onRequestClose}>
                                Cancel
                            </CancelButton>
                            <StyledButton type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </StyledButton>
                        </ButtonContainer>
                    </StyledForm>
                )}
            </Formik>
        </Box>
    );
};

const Box = styled.div`
width: 100%;
height: 100%;
position: relative;
`

// Styled Components for form and elements
const StyledForm = styled(Form)`
  width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  height:100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 8px;
  position: fixed;
  right: 0%;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    line-height: 15.6px;
   text-align: left;
  }
`;

const StyledField = styled(Field)`
  padding: 2px;
  font-size: 13px;
  height: 2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #333;
  }
`;

const ButtonContainer = styled.div`
  width : 100%;
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
`;

export const StyledButton = styled.button`
gap: 15px;
border-radius: 3px 0px 0px 0px;
padding: 7px 14px 7px 14px;
  width: fit-content;
  background-color: black;
  color: white;
  gap : 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }

  &:disabled {
    background-color: #ccc;
  }
`;

export const CancelButton = styled(StyledButton)`
  width  : fit-content;
  background-color: transparent;
  color: #333;
  border: 1px solid #333;
  border: none;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
`;

const HeaderText = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  text-align: left;
`;



export default EntryForm;
