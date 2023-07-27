import { ManagedUpload } from "aws-sdk/clients/s3";
import { BUCKET_NAME, space } from "../constants/space-bucket.constant";
import { FileInterface } from "../interfaces/file.interface";

export class UploadService {

    /**
     * It takes an array of files, uploads them to DigitalOcean Spaces, and returns an array of
     * FileInterface objects.
     * @param {any} files - any - this is the files that are being uploaded.
     * @returns The result array is being returned.
     */
    public async uploadFiles(files: any): Promise<FileInterface[]> {
        try {
            const result: FileInterface[] = await Promise.all(
                files.map( async(file: any) => {
                    const filename = `${new Date().toISOString()}-${file.name}`;
                    let uploadParams = {
                        Bucket: BUCKET_NAME,
                        ContentType: 'multipart/form-data',
                        Body: file.data,
                        Key: filename
                    };
                    const data = await space.upload(uploadParams).promise();
                    return {
                        createdAt: new Date(),
                        extension: file.extension,
                        filename: file.name,
                        url: data.Location
                    }
                })
            );
            return result;
        } catch (ex) {
            throw ex;
        }
    }
}