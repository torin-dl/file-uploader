import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const isAllowed =
            file.mimetype.startsWith("text/") ||
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/") ||
            file.mimetype.startsWith("application/");
        if (isAllowed) {
            cb(null, true);
        } else {
            cb(new Error("File type not allowed"));
        }
    },
    limits: { fileSize: 1024 * 1024 * 10 },
});

export default { upload };
