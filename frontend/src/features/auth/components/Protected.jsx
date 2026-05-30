import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Protected = ({children}) => {
    const{loading,user} = useAuth()
    const navigate = useNavigate()

    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }

    if(!user){
        return <Navigate to={'/login'} />
    }

//if user is authenticated, render the wrapped component.
  return (children)
}

export default Protected