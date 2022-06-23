import React, {Component, useState} from 'react';
import ReactDOM from "react-dom/client";
import Cookies from 'universal-cookie';

import HeaderComponent from './HeaderComponent';
import SearchComponent from './SearchComponent';

const root = ReactDOM.createRoot(document.getElementById("root"));

class MainComponent extends Component {
    constructor(){
        super();

        this.state = {
            auth: false,
            value: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const cookies = new Cookies();

        if(cookies.get('auth') == 'true'){
            this.setState({auth: true});
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    

    handleSubmit = (event) => {
            event.preventDefault();
            axios.post('http://localhost/auth',{password: this.state.value})
            .then(res => {
                if(res.data == 'true'){
                    this.setState({ auth: true});
                    console.log(res.data);
                    const cookies = new Cookies();
                    cookies.set('auth', 'true', { path: '/', maxAge: 604800 });
                } else {
                    alert("Password errata");
                }
            }).catch(err => {
                alert("Password errata");
                console.log(err);
            })
    }


    

    render(){
        const auth = this.state.auth;

        return(
            <div className="site-content">
                <form className='authForm' style={{display: auth ? 'none' : 'flex' }} onSubmit={this.handleSubmit}>
                    <label>
                    Password:
                    </label>
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                    <input type="submit" value="Submit" />
                </form>
                {auth && (
                    <div>
                        <HeaderComponent></HeaderComponent>
                        <SearchComponent></SearchComponent>
                    </div>
                )}
            </div>
        )
    };
}

root.render(
    <React.StrictMode>
      <MainComponent />
    </React.StrictMode>
  );
