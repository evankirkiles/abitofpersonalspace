/*
 * s3client.ts
 * author: evan kirkiles
 * created on Mon Oct 10 2022
 * 2022 the nobot space,
 */
import {
  S3Client,
  PutObjectCommand,
  ListObjectVersionsCommand,
} from '@aws-sdk/client-s3';
import * as APIt from '../supabase/types';
import { createHash } from 'crypto';
import getMD5Hash from './getMD5Hash';

// s3 client for file uploads
const s3client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY!,
  },
});

/**
 * Uploads a file to the S3 bucket
 * @param key
 * @param file
 */
export const uploadFile = async (
  key: string,
  file: File
): Promise<APIt.S3Object> => {
  // get the MD5 hash from the file for object lock
  const md5 = Buffer.from(await getMD5Hash(file), 'hex').toString('base64');
  // create the putobject command to put the file in the bucket
  await s3client.send(
    new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
      Key: key,
      Body: file,
      ContentLength: file.size,
      ContentType: file.type,
      ContentMD5: md5,
    })
  );
  // now get the object version to save in the database
  const version = (
    await s3client.send(
      new ListObjectVersionsCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
        Prefix: key,
      })
    )
  ).Versions![0].VersionId!;
  return {
    bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
    version: version,
    key: key,
  };
};
