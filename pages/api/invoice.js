import { mongooseConnect } from '@/lib/mongoose'; // MongoDB connection utility
import Invoice from '@/models/Invoice'; // MongoDB model

export default async function handler(req, res) {
  await mongooseConnect();

  const { status } = req.query;
  try {
    const query = status && status !== "All" ? { status } : {}
    // Use status filter if provided
    const peopleData = await Invoice.find(query); // Query MongoDB directly
    res.status(200).json(peopleData); // Return the filtered data
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
