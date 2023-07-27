import { Files } from "aws-sdk/clients/iotsitewise";
import { FileInterface } from "../interfaces/file.interface";

export class ProductUtil {
    
    /**
     * It takes an array of files, and returns an array of objects with the same properties as the
     * files, but with the url property set to undefined.
     * @param {any} files - the files that are being uploaded
     * @returns An array of FileInterface objects.
     */
    public static createProductFilesData (files: any): FileInterface[] {
        const data: FileInterface[] = [];
        files?.forEach((file: any) => {
            data.push({
                createdAt: new Date(),
                extension: file.extension,
                filename: file.name,
                url: undefined,
            });
        });
        return data;
    }
}