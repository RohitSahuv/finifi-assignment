import { mongooseConnect } from '@/lib/mongoose';
import Invoice from '@/models/Invoice';

export default async function handler(req, res) {
    await mongooseConnect();

    if (req.method === 'POST') {
        const { _id, vendorName, invoice, netAmount, invoiceDate, dueDate, department, costCenter, status } = req.body;

        // Check for required fields
        if (!vendorName || !invoice || !netAmount || !invoiceDate || !dueDate || !department || !costCenter || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (_id) {
            // Update existing record
            try {
                const updatedInvoice = await Invoice.findByIdAndUpdate(
                    _id,
                    {
                        vendorName,
                        invoice,
                        netAmount,
                        invoiceDate,
                        dueDate,
                        department,
                        costCenter,
                        status,
                    },
                    { new: true } // Return the updated document
                );

                return res.status(200).json({ message: 'Invoice updated successfully', updatedInvoice });
            } catch (error) {
                console.error('Error updating invoice:', error);
                return res.status(500).json({ message: 'Error updating invoice' });
            }
        } else {
            // Create new record
            try {
                const newInvoice = new Invoice({
                    vendorName,
                    invoice,
                    netAmount,
                    invoiceDate,
                    dueDate,
                    department,
                    costCenter,
                    status,
                });

                await newInvoice.save();

                return res.status(201).json({ message: 'Invoice added successfully', newInvoice });
            } catch (error) {
                console.error('Error saving invoice:', error);
                return res.status(500).json({ message: 'Error saving invoice' });
            }
        }
    } else {
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
}
