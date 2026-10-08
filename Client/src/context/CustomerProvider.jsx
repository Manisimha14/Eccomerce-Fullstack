import { useCallback, useEffect, useState } from 'react'
import customerContext from './customercontext.js'
import { authinstance } from '../lib/axiosinstance'

function CustomerProvider({children}) {
    const [customer,setCustomer]=useState(null)
    const [loading,setLoading]=useState(true)
    const fetchCustomer = useCallback(async () => {
        const response = await authinstance.get("/me")
        return response.data.Customer
    }, [])

    const refreshCustomer = useCallback(async () => {
        setLoading(true)
        try {
            const nextCustomer = await fetchCustomer()
            setCustomer(nextCustomer)
            return nextCustomer
        } catch (error) {
            setCustomer(null)
            console.error(error.response?.data?.message || "Failed to load customer")
            return null
        } finally {
            setLoading(false)
        }
    }, [fetchCustomer])

    useEffect(()=>{
        let isCurrent = true
        fetchCustomer().then((nextCustomer) => {
            if (isCurrent) setCustomer(nextCustomer)
        }).catch((error) => {
            if (isCurrent) {
                setCustomer(null)
                console.error(error.response?.data?.message || "Failed to load customer")
            }
        }).finally(() => {
            if (isCurrent) setLoading(false)
        })
        return () => {
            isCurrent = false
        }
    },[fetchCustomer])

  return (
    <>
    <customerContext.Provider value={{customer,setCustomer,loading,refreshCustomer}}>
        {children}
    </customerContext.Provider>
    
    </>
  )
}

export default CustomerProvider