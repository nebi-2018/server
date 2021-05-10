import { createWriteStream } from "fs";
import shortid from "shortid";
import { URL } from "../config/index.js";

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  let path = `uploads/${id}-${filename}`;
  await stream.pipe(createWriteStream(path));
  path = `${URL}/server/${path}`;
  return { filename, id, mimetype, path };
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  console.log(filename, mimetype);
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};

export default {
  Query: {
    info: () => "Hello I am image resolver method",
  },
  Mutation: {
    imageUploader: async (_, { file }) => {
      console.log(file);
      const upload = await processUpload(file);
      return upload;
    },
  },
};
