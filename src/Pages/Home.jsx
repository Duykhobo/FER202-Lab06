import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function Home() {

    const [orchids, setOrchids] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchOrchids = async () => {
            try {
                const response = await fetch("https://6a48af3aa033dcb98d64ca87.mockapi.io/an1904/orchid/Orchids")
                if (!response.ok) throw new Error("Failed to fetch")
                const data = await response.json()
                setOrchids(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchOrchids()
    }, [])

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>

    return (
        <div>
            <h1>Orchids Collection</h1>
            <p>Welcome to Orchids Management</p>
            <div>
                
                {orchids.map((orchid) => (
                    <Link to ={`/detail/${orchid.id}`} key={orchid.id}>
                    <div>
                        <img src={orchid.image} alt={orchid.name} />
                        <h3>{orchid.name}</h3>
                        <p>${orchid.price}</p>
                    </div>  
                    </Link>
                ))}
                
            </div>
        </div>
    )
}
