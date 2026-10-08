import jwt from "jsonwebtoken"
const genToken= (customer_id)=>{
    return jwt.sign({ customer_id }, process.env.JWT_SECRET,{expiresIn:"10d"});

}
export default genToken