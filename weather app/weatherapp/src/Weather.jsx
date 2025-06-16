import { useState } from 'react';
import './index.css'
import axios from 'axios'

function Weather(){
    const [inp,setinp] = useState("");
    const [weather,setweather]=useState();


    function setting(e){
        setinp(e.target.value);
    }
    
    async function getthedata(city){
        if(city){
            try{
                const response= await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'0f3cb267468445601b62457998876a75'}`);
                setweather(response);
            }
            catch(error){
                console.log(error);
            }
        }      
        else{
            alert('Enter the city name')
        }
    }
    
    return (
        <>
            <div><h2 className="txt">Enter you city to seach for the weather details</h2></div>
            <div className='elements'>
                <input type="text" value={inp} placeholder='enter the city...' onChange={setting} />
                <button className="btn" onClick={()=> getthedata(inp)}>Get Weather</button>
            </div>
            <div className='details'>
                {weather 
                && 
                <>
                <p>Name of the City: {weather.data.name}</p>
                <p>Temparature of {weather.data.name} is {weather.data.main.temp}</p>
                <p>Description: {weather.data.weather[0].description}</p>
                </>
                }

            </div>
        </>
    );
}


export default Weather;