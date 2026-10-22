export const forecast = JSON.stringify({
  today: {
    high: 6.81,
    low: 4.12,
    humidity: 91.6,
    precipitation: 47,
    weather_code: 1001
  },
  next_five_hours: [
    {
      temperature: 6.81,
      weather_code: 4200,
      hour: 14,
      time: '2PM',
      timestamp: '2023-12-28T19:00:00Z'
    },
    {
      temperature: 6.25,
      weather_code: 4200,
      hour: 17,
      time: '5PM',
      timestamp: '2023-12-28T22:00:00Z'
    },
    {
      temperature: 5.78,
      weather_code: 4000,
      hour: 20,
      time: '8PM',
      timestamp: '2023-12-29T01:00:00Z'
    },
    {
      temperature: 5.36,
      weather_code: 1001,
      hour: 23,
      time: '11PM',
      timestamp: '2023-12-29T04:00:00Z'
    },
    {
      temperature: 4.71,
      weather_code: 1001,
      hour: 2,
      time: '2AM',
      timestamp: '2023-12-29T07:00:00Z'
    }
  ],
  date: 'Mon, 12 Oct 2026 21:26:45 GMT'
})
