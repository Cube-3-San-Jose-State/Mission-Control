import React, { Component } from 'react'

class UpdateLog extends Component {
		constructor(props){
			super(props);
			this.serialLog = React.createRef();

			this.state = {
				data: props.data,
				displayString: ""
			};
		}

		errorCheck(){
			this.setState({displayString: "example error " + Math.random()});
		}

		componentDidUpdate(){
			this.serialLog.current.scrollTop = this.serialLog.current.scrollHeight;
			// this.errorCheck();
		}


    	render() { 
			return (
				<div>
					<h2>Raw Serial Output</h2>
	    			<textarea ref={this.serialLog} readOnly value={this.props.rawSerial}/>
				</div>
    		)
		}
}

export default UpdateLog;