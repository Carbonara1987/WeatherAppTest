import React, {Component} from 'react';
import ForecastsComponent from './ForecastsComponent';

class WeatherComponent extends Component {
    constructor(props) {
        super(props);
    }

    __renderForecasts(data){
        return(
			<div className="forecast-table">
				<div className="container">
					<div className="forecast-container">
						<div className="today forecast">
							<div className="forecast-header">
								<div className="day">{data.today_day}</div>
								<div className="date">{data.today_date}</div>
							</div>
							<div className="forecast-content">
								<div className="location">{data.city}</div>
								<div className="degree">
									<div className="num">
										<span>{data.today_max_temp}</span><sup>o</sup>C</div>
									<div className="forecast-icon">
										<img src={data.weather_icon} alt="" width="90"/>
									</div>	
								</div>
								<span><img src="images/icon-umberella.png" alt=""/><span className="humidity">{data.today_humidity}%</span></span>
								<span><img src="images/icon-wind.png" alt=""/><span className="wind-speed">{data.today_wind_speed}km/h</span></span>
								<span><img src="images/icon-compass.png" alt=""/><span className="wind-direction">{data.wind_direction}</span></span>
							</div>
						</div>
						<ForecastsComponent dailies={data.daily}></ForecastsComponent>
					</div>
				</div>
			</div>
        )
    }

    render(){
        const forecasts = this.props.forecasts;

        return(
			this.__renderForecasts(forecasts)
        )
    }
}

export default WeatherComponent;