import {useEffect, useState} from 'react'

const apiUrl = "http://localhost:8000/trades"
const TradeTable = () => {
    const [loading, setLoading] = useState(true)
    const [trades, setTrades] = useState([])
    const [apiError, setApierror] = useState(null)
    const loadData = async () => {        
        try {
            setLoading(true)
            const request = await fetch(apiUrl)
            if (!request.ok) throw new Error(`HTTP ${request.status}`)
            const data = await request.json()
            setTrades(data)
        }
        catch(error) {
            setApierror(error.message)
            console.log(error)           
        }
        finally{
            setLoading(false)
        } 
    }
    useEffect(()=>{                
        loadData()        
    },[])
    if (loading) return <p>Loading...</p>
    if (apiError) return <p style={{color: "crimson"}}>Error: {apiError}</p>
    if (trades.length === 0) return <p>No trades found.</p>
    return(
        <>
        <div>
            <h2>Trades fetched: </h2>        
        </div>
        <div>                        
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Trader_ID</th>
                            <th>Symbol</th>
                            <th>Side</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                    {trades.map((val) => {
                        return (
                            <tr key={val.id}>
                                <td>{val.ts}</td>
                                <td>{val.trader_id}</td>
                                <td>{val.symbol}</td>
                                <td>{val.side}</td>
                                <td>{val.quantity}</td>
                                <td>{val.price}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>                        
        </div>
        </>
    )
}

export default TradeTable