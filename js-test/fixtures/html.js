export const html = `<!DOCTYPE html> 
<body>
  <div class="container">
    <div id="now" class="col">
      <h2 id="now-title">Now</h2>
      <div id="outside" class="values pair">
        <span class="tooltip-wrapper">
          <span style="color: green; font-size:60px" class="material-symbols-outlined">park</span>
          <span role="tooltip" id="outside-tip" class="tooltip">Some text</span>
        </span>
        <div class="measurement">
          <span id="outside-temperature">00</span>°
        </div>
        <div class="measurement">
          <span id="outside-humidity">00</span>%
        </div>
        <div class="measurement">
          <span id="outside-dewpoint">00</span>°<small>DP</small>
        </div>
      </div>
      <div id="inside" class="values pair">
        <span class="tooltip-wrapper">
          <span style="color: #98B7D4; font-size:60px" class="material-symbols-outlined">cottage</span>
          <span role="tooltip" id="inside-tip" class="tooltip">Some text</span>
        </span>
        <div class="measurement">
          <span id="inside-temperature">00</span>°
        </div>
        <div class="measurement">
          <span id="inside-humidity">00</span>%
        </div>
        <div class="measurement">
          <span id="inside-dewpoint">00</span>°<small>DP</small>
        </div>
      </div>
      <div id="clock">
        <div id="clock-time">1:00</div>
        <div id="clock-date">July 15, 2023</div>
      </div>
    </div>
    <div id="forecast" class="col">
      <h2 id="forecast-title">Forecast</h2>
      <div id="today" class="values">
        <div id="today-temperature" class="space-evenly">
          <span class="tooltip-wrapper">
            <span style="color: gray; font-size:60px" class="material-symbols-outlined" id="today-icon">sunny</span>
              <span role="tooltip" id="weather-tip" class="tooltip">sunny</span>
          </span>
          <span class="tooltip-wrapper">
            <span><span id="high">00</span>°</span>
            /
            <span><span id="low">00</span>°</span>
            <span role="tooltip" id="forecast-tip" class="tooltip">Some text</span>
          </span>
        </div>
        <div class="space-evenly">
          <div class="measurement">
            <span id="humidity">00</span>%<small> H</small>
          </div>
          <div class="measurement">
            <span id="precipitation">00</span>%<small> P</small>
          </div>
        </div>
      </div>
      <div id="hours">
      </div>
    </div>
  </div>
</body>
`
