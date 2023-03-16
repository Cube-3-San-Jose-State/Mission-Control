import React, { Component } from 'react'

class UpdateLog extends Component {
		constructor(props){
			super(props);
			this.state = {
				data: props.data,
				displayString: ""
			};
		}

		errorCheck(){
			this.setState({displayString: "example error " + Math.random()});
		}

		componentDidUpdate(){
			this.errorCheck();
		}


    	render() { 
			return (
	    		<div>{this.state.data}</div>
    		)
		}
}

export default UpdateLog;