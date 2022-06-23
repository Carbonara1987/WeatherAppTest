import React, {Component} from 'react';

class HeaderComponent extends Component {
    render(){
        return(
			<div className="site-header">
				<div className="container">
					<a href="index.html" className="branding">
						<img src="http://localhost/images/logo.png" alt="" className="logo"/>
						<div className="logo-type">
							<h1 className="site-title">Meteo test</h1>
							<small className="site-description">prova tecnica 06/2022</small>
						</div>
					</a>
				</div>
			</div>
        )
    }
}

export default HeaderComponent;