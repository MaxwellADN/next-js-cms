export interface FileInterface {
    /**
     * Id
     */
    id?: string | undefined;
    /**
     * Date creation
     */
    createdAt: Date | undefined;
    /**
     * Updated date
     */
    updateAt?: Date | undefined
    /**
     * File name
     */
    filename: string | undefined;
    /**
     * File extension
     */
    extension: string | undefined;
    /**
     * File storage url
     */
    url: string | undefined;
}