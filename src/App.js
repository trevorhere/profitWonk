import React, { useState, useEffect} from 'react';
import { LineChart, Legend, Tooltip,  XAxis,YAxis, CartesianGrid, Line, Scatter, ResponsiveContainer, ComposedChart, Dot, ReferenceLine } from 'recharts'
import './App.css';
import ReactSlider from 'react-slider'
import styled from 'styled-components'

const users =  [24, 23, 22, 19, 18, 17, 15, 14, 13, 12, 11, 7, 6, 4, 3, 2, 1]
const prices = [0, 9, 10, 12, 16, 20, 21, 22, 23, 24, 25, 27, 29, 32, 33, 37, 43]

const key = `AIzaSyC-Ak1rmaV7wKFN7km7gY1CEDmAnVL76FE`
const link = `1dFPLMw8AeOAwTnr0FbEMuuSkK2j7-qsFyncfc8XG3Wg`;
const API = `https://sheets.googleapis.com/v4/spreadsheets/${link}/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${key}`;


const splitData = (arr) => {

  const x = [];
  const y = [];

  console.log('arr: ', arr);

  arr.forEach((element, index, array) => {
    console.log('ex: ', element.x);
    console.log('ey: ', element.y);

    x.push(element.x);
    y.push(element.y)
});
return {x,y}
}


const useFetch = (isLoadingCallback) => {

  const [response, setResponse] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      isLoadingCallback(true);

      try {
          const res = await fetch(API);
          const data = await res.json();

          setResponse(data);
          let batchRowValues = data.valueRanges[0].values;
          const rows = [];
          for (let i = 1; i < batchRowValues.length; i++) {
          let rowObject = {};
          for (let j = 0; j < batchRowValues[i].length; j++) {
              rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          rows.push(rowObject);
          }

          console.log('rows: ', rows);
          isLoadingCallback(false);
      } catch (error) {
        setError(error);
      } 
    };
    fetchData();
  }, []);

  return { data, response, error};
};


// Users is Y axis
// Prices is X axis


const getPrice = (cost) => {

  if(users.length !== prices.length){
    console.log('user array len doesnt match price array len');
    return null;
  }

  const N = users.length;


  let sumX = prices.reduce((a,b) => { return a + b })
  let sumY = users.reduce((a,b) => { return a + b })

  console.log('sumX: ', sumX);
  console.log('sumY: ', sumY);


  let sumXY = 0;
  let sumXSquared = 0;

  for(let i = 0; i < N; i++){
    sumXY += (users[i] * prices[i]);
    sumXSquared += (prices[i] * prices[i])
  };

  console.log('sumXY: ', sumXY);
  let numerator = sumXY - ((sumX * sumY) / N)
  let denomenator = sumXSquared - ((sumX * sumX)/N)

  let slope = numerator/ denomenator

  let b1 = (sumY - (slope * sumX))/N

  console.log('slope: ', slope)
  console.log('b1: ', b1);

  let data = [];




  for(let i = 0; i < prices[N - 1]; i+=5){
    data.push({x:i, y: ( b1 + (slope * i))})
  }

  let maxProfit = 0; 
  let bestPrice = 0;

  for(let i = 0; i < prices[N - 1]; i += 0.01){
    let q = b1 + (slope * i)
    let rev = i * (q) 
    let profit = (rev - (cost * q))
    if(profit > maxProfit){
      maxProfit = profit;
      bestPrice = i;
    } 
  }

  return bestPrice;
}

const getQuantity = (cost) => {
  if(users.length !== prices.length){
    console.log('user array len doesnt match price array len');
    return null;
  }

  const N = users.length;


  let sumX = prices.reduce((a,b) => { return a + b })
  let sumY = users.reduce((a,b) => { return a + b })

  // console.log('sumX: ', sumX);
  // console.log('sumY: ', sumY);


  let sumXY = 0;
  let sumXSquared = 0;

  for(let i = 0; i < N; i++){
    sumXY += (users[i] * prices[i]);
    sumXSquared += (prices[i] * prices[i])
  };

  // console.log('sumXY: ', sumXY);
  let numerator = sumXY - ((sumX * sumY) / N)
  let denomenator = sumXSquared - ((sumX * sumX)/N)

  let slope = numerator/ denomenator

  let b1 = (sumY - (slope * sumX))/N

  console.log('slope: ', slope)
  console.log('b1: ', b1);

  let data = [];




  for(let i = 0; i < prices[N - 1]; i+=5){
    data.push({x:i, y: ( b1 + (slope * i))})
  }

  let maxProfit = 0; 
  let quantity = 0;

  for(let i = 0; i < prices[N - 1]; i += 0.01){
    let q = b1 + (slope * i)
    let rev = i * (q) 
    let profit = (rev - (cost * q))
    if(profit > maxProfit){
      maxProfit = profit;
      quantity = q;
    } 
  }

  return quantity;
}

