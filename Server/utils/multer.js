import multer from "multer"
const storage=multer.memoryStorage()
const fileFilter= (req,file,cb)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true)
    }else{
        cb(new Error("Only Image Files are allowed"),false)
    }



}
const upload=multer({storage,fileFilter,limits:{fileSize:10*1024*1024}})
export default upload