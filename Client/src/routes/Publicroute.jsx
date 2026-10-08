import React, { Children, useContext } from 'react'
import customerContext from '../context/customercontext.js'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Publicroute({children}) {
    const {customer,loading}=useContext(customerContext)
    const navigate=useNavigate()
    if(loading){
        return <p>Loading ...</p>
    }
    if(customer){
        return (
          <> 
          {toast.success("You are already Logged in")}
          
            <Navigate to="/" replace></Navigate>
          </>
        );
    }
    return children
  
  
}

export default Publicroute