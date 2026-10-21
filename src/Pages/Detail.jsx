import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"

export default function Detail(){
    const {id} = useParams()
    const[product, setProduct] = useState(null)
    const[loading, setLoading] = useState(true)
    const[error, setError] = useState(null)

    useEffect(() => {
        const fetchProduct = async() => {
            try{
                const response = await fetch(`https://6a48af3aa033dcb98d64ca87.mockapi.io/an1904/orchid/Orchids/${id}`)
                if(!response.ok) throw new Error("Failed to fetch product")
                    const data =  await response.json()
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