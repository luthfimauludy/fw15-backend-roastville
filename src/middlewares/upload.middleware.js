import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

// Configuration
cloudinary.config({
  cloud_name: "dxs0yxeyr",
  api_key: "236157336681252",
  api_secret: "V2uHsegpJtBpFlUl3WSwkxdCL0I",
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "YogiPrayoga",
    format: async (req, file) => "png", // supports promises as well
    public_id: (req, file) => {
      const filename = new Date().getTime().toString()
      return filename
    },
  },
})

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "upload/")
//     },
//     filename: (req, file, cb) => {
//         const explode = file.originalname.split(".").length
//         const ext = file.originalname.split(".")[explode - 1]
//         const filename = new Date().getTime().toString() + "." + ext
//         cb(null, filename)
//     }
// })

const limits = {
  fileSize: 1 * 1024 * 1024,
}

const fileFilter = (req, file, cb) => {
  const formatFile = ["image/jpg", "image/jpeg", "image/png"]
  if (!formatFile.includes(file.mimetype)) {
    console.log(file.mimetype)
    cb(Error("fileformat_error"))
  }
  cb(null, true)
}

const upload = multer({ storage, limits, fileFilter })

const uploadMiddleware = (field) => {
  const uploadField = upload.single(field)
  return (req, res, next) => {
    uploadField(req, res, (err) => {
      try {
        if (err) {
          if (err.message === "fileformat_error") {
            throw Error("fileformat_error")
          }
          throw Error(err.message)
        }
        return next()
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        })
      }
    })
  }
}

export default uploadMiddleware
