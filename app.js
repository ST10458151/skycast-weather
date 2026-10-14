"use strict";
(() => {
  const $=id=>document.getElementById(id);
  const state={units:"c",place:{name:"Johannesburg",country:"South Africa",admin:"Gauteng",latitude:-26.2041,longitude:28.0473},weather:null,request:0};
  const codes={
    0:["Clear sky","☀️"],1:["Mainly clear","🌤️"],2:["Partly cloudy","⛅"],3:["Overcast","☁️"],
    45:["Fog","🌫️"],48:["Rime fog","🌫️"],51:["Light drizzle","🌦️"],53:["Drizzle","🌦️"],55:["Heavy drizzle","🌧️"],
    56:["Freezing drizzle","🌨️"],57:["Freezing drizzle","🌨️"],61:["Light rain","🌦️"],63:["Rain","🌧️"],65:["Heavy rain","🌧️"],
    66:["Freezing rain","🌨️"],67:["Heavy freezing rain","🌨️"],71:["Light snow","🌨️"],73:["Snow","❄️"],75:["Heavy snow","❄️"],
    77:["Snow grains","❄️"],80:["Light showers","🌦️"],81:["Rain showers","🌧️"],82:["Heavy showers","🌧️"],
    85:["Snow showers","🌨️"],86:["Heavy snow showers","🌨️"],95:["Thunderstorm","⛈️"],96:["Thunderstorm with hail","⛈️"],99:["Severe thunderstorm","⛈️"]
  };
  const describe=code=>codes[code]||["Variable conditions","🌤️"];
  function temp(value){return typeof value==="number"&&Number.isFinite(value)?Math.round(state.units==="f"?value*9/5+32:value)+"°":"--";}
  function speed(value){if(typeof value!=="number"||!Number.isFinite(value))return "--";return Math.round(state.units==="f"?value*.621371:value)+" "+(state.units==="f"?"mph":"km/h");}
  function text(id,value){$(id).textContent=value;}
  function status(message,isError=false){const s=$("status");s.textContent=message;s.classList.toggle("error",isError);}
  function formatDay(value,opts){return new Date(value+"T12:00:00").toLocaleDateString(undefined,opts);}
  function hourLabel(value){return value.slice(11,16);}
  function loadSetting(){try{const value=localStorage.getItem("skycast.units");if(value==="c"||value==="f")state.units=value;}catch{}}
  async function fetchJSON(url,signal){
    const response=await fetch(url,{signal,headers:{Accept:"application/json"}});
    if(!response.ok)throw new Error(response.status===429?"The weather service is busy. Please try again shortly.":"The weather service couldn't respond. Please try again.");
    return response.json();
  }
  let controller=null;
  async function showPlace(place){
    const id=++state.request;
    if(controller)controller.abort();
    controller=new AbortController();
    state.place=place;
    text("location",place.name);
    text("locationDetail",[place.admin,place.country].filter(Boolean).join(", "));
    status("Fetching the latest weather for "+place.name+"…");
    $("searchButton").disabled=true;
    const query=new URLSearchParams({
      latitude:String(place.latitude),longitude:String(place.longitude),
      current:"temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
      hourly:"temperature_2m,weather_code,precipitation_probability",
      daily:"weather_code,temperature_2m_max,temperature_2m_min,uv_index_max",
      timezone:"auto",forecast_days:"5",forecast_hours:"24",
      temperature_unit:"celsius",wind_speed_unit:"kmh"
    });
    try {
      const data=await fetchJSON("https://api.open-meteo.com/v1/forecast?"+query,controller.signal);
      if(id!==state.request)return;
      if(!data.current||!data.hourly||!data.daily)throw new Error("Incomplete weather data returned. Please search again.");
      state.weather=data;render();status("");
      try{localStorage.setItem("skycast.lastPlace",JSON.stringify(place));}catch{}
    }catch(error){
      if(id!==state.request||error.name==="AbortError")return;
      status(error.message||"Couldn't load the forecast. Please try again.",true);
    }finally{if(id===state.request)$("searchButton").disabled=false;}
  }
  async function searchCity(input){
    const city=input.trim();
    if(city.length<2){status("Enter at least two letters to search for a city.",true);return;}
    status("Searching for "+city+"…");
    $("searchButton").disabled=true;
    const searchId=++state.request;
    if(controller)controller.abort();
    controller=new AbortController();
    try{
      const params=new URLSearchParams({name:city,count:"10",language:"en",format:"json"});
      const data=await fetchJSON("https://geocoding-api.open-meteo.com/v1/search?"+params,controller.signal);
      if(searchId!==state.request)return;
      const places=Array.isArray(data.results)?data.results:[];
      const chosen=places.find(p=>p.name?.toLowerCase()===city.toLowerCase())||places[0];
      if(!chosen){status('No matching city found for "'+city+'". Try another name.',true);return;}
      await showPlace({name:chosen.name,country:chosen.country,admin:chosen.admin1||"",latitude:chosen.latitude,longitude:chosen.longitude});
      $("cityInput").value="";
    }catch(error){if(searchId===state.request&&error.name!=="AbortError")status(error.message||"City search failed. Try again.",true);}
    finally{if(searchId===state.request)$("searchButton").disabled=false;}
  }
  function render(){
    const d=state.weather;if(!d)return;
    const c=d.current,daily=d.daily,h=d.hourly;
    const [label,icon]=describe(c.weather_code);
    text("location",state.place.name);
    text("locationDetail",[state.place.admin,state.place.country].filter(Boolean).join(", "));
    text("conditionIcon",icon);$("conditionIcon").setAttribute("aria-label",label);
    text("condition",label);
    text("temperature",typeof c.temperature_2m==="number"?Math.round(state.units==="f"?c.temperature_2m*9/5+32:c.temperature_2m):"--");
    text("tempSymbol",state.units==="f"?"°F":"°C");
    text("feelsLike",temp(c.apparent_temperature));
    text("humidity",typeof c.relative_humidity_2m==="number"?c.relative_humidity_2m+"%":"--");
    $("humidityFill").style.width=Math.min(100,Math.max(0,c.relative_humidity_2m||0))+"%";
    text("wind",speed(c.wind_speed_10m));
    text("windLabel",state.units==="f"?"Miles per hour":"Kilometres per hour");
    text("uv",typeof daily.uv_index_max?.[0]==="number"?daily.uv_index_max[0].toFixed(1):"--");
    text("uvLabel","Maximum UV today");
    text("todayHighLow","High "+temp(daily.temperature_2m_max?.[0])+" · Low "+temp(daily.temperature_2m_min?.[0]));
    text("updated","Forecast time: "+(c.time?.replace("T"," ")||"—")+" ("+(d.timezone_abbreviation||"local")+")");
    const hourlyTimes=h.time||[];
    let start=hourlyTimes.findIndex(time=>time>=c.time.slice(0,13)+":00");
    if(start<0)start=0;
    const rainChance=h.precipitation_probability?.[start];
    text("rain",typeof rainChance==="number"?rainChance+"%":"--");
    $("rainFill").style.width=(typeof rainChance==="number"?Math.min(100,Math.max(0,rainChance)):0)+"%";
    const hourly=$("hourlyList");hourly.replaceChildren();
    hourlyTimes.slice(start,start+12).forEach((time,index)=>{
      const i=start+index;
      const node=document.createElement("div");node.className="hour-cell";
      const label=document.createElement("time");label.textContent=index===0?"Now":hourLabel(time);
      const symbol=document.createElement("span");symbol.className="hour-icon";symbol.textContent=describe(h.weather_code?.[i])[1];symbol.setAttribute("aria-label",describe(h.weather_code?.[i])[0]);
      const value=document.createElement("strong");value.textContent=temp(h.temperature_2m?.[i]);
      const chance=document.createElement("small");chance.textContent=(typeof h.precipitation_probability?.[i]==="number"?h.precipitation_probability[i]+"%":"—")+" ☂";
      node.append(label,symbol,value,chance);hourly.appendChild(node);
    });
    const days=$("dailyList");days.replaceChildren();
    (daily.time||[]).slice(0,5).forEach((date,i)=>{
      const node=document.createElement("div");node.className="day-row";
      const label=document.createElement("span");label.className="day-name";label.textContent=i===0?"Today":formatDay(date,{weekday:"short",month:"short",day:"numeric"});
      const symbol=document.createElement("span");symbol.className="day-icon";symbol.textContent=describe(daily.weather_code?.[i])[1];
      const description=document.createElement("span");description.className="day-description";description.textContent=describe(daily.weather_code?.[i])[0];
      const values=document.createElement("strong");values.className="day-temps";
      const high=document.createTextNode(temp(daily.temperature_2m_max?.[i]));
      const low=document.createElement("span");low.textContent=temp(daily.temperature_2m_min?.[i]);
      values.append(high,low);node.append(label,symbol,description,values);days.appendChild(node);
    });
  }
  function changeUnits(next){
    state.units=next;
    $("celsius").classList.toggle("active",next==="c");$("fahrenheit").classList.toggle("active",next==="f");
    $("celsius").setAttribute("aria-pressed",String(next==="c"));
    $("fahrenheit").setAttribute("aria-pressed",String(next==="f"));
    try{localStorage.setItem("skycast.units",next);}catch{}
    render();
  }
  $("searchForm").addEventListener("submit",event=>{event.preventDefault();searchCity($("cityInput").value);});
  document.querySelectorAll(".city-shortcut").forEach(button=>button.addEventListener("click",()=>searchCity(button.dataset.city)));
  $("celsius").addEventListener("click",()=>changeUnits("c"));
  $("fahrenheit").addEventListener("click",()=>changeUnits("f"));
  $("headerDate").textContent=new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"});
  loadSetting();changeUnits(state.units);
  try{const last=JSON.parse(localStorage.getItem("skycast.lastPlace")||"null");if(last&&typeof last.name==="string"&&Number.isFinite(last.latitude)&&Number.isFinite(last.longitude))state.place=last;}catch{}
  showPlace(state.place);
})();