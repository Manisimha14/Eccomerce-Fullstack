import React, { Children, useContext } from 'react'
import customerContext from '../context/customercontext.js'
import { useNavigate } from 'react-router-dom'
import { Navigate } from "react-router-dom";

function Protectedroute({children}) {
    const {customer,loading}=useContext(customerContext)
    const navigate=useNavigate()
    if(loading){
        return <p>Loading ...</p>
    }
    if(!customer){
        return <Navigate to="/login" replace></Navigate>


    }
    return children
  
  
}

export default Protectedroute