const buildData = (users, prices) => {

    if(users.length !== prices.length){
      console.log('user array len doesnt match price array len');
      return null;
    }

    const N = users.length;


    let sumX = prices.reduce((a,b) => { return a + b })
    let sumY = users.reduce((a,b) => { return a + b })

    let sumXY = 0;
    let sumXSquared = 0;

    for(let i = 0; i < N; i++){
      sumXY += (users[i] * prices[i]);
      sumXSquared += (prices[i] * prices[i])
    };

    // console.log('sumXY: ', sumXY);
    let numerator = sumXY - ((sumX * sumY) / N)
    let denomenator = sumXSquared - ((sumX * sumX)/N)

    let slope = numerator/ denomenator

    let b1 = (sumY - (slope * sumX))/N

    // console.log('slope: ', slope)
    // console.log('b1: ', b1);

    let data = [];




    for(let i = 0; i < prices[N - 1]; i+=5){
      data.push({x:i, y: ( b1 + (slope * i))})
    }

    return [...data]
}

const buildScatter = (users, prices) => {

  if(users.length !== prices.length){
    console.log('user array len doesnt match price array len');
    return null;
  }

  const N = users.length;

  let data = [];

  for(let i = 0; i < N; i++){
    data.push({x: prices[i] , y: users[i]})
  }

  console.log('scatter', [...data])
  return [...data]
}

const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;
const Track = (props, state) => <StyledTrack {...props} index={state.index} />;


function App() {

  const [isLoading, setIsLoading] = useState(false);

  console.log('key', key)

  const [cost, setCost] =  useState(5); 
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);


  useEffect(() => {
    setPrice(getPrice(cost));
    setQuantity(getQuantity(cost));

  },[ cost ])

  const line = buildData(users,prices);

  console.log(`build data: `, buildData(users,prices))
  console.log('price: ', price);
  console.log('quant: ', quantity);

  const response = useFetch(setIsLoading);
  const { error, data } = response;
  const {x,y} = splitData([...data]);

  console.log('x: ', x);
  console.log('y: ', y);




  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (isLoading) {
    return (
    <div>
        <h1>Loading</h1>
    </div>
    )
  } else {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Profit Wonk</h2>
      <ResponsiveContainer width={`90%`} height={600}>
        <LineChart data={line}>
          <XAxis domain={[line]} dataKey="x" />
          <YAxis dataKey="y"/>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Line type="monotone" dataKey="y" stroke="#82ca9d"  /> 
          <ReferenceLine x={price} label="" stroke="red" />
          <ReferenceLine y={quantity} label="" stroke="red" />
        </LineChart>
      </ResponsiveContainer>

        <StyledSlider
          min={prices[0]}
          max={prices[prices.length -1]}
          defaultValue={cost}
          renderTrack={Track}
          renderThumb={Thumb}
          onChange={(val) => {
            setCost(val)
          }}
        />

        <p> Optimal Price: {price.toFixed(2)}, # Buyers: { Math.round(quantity)}</p>
        <p> Assumed  Unit Cost: {cost}, Total Cost: {(cost * quantity).toFixed(2)} </p>
        <p> Gross Profit: {(price * quantity).toFixed(2)},  Net Profit: {(price * quantity.toFixed(2) - (cost * quantity.toFixed(2))).toFixed(2)}</p> 

      </header>
    </div>
  );
  }
}

export default App;



const StyledSlider = styled(ReactSlider)`
    width: 80%;
    margin: 5rem 0;
    height: 5px;
`;

const StyledThumb = styled.div`
    height: 50px;
    line-height: 50px;
    width: 50px;
    text-align: center;
    background-color: #000;
    color: #fff;
    border-radius: 50%;
    cursor: grab;
    margin-top:-1.4rem;
`;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: #fff;
    border-radius: 999px;
`;
