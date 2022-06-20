<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ForecastsController extends Controller
{
    private function getWindDirections() {
    
            $windDirections = [
                'N' => [
                    '0',
                    '11.25'
                ],
                'NNE' => [
                    '11.26',
                    '33.75'],
                'NE' => [
                    '33.76',
                    '56.25'
                    ],
                'ENE' => [
                    '56.26',
                    '78.75'
                ],
                'E' => [
                    '78.76',
                    '101.25'
                ],
                'ESE' => [
                    '101.26',
                    '123.75'
                ],
                'SE' => [
                    '123.76',
                    '146.25'
                ],
                'SSE' => [
                    '146.26',
                    '168.75'
                ],
                'S' => [
                    '168.76',
                    '191.25'
                ],
                'SSW' => [
                    '191.26',
                    '213.75'
                ],
                'SW' => [
                    '213.76',
                    '236.25'
                ],
                'WSW' => [
                    '236.26',
                    '258.75'
                ],
                'W' => [
                    '258.76',
                    '281.25'
                ],
                'WNW' => [
                    '281.26',
                    '303.75'
                ],
                'NW' => [
                    '303.76',
                    '326.25'
                ],
                'NNW' => [
                    '326.26',
                    '348.75'
                ]

            ];

        return $windDirections;
            
    }

    private function getKey() {
        $apiKey = config('app.weather_api_key');
        return $apiKey;
    }

    private function getCoordinates ($city) {

        $instance = new self();
        $apiKey = $instance->getKey();
        
        $url = 'http://api.openweathermap.org/geo/1.0/direct?q='.$city.'&limit=1&appid='.$apiKey.'';
        $response = file_get_contents($url);
        $urlData = json_decode($response,true);

        return $urlData;

    }

    private function getForecasts($city) {

        $instance = new self();
        $apiKey = $instance->getKey();

        $coordinates = $instance->getCoordinates($city);
        if(!empty($coordinates) || $coordinates !== null) {
            $lat = $coordinates[0]['lat'];
            $long = $coordinates[0]['lon'];

            $url = 'https://api.openweathermap.org/data/2.5/onecall?lat='.$lat.'&lon='.$long.'&exclude=minutely,hourly,alerts&appid='.$apiKey.'';
            $response = file_get_contents($url);
            $urlData = json_decode($response,true);
        } else {
            $urlData = null;
        }


        return $urlData;

    }

    public static function getData(Request $request) {
        $city = $request->city;

        $returnData = [];
        $instance = new self();
        $forecastData = $instance->getForecasts($city);
        if($forecastData !== null) {

            $instance = new self();
            $returnData['success'] = true;
            $returnData['city'] = $city;
            $returnData['today_max_temp'] = ceil($forecastData['current']['temp'] - 273.15);
            $returnData['today_low_temp'] = ceil($forecastData['current']['dew_point'] - 273.15);
            $returnData['today_wind_speed'] = $forecastData['current']['wind_speed'];
            $returnData['weather_icon'] = 'http://openweathermap.org/img/wn/'.$forecastData['current']['weather'][0]['icon'].'@4x.png';


            $returnData['today_day'] = date('l',$forecastData['current']['dt']);
            $returnData['today_date'] = date('d/m',$forecastData['current']['dt']);
            $returnData['today_humidity'] = $forecastData['current']['humidity'];

            $windDirections = $instance->getWindDirections();

            //Wind direction based on degrees
            foreach ($windDirections as $windDirection => $degrees)
            {
                if($forecastData['current']['wind_deg'] >= $degrees[0] && $forecastData['current']['wind_deg'] < $degrees[1]) {
                    $returnData['wind_direction'] = $windDirection;
                }
            }


            //Daily data

            foreach ($forecastData['daily'] as $day => $dailyData)
            {
                if($day > 0 && $day < 7) {

                    $returnData['daily'][$day]['day'] = date('l',$dailyData['dt']);
                    $returnData['daily'][$day]['weather_icon'] = 'http://openweathermap.org/img/wn/'.$dailyData['weather'][0]['icon'].'@2x.png';
                    $returnData['daily'][$day]['max_temp'] = ceil($dailyData['temp']['max'] - 273.15);
                    $returnData['daily'][$day]['low_temp'] = ceil($dailyData['temp']['min'] - 273.15);

                }
            }
        } else {
            $returnData['success'] = false;
        }

        return response()
        ->json($returnData);
    }
}
