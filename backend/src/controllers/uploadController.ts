import { Request, Response } from 'express';
import { uploadAsset } from '../utils/imageUpload';
import { successResponse, errorResponse } from '../utils/api-response';

// POST /api/admin/uploads
// Body: { file: string (base64 data URL), folder?: string, resourceType?: 'image'|'video'|'raw'|'auto' }
export async function uploadHandler(req: Request, res: Response) {
  try {
    const { file, folder, resourceType } = req.body as {
      file?: string;
      folder?: string;
      resourceType?: 'image' | 'video' | 'raw' | 'auto';
    };

    if (!file || typeof file !== 'string') {
      return res.status(400).json(errorResponse('Missing or invalid "file" in request body'));
    }

    const result = await uploadAsset(file, { folder, resourceType });
    return res.status(201).json(
      successResponse(
        {
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: (result as any).format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          folder: result.folder,
        },
        'Uploaded successfully'
      )
    );
  } catch (err: any) {
    return res.status(500).json(errorResponse(err?.message ?? 'Failed to upload'));
  }
}
