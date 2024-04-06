import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";
import { fileTypeFromBuffer } from "file-type";

export const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${
    process.env.R2_ACCOUNT_ID || ""
  }.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const uploadFileToR2 = async function (objectKey: string, url: string) {
  axios
    .get(url, {
      responseType: "arraybuffer",
    })
    .then((response) => {
      const buffer = Buffer.from(response.data, "base64");
      return (async () => {
        let fileResult = await fileTypeFromBuffer(buffer);
        let type: string | undefined = undefined;
        if (fileResult) type = fileResult.mime;
        const parallelUploads3 = new Upload({
          client: R2,
          params: {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: objectKey,
            Body: buffer,
            ContentType: type,
          },
        });
        await parallelUploads3.done();
      })();
    })
    .catch((err) => {
      return { type: "error", err: err };
    });
};
