import importData from '@/importData';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await importData(); 
    res.status(200).json({ message: 'Data import started successfully!' });
  } catch (error) {
    console.error('❌ Error importing data:', error);
    res.status(500).json({ message: 'Failed to import data', error });
  }
}
