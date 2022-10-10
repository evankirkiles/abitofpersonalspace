/*
 * getMD5Hash.ts
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import { createMD5 } from 'hash-wasm';
import { IHasher } from 'hash-wasm/dist/lib/WASMInterface';

const chunkSize = 64 * 1024 * 1024;
let fileReader: FileReader | null = null;
let enc: TextEncoder | null = null;
let hasher: IHasher | null = null;

function hashChunk(chunk: Blob) {
  return new Promise<void>((resolve) => {
    fileReader!.onload = async (e) => {
      let view: Uint8Array;
      if (typeof e.target!.result === 'string') {
        view = enc!.encode(e.target!.result);
      } else {
        view = new Uint8Array(e.target!.result!);
      }
      hasher!.update(view);
      resolve();
    };
    fileReader!.readAsArrayBuffer(chunk);
  });
}

/**
 * Returns the MD5 hash of a file in hex
 * @param file
 * @returns
 */
export default async function getMD5Hash(file: File): Promise<string> {
  // set up our hashers / encoders
  if (hasher) {
    hasher.init();
  } else {
    hasher = await createMD5();
  }
  if (!enc) enc = new TextEncoder();
  if (!fileReader) fileReader = new FileReader();

  // use hashers to hash each chunk together with WASM
  const chunkNumber = Math.floor(file.size / chunkSize);
  for (let i = 0; i <= chunkNumber; i++) {
    const chunk = file.slice(
      chunkSize * i,
      Math.min(chunkSize * (i + 1), file.size)
    );
    await hashChunk(chunk);
  }
  const hash = hasher.digest();
  return Promise.resolve(hash);
}
