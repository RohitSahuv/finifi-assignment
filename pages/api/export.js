import { parse } from 'json2csv';
import { mongooseConnect } from '@/lib/mongoose';
import People from '@/models/Invoice';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await mongooseConnect();

        try {
            // Fetch data from MongoDB
            const peopleData = await People.find({});

            // Convert MongoDB documents to plain JavaScript objects
            const data = peopleData.map(person => ({
                name: person.name,
                status: person.status,
                property: person.property,
                unit: person.unit,
                role: person.role,
                lastInvited: person.lastInvited, // Format date if necessary
            }));

            // Convert JSON to CSV
            const fields = ['name', 'status', 'property', 'unit', 'role', 'lastInvited'];
            const csv = parse(data, { fields });

            // Set the response headers
            res.setHeader('Content-Disposition', 'attachment; filename=people_data.csv');
            res.setHeader('Content-Type', 'text/csv');
            res.status(200).send(csv);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ message: 'Error fetching data' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
