import { apiVersion, dataset, projectId } from '../env'
import { client } from './client';

export const uploadImageToSanity = async (imageUrl: string): Promise<string | null> => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const asset = await client.assets.upload("image", blob);
        return asset._id;
    } catch (error) {
        console.error("Image upload failed:", error);
        return null;
    }
};