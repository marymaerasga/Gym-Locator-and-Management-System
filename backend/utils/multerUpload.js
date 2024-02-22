import multer from "multer";
import path from "path";

export const multerUpload = (pathFolder) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destinationPath = `backend/uploads/${req.user._id}/${pathFolder}`;
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({
    storage: storage,
  });

  return upload;
};
