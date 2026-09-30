import {useEffect, useState} from 'react'

const apiUrl = "http://localhost:8000/trades"
const SIZE = 20
const TradeTable = () => {
    const [loading, setLoading] = useState(true)
    const [trades, setTrades] = useState([])
    const [apiError, setApiError] = useState(null)
    const [symbol, setSymbol] = useState("")
    const [trader, setTrader] = useState("")
    const [total, setTotal] = useState(0)    
    const [applied, setApplied] = useState({ symbol: "", trader: "", page:1})
    const loadData = async (filters) => {        
        try {
            setLoading(true)
            setApiError(null)
            const params = new URLSearchParams()
            if (filters.symbol) params.append("symbol", filters.symbol)
            if (filters.trader) params.append("trader", filters.trader)
            if (filters.page) params.append("page", filters.page)
            params.append("size", SIZE)
            const qs = params.toString()
            const request = await fetch(qs ? `${apiUrl}?${qs}` : apiUrl)
            if (!request.ok) throw new Error(`HTTP ${request.status}`)
            const data = await request.json()
            setTrades(data.items)
            setTotal(data.total)
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
        setApplied({ symbol, trader, page:1 })
    }
    const handleReset = (e) => {
        e.preventDefault()
        setSymbol("")
        setTrader("")
        setApplied({ symbol: "", trader: "", page:1 })
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
        Apply Filters <br></br>
        <label>
            Select Symbol
            <select value={symbol} onChange={e=>setSymbol(e.target.value)}>
            <option value="">ALL</option>
            <option value="NIFTY">NIFTY</option>
            <option value="BANKNIFTY">BANKNIFTY</option>
            <option value="FINNIFTY">FINNIFTY</option>
            </select>
        </label>
        <label>
            Select Trader
            <select value={trader} onChange={e=>setTrader(e.target.value)}>
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
        {!loading && !apiError && trades.length > 0 && (
        <div>
            <button disabled={applied.page === 1} onClick={()=>setApplied((prev) => ({...prev, page: prev.page - 1}))}>Prev</button>
            <span>Page {applied.page} of {Math.ceil(total / SIZE)} ({total} rows)</span>
            <button disabled={applied.page*SIZE >= total} onClick={()=>setApplied((prev) => ({...prev, page: prev.page + 1}))}>Next</button>
        </div>
        )}
        </>
    )
}

export default TradeTable