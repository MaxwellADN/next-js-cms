import { FileArray } from "express-fileupload";

export class FileUtil {

    public static createUploadFiles(files: FileArray | null | undefined) {
        let uploads: any = [];
        if (files) {
            if (!Array.isArray(files.files)) {
                uploads.push(files.files);
            } else {
                uploads = files.files;
            }
        }
        return uploads;
    }
}