
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export const searchJackett = async (apiUrl: string, apiKey: string, query: string) => {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        apikey: apiKey,
        q: query,
        t: 'search',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching Jackett: ${(error as any).message}`);
    throw new Error('Failed to fetch search results from Jackett.');
  }
};
