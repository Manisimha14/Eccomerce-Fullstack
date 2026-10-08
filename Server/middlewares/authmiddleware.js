import jwt from "jsonwebtoken"
export const isLoggedin= async (req,res,next)=>{
  try {
    const token = req.cookies.jwttoken;
    if (!token) {
      return res.status(404).json({ message: "Please login first" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.customer_id = decoded.customer_id;
    return next();
    
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error"})
    
    
  }


}