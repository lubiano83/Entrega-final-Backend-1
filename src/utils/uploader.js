import multer from "multer";
import PATH from "./path.js";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, PATH.join(PATH.images));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    },
});

const uploader = multer({ storage });
export default uploader;