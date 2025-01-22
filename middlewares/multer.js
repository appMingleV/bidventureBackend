import multer from 'multer';

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        const filename=
        cb(null, file.fieldname + '-' +  Date.now())
    }
})

const upload=multer({storage});
export default upload;