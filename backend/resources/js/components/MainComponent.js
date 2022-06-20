import React, {Component} from 'react';
import ReactDOM from "react-dom/client";
import HeaderComponent from './HeaderComponent';
import SearchComponent from './SearchComponent';

const root = ReactDOM.createRoot(document.getElementById("root"));

class MainComponent extends Component {
    render(){
        return(
            <div className="site-content">
                <HeaderComponent></HeaderComponent>
                <SearchComponent></SearchComponent>
            </div>
        )
    };
}

root.render(
    <React.StrictMode>
      <MainComponent />
    </React.StrictMode>
  );
