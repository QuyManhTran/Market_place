import cloudinary from '#config/cloudinary'
import { CloudinaryResponse } from '#types/cloudinary'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { MultipartStream } from '@adonisjs/core/types/bodyparser'
import { pipeline } from 'node:stream/promises'
@inject()
export default class CloudinaryService {
    constructor(protected ctx: HttpContext) {}
    uploadImage(part: MultipartStream, folder: string): Promise<CloudinaryResponse> {
        return new Promise(async (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_chunked_stream(
                {
                    resource_type: 'image',
                    folder: `Market_place/${folder}`,
                    chunk_size: 2,
                },
                (error, result) => {
                    if (result) return resolve(result)
                    reject(error)
                }
            )

            await pipeline(part, uploadStream).catch(() => {
                this.ctx.response.badRequest({
                    result: false,
                    message: 'Image upload failed',
                })
            })
        })
    }

    async deleteImage(publicId: string) {
        return new Promise<any>((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (result) return resolve(result)
                reject(error)
            })
        })
    }
}
