<template>
    <div>
      <v-row>
        <v-col :cols="12">
              <div style="background-color : rgb(101, 178, 255); padding : 40px;color : #fff; height : 220px; width: 500px;">
                <div style="float : left;">
                    <div class="weather_icon">
                        <v-icon class="mr-1 theme--dark" size="120" v-text="weatherIcon[wetherData.weather[0].icon.substr(0,2)]"></v-icon>
                    </div>
                </div><br>
  
                <div style="float : right; margin : -5px 0px 0px 60px; font-size : 11pt">
                        <div class="temp_min">{{weatherTempMin}}</div>
                        <div class="temp_max">{{weatherTempMax}}</div>
                        <div class="temp_max">{{weatherTempFeel}}</div>
                        <div class="humidity">{{weatherHumidity}}</div>
                        <div class="wind">{{weatherWind}}</div>
                        <div class="cloud">{{weatherCloud}}</div>
                </div>
                <div style="float : right; margin-top : -45px;">
                    <div class="current_temp" style="font-size : 50pt">{{weatherTemp}}</div>
                    <div class="weather_description" style="font-size : 20pt">{{weatherDescription}}</div>
                    <div class="city" style="font-size : 13pt">{{weatherCity}}</div>
                </div>
            </div>
        </v-col>
      </v-row>
  </div>
  </template>

<script>
export default {
  props: {
    wetherData: {
      type: Object,
    },
 },
 data(){
    return {
        weatherIcon : {
            '01' : 'mdi-sun-wireless',
            '02' : 'mdi-weather-partly-cloudy',
            '03' : 'mdi-weather-cloudy',
            '04' : 'mdi-weather-hail',
            '09' : 'mdi-weather-partly-rainy',
            '10' : 'mdi-weather-pouring',
            '11' : 'mdi-weather-windy',
            '13' : 'mdi-weather-snowy',
            '50' : 'mdi-weather-dust'
        },
        waetherIcon : null,
        weatherDescription : null,
        weatherTemp : null,
        weatherHumidity : null,
        weatherWind : null,
        weatherCity : null,
        weatherCloud : null,
        weatherTempMin : null,
        weatherTempMax : null,
        weatherTempFeel : null
    }
 },
 mounted(){

    var weatherDescription = this.wetherData.weather[0].main;
    var weatherTemp = Math.floor(this.wetherData.main.temp- 273.15) + 'º';
    var weatherHumidity = '습도 ' + this.wetherData.main.humidity+ ' %';
    var weatherWind = '바람 ' +this.wetherData.wind.speed + ' m/s';
    var weatherCity = this.wetherData.name;
    var weatherCloud = '구름 ' + this.wetherData.clouds.all +"%";
    var weatherTempMin = '최저 온도 ' + Math.floor(this.wetherData.main.temp_min- 273.15) + 'º';
    var weatherTempMax = '최고 온도 ' + Math.floor(this.wetherData.main.temp_max- 273.15) + 'º';
    var weatherTempFeel = '체감 온도 ' + Math.floor(this.wetherData.main.feels_like- 273.15) + 'º';
    this.weatherDescription = weatherDescription;
    this.weatherTemp = weatherTemp;
    this.weatherHumidity = weatherHumidity;
    this.weatherWind = weatherWind;
    this.weatherCity = weatherCity;
    this.weatherCloud = weatherCloud;
    this.weatherTempMin = weatherTempMin;
    this.weatherTempMax = weatherTempMax;
    this.weatherTempFeel = weatherTempFeel;

 }
}
</script>