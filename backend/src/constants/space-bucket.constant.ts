import AWS from 'aws-sdk'

export const space = new AWS.S3({
    endpoint: "fra1.digitaloceanspaces.com",
    useAccelerateEndpoint: false,
    credentials: new AWS.Credentials("DO0048B8DBDGWF3ZXNCZ", "oFYAuLsFxp4wMI7YEjiUEZebLM35l80XiD5R7/fNiok", undefined)
});
export const BUCKET_NAME = 'light-speed-checkout';