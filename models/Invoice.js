import mongoose, { Schema } from 'mongoose';

// Check if the model is already compiled to avoid recompiling
const InvoiceSchema = new Schema({
  vendorName: { type: String, required: true },
  invoice: { type: String, required: true },
  status: { type: String, required: true },
  netAmount: { type: Number, required: true },
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  department: { type: String },
  costCenter: { type: String },
}, { timestamps: true });

// If the model is already compiled, use the existing one; otherwise, compile a new one
export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
