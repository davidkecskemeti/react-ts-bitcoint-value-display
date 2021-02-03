import React, { useEffect } from "react";
import { useState } from "react";
import { useQuery } from "react-query";

//styles
import "./App.scss";

type BitcoinData = {
  "15m": number;
  buy: number;
  last: number;
  sell: number;
  symbol: string;
};

type Currencies = {
  [key: string]: BitcoinData;
};

const getBCData = async (): Promise<Currencies> =>
  await (await fetch("https://www.blockchain.com/ticker")).json();

const INTERVAL_TIME = 10000; //30s

const App = () => {
  const [currency, setCurrency] = useState("USD");
  const { data, isLoading, error, refetch } = useQuery<Currencies>(
    "bc-data",
    getBCData
  );
  console.log(data);

  useEffect(() => {
    const interval = setInterval(refetch, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong...</div>;

  return (
    <div className="wrapper">
      <>
        <h2>Bitcoint price</h2>
        <select
          value={currency}
          onChange={(e: any) => setCurrency(e.currentTarget.value)}
        >
          {data &&
            Object.keys(data).map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
        </select>
        <div>
          <h2>
            {data && data[currency].symbol}
            {data && data[currency].last}
          </h2>
        </div>
      </>
    </div>
  );
};

export default App;
