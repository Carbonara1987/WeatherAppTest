import React, {Component} from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import ForecastComponent from './ForecastComponent';

function getRegexAnywhere(val) {
	return new RegExp(`${val}`, 'i');
}

function getMatchingUser(value, data) {
	const escapedValue = escapeRegexCharacters(value.trim());
	if (escapedValue === '') {
		return [];
	}
	const regex = getRegexAnywhere(escapedValue);
	return data.filter(user => regex.test(user.name));
}

function sortMatches(matchesArr, query) {
	return matchesArr.sort ( (a,b) => {
		const matches1 = _.startsWith(a.name, query)
		const matches2 = _.startsWith(b.name, query)
		if (!matches1 && matches2)
			return true
		else if (matches1 && !matches2)
			return false
		return a.name < b.name ? -1 : +(a.name > b.name)
	}).slice(0,4)
}

/* ----------- */
/*    Utils    */
/* ----------- */

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* --------------- */
/*    Component    */
/* --------------- */

function getSuggestionValue(suggestion) {
	return suggestion.name;
}

function renderSuggestion(suggestion, {
	query
}) {
	const regexp = new RegExp(`^(.*?)(${query})(.*)$`, 'i')
	let matches = getSuggestionValue(suggestion).match(regexp);
	if (!matches || matches.length < 3) return null;
	if (matches) {
		matches.shift();
		matches[0] = <b>{matches[0]}</b>;
		matches[2] = <b>{matches[2]}</b>;
	} else {
		matches = suggestion.name;
	}
	return (
		<span className="suggestion">
		<span className="name">{matches}</span>
		</span>
	);
}

class SearchComponent extends Component {
    state = {
        items: [],
        value: '',
        success: false
    };

	constructor() {
		super();

		this.state = {
			value: '',
			suggestions: [],
			selections: [],
            forecasts: [],
			isLoading: false
		};

		this.cache = {
			suggestions: this.state.suggestions
		};

		this.lastRequestId = null;
	}

    componentDidMount(){
        this.setDefaultLocation;
    }

    setDefaultLocation() {
        axios.post('http://localhost/forecasts',{city: 'Roma'})
			.then(res => {
				console.log(res.data);
                this.setState({forecasts: res.data});
			}).catch(err => {
				console.log(err);
			})
    }

    findLocation(suggestion) {
        axios.post('http://localhost/forecasts',{city: suggestion})
			.then(res => {
				console.log(res.data);
                this.setState({forecasts: res.data});
			}).catch(err => {
				console.log(err);
			})
    }

	loadSuggestions(value) {

		// Cancel the previous request
		if (this.lastRequestId !== null) {
			this.lastRequestId = null
		}

		if (this.cache.suggestions.length)
			this.setState({
				isLoading: true,
				suggestions: sortMatches(getMatchingUser(value, this.cache.suggestions), value)
			})
		else {
			this.setState({
				isLoading: true,
				suggestions: []
			})
		}

		this.lastRequestId = axios.get('http://localhost/data/city.list.min.json')
			.then(res => {
				this.cache.suggestions = [...this.cache.suggestions, ...res.data]
				this.cache.suggestions = _.uniqBy(this.cache.suggestions, (s) => s.name)
				this.setState({
					isLoading: false,
					suggestions: sortMatches(getMatchingUser(value, this.cache.suggestions), value)
				})
			}).catch(err => {
				const data = this.cache.suggestions
				this.setState({
					isLoading: false,
					suggestions: sortMatches(getMatchingUser(value, data), value)
				})
			})
	}

	onChange = (event, {
		newValue
	}) => {
		this.setState({
			value: newValue
		});
	};

	onSuggestionsFetchRequested = ({
		value
	}) => {
		this.loadSuggestions(value);
	};

	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
	};

	onSuggestionSelected = (evt, {
		suggestion
	}) => {
		this.setState({
			value: '',
			selections: [...this.state.selections, suggestion]
		});
        this.findLocation(suggestion.name);
    };

	render() {
		const {
			value,
			suggestions,
			isLoading
		} = this.state;
		const inputProps = {
			placeholder: "Search place",
			value,
			onChange: this.onChange
		};

		return (
            <div>
                <div className="hero" data-bg-image="images/banner.png">
                    <div className="container">
                        <section className="find-location">
                                {isLoading ? <span className="loading-spinner"></span> : null}
                                <Autosuggest 
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                            onSuggestionSelected={this.onSuggestionSelected}
                        inputProps={inputProps} />
                        </section>
                    </div>
                </div>
                <ForecastComponent forecasts={this.state.forecasts}></ForecastComponent>
            </div>
		);
	}
}

export default SearchComponent;