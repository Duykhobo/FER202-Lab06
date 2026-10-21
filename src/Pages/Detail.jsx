import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import { getOrchidById } from "../services/orchidService"

export default function Detail(){
    const {id} = useParams()
    const[product, setProduct] = useState(null)
    const[loading, setLoading] = useState(true)
    const[error, setError] = useState(null)

    useEffect(() => {
        const fetchProduct = async() => {
            try{
                const data = await getOrchidById(id)
                setProduct(data)
            }catch(err){
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])
    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>
    return(
        <div>
            <h1>{product?.name}</h1>
            <img src ={product?.image} alt = {product?.name}/>
            <p>${product?.price?.toFixed(2)}</p>
            <p>{product?.description}</p>
        </div>
    )
}