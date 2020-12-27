import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, calback) => {
      const fileHash = crypto.randomBytes(10).toString('Hex');
      const fileName = `${fileHash}-${file.originalname}`;
      return calback(null, fileName);
    },
  }),
};
