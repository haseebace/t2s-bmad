import WebTorrent from 'webtorrent';
import { uploadStreamToBunny, generateSecureStreamingUrl } from '../../lib/bunnyCdnService.js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { updateContent } from '../../lib/contentService.js';
import { Readable } from 'stream';

export const processTorrent = async (
  db: PostgresJsDatabase,
  contentId: number,
  magnetLink: string,
  storageZoneName: string,
  apiKey: string,
  streamHostname: string,
  tokenSecurityKey: string
): Promise<void> => {
  await updateContent(db, contentId, { status: 'PROCESSING' });

  try {
    const client = new WebTorrent();

    const fileDetails = await new Promise<{ name: string; length: number; infoHash: string }>((resolve, reject) => {
      client.on('error', (err: any) => {
        if (err.code === 'UTP_ECONNRESET') {
          console.log('Ignoring non-critical UTP_ECONNRESET error during shutdown.');
          return;
        }
        client.destroy(() => reject(err));
      });

      client.add(magnetLink, (torrent) => {
        console.log('Torrent metadata loaded for:', torrent.name);

        const file = torrent.files.reduce((a, b) => (a.length > b.length ? a : b));
        console.log('Largest file selected:', file.name);

        const stream = file.createReadStream() as Readable;

        uploadStreamToBunny(storageZoneName, apiKey, file.name, stream)
          .then(() => {
            console.log('Upload complete.');
            const details = { name: file.name, length: file.length, infoHash: torrent.infoHash };
            client.destroy(() => resolve(details));
          })
          .catch((err) => {
            client.destroy(() => reject(err));
          });
      });
    });

    const streamingUrl = generateSecureStreamingUrl(
      streamHostname,
      tokenSecurityKey,
      fileDetails.name
    );

    await updateContent(db, contentId, {
      status: 'AVAILABLE',
      fileName: fileDetails.name,
      fileSizeBytes: fileDetails.length,
      torrentInfoHash: fileDetails.infoHash,
      streamingUrl: streamingUrl,
    });

  } catch (error) {
    console.error('Error processing torrent:', error);
    await updateContent(db, contentId, { status: 'FAILED', errorMessage: (error as any).message });
    throw error; // Re-throw the error to be handled by the job consumer
  }
};