import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import { successResponse, errorResponse } from '../utils/response.js';

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.UPLOAD_BUCKET;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { contentType = 'image/jpeg', filename } = body;
    
    // Basic validation
    if (!contentType.startsWith('image/')) {
        return errorResponse("Invalid content type. Only images are allowed.", 400);
    }

    const fileExtension = contentType.split('/')[1];
    const key = `receipts/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes

    return successResponse({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return errorResponse("Internal Server Error");
  }
};
