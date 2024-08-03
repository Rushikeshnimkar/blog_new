import axios from 'axios';

export async function fetchMetadataFromIPFS(ipfsUrl: string, id: string): Promise<any> {
  try {
    const response = await axios.get(ipfsUrl);
    const data = {
      ...response.data, 
      ipfsUrl: ipfsUrl,
      id: id,      
    }
    return data;
  } catch (error) {
    return null;
  }
}