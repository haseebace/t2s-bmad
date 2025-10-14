
import axios from 'axios';
import { Readable } from 'stream';
import * as crypto from 'crypto';

export const uploadStreamToBunny = async (
  storageZoneName: string,
  apiKey: string,
  fileName: string,
  stream: Readable
) => {
  const url = `https://storage.bunnycdn.com/${storageZoneName}/${fileName}`;

  let uploadedBytes = 0;
  let lastLoggedProgress = -1; // Initialize to -1 to ensure the first log happens

  stream.on('data', (chunk) => {
    uploadedBytes += chunk.length;
    const progress = Math.floor(uploadedBytes / (1024 * 1024)); // Progress in MB

    if (progress > lastLoggedProgress) {
      console.log(`Uploaded ${progress} MB...`);
      lastLoggedProgress = progress;
    }
  });

  try {
    await axios.put(url, stream, {
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/octet-stream',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    console.log(`Successfully uploaded ${fileName} to Bunny CDN.`);
  } catch (error) {
    console.error(`Error uploading to Bunny CDN: ${(error as any).message}`);
    throw error;
  }
};

export const generateSecureStreamingUrl = (
  streamHostname: string,
  securityKey: string,
  filePath: string,
  expirationMinutes: number = 60
): string => {
  const expirationTimestamp = Math.floor(Date.now() / 1000) + expirationMinutes * 60;
  const path = `/${filePath}`;

  const hashable = securityKey + path + expirationTimestamp;
  const token = crypto.createHash('sha256').update(hashable).digest('base64');
  const urlSafeToken = token.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return `https://${streamHostname}${path}?token=${urlSafeToken}&expires=${expirationTimestamp}`;
};
