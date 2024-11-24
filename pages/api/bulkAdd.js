import formidable from 'formidable';
import fs from 'fs';
import csvParser from 'csv-parser';
import { mongooseConnect } from '@/lib/mongoose';
import People from '@/models/Invoice';

export const config = {
    api: {
        bodyParser: false,  // Disable Next.js built-in body parser
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await mongooseConnect();  // Ensure MongoDB connection is established

        // Initialize formidable
        const form = formidable({ multiples: true });

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).json({ message: 'Error parsing the file' });
                return;
            }

            const file = Array.isArray(files.file) ? files.file[0] : files.file;
            const filePath = file?.filepath;
            if (!filePath) {
                res.status(400).json({ message: 'File path is missing' });
                return;
            }

            // Read and parse CSV
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    results.push({
                        name: row.name,
                        status: row.status,
                        property: row.property,
                        unit: row.unit,
                        role: row.role,
                        lastInvited: Date.now(),
                    });
                })
                .on('end', async () => {
                    try {
                        await People.insertMany(results);

                        res.status(200).json({ message: 'Bulk add completed successfully' });
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ message: 'Error storing data in database' });
                    }
                })
                .on('error', (err) => {
                    res.status(500).json({ message: 'Error reading or parsing CSV' });
                });
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
