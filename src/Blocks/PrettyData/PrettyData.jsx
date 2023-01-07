import React, { Component } from 'react'

class PrettyData extends Component {
    constructor(props) {
      super(props)
    }

    render() {
        return (
            <pre>{JSON.stringify(this.props.data, null, 4)}</pre>
        )
    }
}

export default PrettyData;