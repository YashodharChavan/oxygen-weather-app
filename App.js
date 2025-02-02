import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';

export default function App() {
  const [day, setDay] = useState(0);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(0);
  const [temperature, setTemperature] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState(null)
  const [windSpeed, setWindSpeed] = useState(null)
  const [windDirection, setWindDirection] = useState(null)
  const [UVIndex, setUVIndex] = useState(null)
  const [UVIndexMax, setUVIndexMax] = useState(null)
  const [ozone, setOzone] = useState(null)
  const [cloudiness, setCloudiness] = useState(null)
  const [avgHumidity, setAvgHumidity] = useState(null)
  const [avgCloudiness, setAvgCloudiness] = useState(null)
  const [weatherAlerts, setWeatherAlerts] = useState(null)
  const [severity, setSeverity] = useState(null)
  const [severityColor, setSeverityColor] = useState(null)

  let city = 'solapur'
  let API_KEY = '952fdc12194fd067bdee03bff7193ed4';
  const WEATHER_API_KEY = '86c1ef560f06437c9dc71405250202'
  
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      const data = await response.json();
      
      
      // NOTE: obtained humidity here
      let humid = data.main.humidity;
      setHumidity(humid)
      
      // NOTE: obtaining weather condition like sunny, cloudy, etc
      const weatherCond = data.weather[0].description; 
      setWeatherCondition(weatherCond) 

      // NOTE: obtaining wind speed with directions like NW, NS
      const windSp = data.wind.speed;
      setWindSpeed(windSp)
      const windDirectionDeg = data.wind.deg;
      const getCardinalDirection = (degrees) => {
        if (degrees >= 0 && degrees <= 22.5) return 'N';
        if (degrees > 22.5 && degrees <= 67.5) return 'NE';
        if (degrees > 67.5 && degrees <= 112.5) return 'E';
        if (degrees > 112.5 && degrees <= 157.5) return 'SE';
        if (degrees > 157.5 && degrees <= 202.5) return 'S';
        if (degrees > 202.5 && degrees <= 247.5) return 'SW';
        if (degrees > 247.5 && degrees <= 292.5) return 'W';
        if (degrees > 292.5 && degrees <= 337.5) return 'NW';
        return 'N'; 
      };
      


    //NOTE: obtained average humidity, uv index, and max uv index
    let weathetApiRequest = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&days=1`)  
    let weathetApiResponse = await weathetApiRequest.json()
    setUVIndex(weathetApiResponse.forecast.forecastday[0].day.uv)
    setAvgHumidity(weathetApiResponse.forecast.forecastday[0].day.avghumidity)
    const maxUV = Math.max(...weathetApiResponse.forecast.forecastday[0].hour.map(hour => hour.uv));
    setUVIndexMax(maxUV)
    let astro = weathetApiResponse.forecast.forecastday[0].astro
    setSunrise(astro.sunrise.replace(" AM", ""))
    setSunset(astro.sunset.replace(" PM", ""))

    setCloudiness(weathetApiResponse.forecast.forecastday[0].hour[new Date().getHours()].cloud)

    // NOTE: obtained average cloudiness
    const cloudinessData = weathetApiResponse.forecast.forecastday[0].hour.map(hour => hour.cloud);
    const totalCloudiness = cloudinessData.reduce((sum, cloud) => sum + cloud, 0);
    const averageCloudiness = totalCloudiness / cloudinessData.length;
    setAvgCloudiness(averageCloudiness.toFixed(2))

    
    // NOTE: Obtained ozone
    let ozoneRequest = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=yes`); 
    let ozoneResponse = await ozoneRequest.json()
    setOzone(ozoneResponse.current.air_quality.o3)

    setTemperature(ozoneResponse.current.temp_c)

    // TODO: Trying to get weather alerts: 
    const alertRequest = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${city}&alerts=yes`)
    try {
      const alertResponse = await alertRequest.json() 
      setWeatherAlerts(alertResponse.alerts.alert[0].headline)
      setSeverity(alertResponse.alerts.alert[0].severity)
    }
    catch(R) {
      setWeatherAlerts("None")
      setSeverity("None")
    }
    
    if(severity == "Moderate") {
      setSeverityColor("yellow")
    }
    else if(severity == "Severe") {
      setSeverityColor("red")
    }
    else if(severity == "None") {
      setSeverityColor("green")
    }

    
    // NOTE: obtained direction
    setWindDirection(getCardinalDirection(windDirectionDeg));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };




  const getFormattedDate = () => {
    const today = new Date();
    setDay(String(today.getDate()).padStart(2, '0'));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    setMonth(months[today.getMonth()]);
    setYear(today.getFullYear());
  };

  useFonts({
    'NeueMachina-Regular': require('./assets/fonts/NeueMachina-Regular.ttf'), // Load font
    'Nothing-Font': require('./assets/fonts/Nothing-Font.ttf'),
  });


  useEffect(() => {
    getFormattedDate();
    fetchWeatherData();

  }, [])


  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={{ color: "#fefefe", fontSize: 32, fontFamily: 'NeueMachina-Regular' }}>
          Oxygen
        </Text>
      </View>

      <View style={[styles.dailyForcast, styles.firstPart]}>
        <View style={{width: '55%'}}>
          <Text style={{ fontSize: 40, fontFamily: 'NeueMachina-Regular' }}>{day}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.fontMachina, { fontSize: 24 }]}>{month}</Text>
            <Text style={[styles.fontMachina, { fontSize: 24, marginLeft: 4 }]}>{year}</Text>
          </View>
        </View>

        <View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginRight: 30 }}>
            <Text style={[styles.fontMachina, { fontSize: 38 }]}>{temperature}</Text>
            <Text style={[styles.fontMachina, { fontSize: 18, lineHeight: 18 }]}>o</Text>
            <Text style={[styles.fontMachina, { fontSize: 38 }]}>C</Text>
          </View>

          <Text style={[styles.fontMatrix, { fontSize: 22, marginTop: 4, textAlign: 'center' }]}>
            {city}
          </Text>
        </View>

      </View>

      <View style={[styles.smallGrid]}>
        <View style={[styles.box, { backgroundColor: 'rgb(241, 129, 206)' }]}>

          <Text style={[styles.fontMachina, { fontSize: 22, color: 'white' }]}>{weatherCondition}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
            <Text style={[styles.fontMatrix, { fontSize: 24, textAlign: 'center' }]}>{sunrise}</Text>
            <Text style={[styles.fontMatrix, { fontSize: 14, textAlign: 'center', marginLeft: 10, marginRight: 10 }]}>|</Text>
            <Text style={[styles.fontMatrix, { fontSize: 24, textAlign: 'center' }]}>{sunset}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 6 }}>
            <Text style={[styles.fontMatrix, { fontSize: 16, color: 'white', textAlign: 'center' }]}>Rise</Text>
            <Text style={[styles.fontMatrix, { fontSize: 8, color: 'white', textAlign: 'center', marginLeft: 10, marginRight: 10 }]}>|</Text>
            <Text style={[styles.fontMatrix, { fontSize: 16, color: 'white', textAlign: 'center' }]}>Fall</Text>
          </View>
        </View>

        <View style={[styles.box, { backgroundColor: '#a4a7ae' }]}>
          <Text style={[styles.fontMachina, { fontSize: 22, color: 'white' }]}>Humidity</Text>
          <Text style={[styles.fontMatrix, { fontSize: 38, margin: 'auto', marginBottom: 2 }]}>{humidity} %</Text>
          <Text style={[styles.fontMatrix, { fontSize: 22, margin: 'auto' }]}>avg: {avgHumidity} %</Text>
        
        </View>
      </View>

      <View style={[styles.smallGrid]}>
        <View style={[styles.box, { backgroundColor: 'rgb(208,188,255)' }]}>
          <Text style={[styles.fontMachina, { fontSize: 22, color: 'white' }]}>Wind Speed</Text>
          <Text style={[styles.fontMatrix, { fontSize: 30, margin: 'auto' }]}>{windSpeed} m/s</Text>
          <Text style={[styles.fontMatrix, { fontSize: 30, margin: 'auto' }]}>{windDirection}</Text>
        </View>

        <View style={[styles.box, { backgroundColor: 'rgb(246, 153, 162)' }]}>
          <Text style={[styles.fontMachina, { fontSize: 22, color: 'white' }]}>UV Index</Text>
          <Text style={[styles.fontMatrix, { fontSize: 32, margin: 'auto' }]}>{UVIndex}</Text>
          <Text style={[styles.fontMatrix, { fontSize: 22, margin: 'auto' }]}>Max: {UVIndexMax}</Text>
        </View>
      </View>


      <View style={[styles.smallGrid]}>
        <View style={[styles.box, { backgroundColor: 'rgb(227,33,83)' }]}>
          <Text style={[styles.fontMachina, { fontSize: 22, color: 'white' }]}>Ozone</Text>
          <Text style={[styles.fontMatrix, { fontSize: 30, margin: 'auto' }]}>{ozone} ppb</Text>
        </View>

        <View style={[styles.box, { backgroundColor: 'rgb(215, 131, 215)' }]}>
          <Text style={[styles.fontMachina, { fontSize: 22, color: 'white' }]}>Cloudiness</Text>
          <Text style={[styles.fontMatrix, { fontSize: 32, margin: 'auto' }]}>{cloudiness} %</Text>
          <Text style={[styles.fontMatrix, { fontSize: 22, margin: 'auto' }]}>avg: {avgCloudiness} %</Text>
        </View>
      </View>

      
      <View style={[styles.footerContainer, { marginTop: 2, gap: 5 }]}>
        <View style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
          <Text style={[styles.fontMachina, {fontSize: 24}]}>Alerts: </Text>
          <Text style={[styles.fontMachina, {fontSize: 24, color: `${severityColor}`}]}>{severity}</Text>
        </View>

        <Text style={[styles.fontMachina, {fontSize: 18}]}>{weatherAlerts}</Text>
      </View>

      <View style={[styles.footer]}>
        <Text style={styles.fontMachina}>presented by: (EES PROJECT)</Text>
        <Text style={styles.fontMachina}>Yashodhar Chavan (23210230262)</Text>
        <Text style={styles.fontMachina}>Suraj Rathod (23210230282)</Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  firstPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    margin: 10,
  },
  footerContainer: {
    margin: 9,
    padding: 10,
    backgroundColor: 'rgb(167, 167, 200)',
    height: 110,
    borderRadius: 12,
  },
  container: {
    marginTop: 24,
    margin: 0,
    padding: 0,
    backgroundColor: '#0d0d0d',
    fontFamily: 'NeueMachina-Regular',
    height: '100%',
  },
  fontMachina: {
    fontFamily: 'NeueMachina-Regular',
  },
  fontMatrix: {
    fontFamily: 'Nothing-Font',
  },
  navbar: {
    margin: 8,
    height: 60,
    backgroundColor: '#1b232c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyForcast: {
    margin: 9,
    paddingLeft: 14,
    paddingRight: 10,
    backgroundColor: 'yellow',
    height: 110,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    margin: 10,
  },
  box: {
    width: '49%',
    borderRadius: 12,
    height: 120,
    padding: 6,
    backgroundColor: 'green',
    shadowColor: "#000",
    boxShadow: "0px 2px 4px rgba(255, 255, 255, 0.50)",
  },
  footer: {
    position: 'relative',
    bottom: 10,
    margin: 8,
    height: 60,
    backgroundColor: 'white',
    // alignItems: 'center',
    
  },
  adjustCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
