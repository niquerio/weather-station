export const weatherCodeMap = {
  "0":  {
    name: "Unknown",
    day: "none",
    night: "none"
  },
  "1000": {
    name: "Clear, Sunny",
    day: "sunny",
    night: "clear_night"
  },
  "1100": {
    name: "Mostly Clear",
    day: "sunny",
    night: "clear_night"
  },
  "1101": {
    name: "Partly Cloudy",
    day: "partly_cloudy_day",
    night: "partly_cloudy_night"
  },
  "1102": {
    name: "Mostly Cloudy",
    day: "cloud",
    night: "cloud"
  },
  "1001": {
    name: "Cloudy",
    day: "cloud",
    night: "cloud"
  },
  "2000": {
    name: "Fog",
    day: "foggy",
    night: "foggy"
  },
  "2100": {
    name: "Light Fog",
    day: "foggy",
    night: "foggy"
  },
  "4000": {
    name: "Drizzle",
    day: "rainy_light",
    night: "rainy_light"
  },
  "4001": {
    name: "Rain",
    day: "rainy",
    night: "rainy"
  },
  "4200": {
    name: "Light Rain",
    day: "rainy_light",
    night: "rainy_light"
  },
  "4201": {
    name: "Heavy Rain",
    day: "rainy_heavy",
    night: "rainy_heavy"
  },
  "5000": {
    name: "Snow",
    day: "weather_snowy",
    night: "weather_snowy"
  },
  "5001": {
    name: "Flurries",
    day: "weather_snowy",
    night: "weather_snowy"
  },
  "5100": {
    name: "Light Snow",
    day: "weather_snowy",
    night: "weather_snowy"
  },
  "5101": {
    name: "Heavy Snow",
    day: "snowing_heavy",
    night: "snowing_heavy"
  },
  "6000": {
    name: "Freezing Drizzle",
    day: "rainy_snow",
    night: "rainy_snow"
  },
  "6001": {
    name: "Freezing Rain",
    day: "rainy_snow",
    night: "rainy_snow"
  },
  "6200": {
    name: "Light Freezing Rain",
    day: "rainy_snow",
    night: "rainy_snow"
  },
  "6201": {
    name: "Heavy Freezing Rain",
    day: "rainy_snow",
    night: "rainy_snow"
  },
  "7000": {
    name: "Ice Pellets",
    day: "weather_hail",
    night: "weather_hail"
  },
  "7101": {
    name: "Heavy Ice Pellets",
    day: "weather_hail",
    night: "weather_hail"
  },
  "7102": {
    name: "Light Ice Pellets",
    day: "weather_hail",
    night: "weather_hail"
  },
  "8000": {
    name: "Thunderstorm",
    day: "thunderstorm",
    night: "thunderstorm"
  }
}

//TODO: Make this a function of sunrise and sunset
export function weatherIcon(code,hour){
  const time_of_day = hour >= 6 && hour <= 18 ? "day" : "night";
  return weatherCodeMap[code][time_of_day];
}
