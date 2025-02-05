import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'
import dotenv from 'dotenv';

dotenv.config()

export const client = createClient({
  projectId:projectId,
  dataset:dataset,
  apiVersion:apiVersion,
  token: process.env.SANITY_TOKEN,
  useCdn: !process.env.SANITY_TOKEN  , 
})