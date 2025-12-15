import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, TextInput, ScrollView, Platform, SafeAreaView } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [city, setCity] = useState('london');
  const [menuVisible, setMenuVisible] = useState(false);
  const [tempCity, setTempCity] = useState("");
  
  let API_KEY = '952fdc12194fd067bdee03bff7193ed4';
  const WEATHER_API_KEY = '86c1ef560f06437c9dc71405250202'

  const handleImagePress = () => {
    setModalVisible(true); // Show input modal when image is clicked
  };
  const handleMenuImagePress = () => {
    setMenuVisible(true); // Show information modal when menu image is clicked
  };
  const handleCityInputChange = (text) => {
    setTempCity(text);
  };
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      const data = await response.json();

      // NOTE: obtained humidity here
      try {
        let humid = data.main.humidity;
        setHumidity(humid)
      } catch (error) {

      }

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
      catch (R) {
        setWeatherAlerts("None")
        setSeverity("None")
      }

      // NOTE: obtained direction
      setWindDirection(getCardinalDirection(windDirectionDeg));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  const handleSaveCity = () => {
    if (tempCity.trim()) { // Ensure the input isn't empty
      setCity(tempCity.trim()); // Update city only on save
    }
    setModalVisible(false); // Close modal after saving
  };
  const getFormattedDate = () => {
    const today = new Date();
    setDay(String(today.getDate()).padStart(2, '0'));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    setMonth(months[today.getMonth()]);
    setYear(today.getFullYear());
  };
  
  const [fontsLoaded] = useFonts({
    'NeueMachina-Regular': require('./assets/fonts/NeueMachina-Regular.ttf'), // Load font
    'Nothing-Font': require('./assets/fonts/Nothing-Font.ttf'),
  });

  useEffect(() => {
    getFormattedDate();
    fetchWeatherData();
  }, [city])
  
  useEffect(() => {
    if (severity == "Moderate") {
      setSeverityColor("yellow")
    }
    else if (severity == "Severe") {
      setSeverityColor("red")
    }
    else if (severity == "None") {
      setSeverityColor("green")
    }
  }, [severity]);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveContainer}>
          
          <View style={[styles.navbar, { display: 'flex', flexDirection: 'row' }]}>
            <Text style={[styles.fontMachina, { color: "#fefefe", fontSize: 30 }]}>
              Oxygen
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start" }}>
              <TouchableOpacity onPress={handleMenuImagePress}>
                <Image source={require('./assets/menu.png')} style={{ width: 50, height: 50 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleImagePress}>
                <Image source={require('./assets/location (1).png')} style={{ width: 50, height: 50 }} />
              </TouchableOpacity>
            </View>
            
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => {
                setModalVisible(false);
                setTempCity(''); // Reset tempCity when closing without saving
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={{ color: 'black', fontSize: 18 }}>Enter City:</Text>
                  <TextInput
                    value={tempCity} // Use tempCity instead of city
                    onChangeText={handleCityInputChange}
                    style={styles.input}
                    placeholder="Enter city name"
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <TouchableOpacity
                      onPress={handleSaveCity} // Save button to confirm city
                      style={[styles.closeButton, { backgroundColor: '#4CAF50' }]} // Green for save
                    >
                      <Text style={{ color: '#fff' }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        setTempCity(''); // Reset tempCity on cancel
                      }}
                      style={styles.closeButton}
                    >
                      <Text style={{ color: '#fff' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            
            <Modal
              visible={menuVisible}
              animationType="fade"
              transparent={true}
              onRequestClose={() => setMenuVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={[styles.modalContent]}>
                  <Text style={[styles.fontMachina, { color: 'black', fontSize: 24 }]}>Presented By: </Text>
                  <Text style={[styles.fontMachina, { marginTop: 10, fontSize: 18 }]}>
                    1. Yashodhar Chavan - 43
                  </Text>
                  <Text style={[styles.fontMachina, { marginTop: 10, fontSize: 18 }]}>
                    2. Suraj Rathod - 86
                  </Text>
                  <Text style={[styles.fontMachina, { marginTop: 10, fontSize: 18 }]}>
                    3. Aditya Bhosale - 33
                  </Text>

                  <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
                    <Text style={{ color: '#fff' }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={[styles.dailyForcast, styles.firstPart]}>
            <View style={{ width: '55%' }}>
              <Text style={[styles.fontMachina, { fontSize: 36 }]}>{day}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.fontMachina, { fontSize: 20 }]}>{month}</Text>
                <Text style={[styles.fontMachina, { fontSize: 20, marginLeft: 4 }]}>{year}</Text>
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
                <Text style={[styles.fontMatrix, { fontSize: 14, color: 'white', textAlign: 'center' }]}>Rise</Text>
                <Text style={[styles.fontMatrix, { fontSize: 8, color: 'white', textAlign: 'center', marginLeft: 10, marginRight: 10 }]}>|</Text>
                <Text style={[styles.fontMatrix, { fontSize: 14, color: 'white', textAlign: 'center' }]}>Fall</Text>
              </View>
            </View>
            <View style={[styles.box, { backgroundColor: '#a4a7ae' }]}>
              <Text style={[styles.fontMachina, { fontSize: 22, color: 'white' }]}>Humidity</Text>
              <Text style={[styles.fontMatrix, { fontSize: 34, margin: 'auto', marginBottom: 2 }]}>{humidity} %</Text>
              <Text style={[styles.fontMatrix, { fontSize: 22, margin: 'auto' }]}>avg: {avgHumidity} %</Text>

            </View>
          </View>

          <View style={[styles.smallGrid]}>
            <View style={[styles.box, { backgroundColor: 'rgb(208,188,255)' }]}>
              <Text style={[styles.fontMachina, { fontSize: 22, color: 'white' }]}>Wind Speed</Text>
              <Text style={[styles.fontMatrix, { fontSize: 28, margin: 'auto' }]}>{windSpeed} m/s</Text>
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
            <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={[styles.fontMachina, { fontSize: 24 }]}>Alerts: </Text>
              <Text style={[styles.fontMachina, { fontSize: 24, color: `${severityColor}` }]}>{severity}</Text>
            </View>
            <Text style={[styles.fontMachina, { fontSize: 18 }]}>{weatherAlerts}</Text>
          </View>
          
          <View style={[styles.footer, { display: 'flex', gap: -30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }]}>
            <Image source={require('./assets/mountain.png')} style={{ height: 100, width: 200 }} />
          </View>
          
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingTop: Platform.OS === "android" ? 30 : 0, // Handle Android Status Bar
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, // Add space at bottom for scrolling
  },
  responsiveContainer: {
    width: '100%',
    maxWidth: 600, // Keeps it looking like a phone on Web/Large screens
    alignSelf: 'center', // Centers the content on Web
    paddingHorizontal: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400, // Responsive modal
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  firstPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  footerContainer: {
    margin: 9,
    padding: 10,
    backgroundColor: 'rgb(167, 167, 200)',
    minHeight: 110, // Changed height to minHeight for responsiveness
    borderRadius: 12,
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
    padding: 8,
    backgroundColor: '#1b232c',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginHorizontal: 10, // Use marginHorizontal
    marginBottom: 10,
  },
  box: {
    width: '48%', // Reduced slightly from 49% to prevent wrap issues on small screens
    borderRadius: 12,
    height: 120,
    padding: 6,
    backgroundColor: 'green',
    shadowColor: "#000",
    // Note: boxShadow is a web property, elevation is for Android, shadow props for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
  },
  footer: {
    marginTop: 10,
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderRadius: 12, // Added radius to match look if it's a card, remove if it should be full width
  },
  adjustCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});