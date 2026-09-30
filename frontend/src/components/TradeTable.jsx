import {useEffect, useState} from 'react'

const apiUrl = "http://localhost:8000/trades"
const TradeTable = () => {
    const [loading, setLoading] = useState(true)
    const [trades, setTrades] = useState([])
    const [apiError, setApiError] = useState(null)
    const [symbol, setSymbol] = useState("")
    const [trader, setTrader] = useState("")
    const [applied, setApplied] = useState({ symbol: "", trader: "" })
    const loadData = async (filters) => {        
        try {
            setLoading(true)
            setApiError(null)
            const params = new URLSearchParams()
            if (filters.symbol) params.append("symbol", filters.symbol)
            if (filters.trader) params.append("trader", filters.trader)
            const qs = params.toString()
            const request = await fetch(qs ? `${apiUrl}?${qs}` : apiUrl)
            if (!request.ok) throw new Error(`HTTP ${request.status}`)
            const data = await request.json()
            setTrades(data)
        }
        catch(error) {
            setApiError(error.message)
            console.log(error)           
        }
        finally{
            setLoading(false)
        } 
    }
    useEffect(()=>{                
        loadData(applied)        
    },[applied])
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        setApplied({ symbol, trader })
    }
    const handleReset = (e) => {
        e.preventDefault()
        setSymbol("")
        setTrader("")
        setApplied({ symbol: "", trader: "" })
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
        Apply Filters <br></br>
        <label>
            Select Symbol
            <select name="selectedSymbol" value={symbol} onChange={e=>setSymbol(e.target.value)}>
            <option value="">ALL</option>
            <option value="NIFTY">NIFTY</option>
            <option value="BANKNIFTY">BANKNIFTY</option>
            <option value="FINNIFTY">FINNIFTY</option>
            </select>
        </label>
        <label>
            Select Trader
            <select
            name="selectedTrader"            
            value={trader} onChange={e=>setTrader(e.target.value)}
            >
            <option value="">ALL</option>
            <option value="T1">T1</option>
            <option value="T2">T2</option>
            <option value="T3">T3</option>
            </select>
        </label>
        <hr />
        <button type="button" onClick={handleReset}>Reset</button>
        <button type="submit">Submit</button>
        </form>
        Your selected symbol is {symbol} for trader {trader}
        {loading && <p>Loading...</p>}
        {apiError && <p style={{ color: "crimson" }}>Error: {apiError}</p>}
        {!loading && !apiError && trades.length === 0 && <p>No trades found.</p>}
        {!loading && !apiError && trades.length > 0 && (
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
        )}
        </>
    )
}

export default TradeTable