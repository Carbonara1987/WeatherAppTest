import React, {Component} from 'react';

class ForecastsComponent extends Component {
    constructor(props) {
        super(props);
    }

    __renderForecasts(object){

		return Object.entries(object).map(([key, value], i) => {
            return(
				<div className="forecast next">
					<div className="forecast-header">
						<div className="day">{value.day}</div>
					</div>
					<div className="forecast-content">
						<div className="forecast-icon">
							<img src={value.weather_icon} alt="" width="48"/>
						</div>
						<div className="degree">{value.max_temp}<sup>o</sup>C</div>
						<small>{value.low_temp}<sup>o</sup></small>
					</div>
				</div>
			)
        })        
    }

    render(){
        const daily = this.props.dailies;

        return(
			this.__renderForecasts(daily)
        )
    }
}

export default ForecastsComponent;