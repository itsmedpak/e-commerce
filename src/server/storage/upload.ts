import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2, R2_BUCKET } from "./r2"

type UploadFileInput = {
    key: string
    body: Buffer | Uint8Array | string
    contentType: string
    cacheControl?: string
}

export const uploadFile = async ({key, body, contentType, cacheControl}: UploadFileInput) => {
    await r2.send(
        new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: body,
            ContentType: contentType,
            ...(cacheControl && { CacheControl: cacheControl })
        })
    )
    return { key }
}