import React from 'react';
import { connect } from 'react-redux';
import { STATUS_LOADING } from '../../constants';
import { getRequestsState } from '../../redux/selectors';
import { fetchRequests } from '../../redux/actions';
import Loading from '../common/loading';
import RequestsFilter from './filter';
import RequestsList from './list';
import RequestsActions from './actions';

class Requests extends React.Component {
    
    constructor(props) {
        super(props);
        this.fetchRequests = this.fetchRequests.bind(this);
    }

    componentDidMount() {
        // TODO only run if props.items is empty?
        this.fetchRequests();
    }

    fetchRequests(filter = '') {
        this.props.fetchRequests(filter);
    }

    isLoading() {
        return this.props.status === STATUS_LOADING;
    }

    render() {

        // TODO actions for child components
        // TODO refresh button?

        const contents = this.isLoading()
            ? <Loading />
            : (
                <div>
                    <RequestsFilter onSubmit={ v => this.fetchRequests(v) } value={this.props.filter} />
                    <RequestsList requests={ this.props.items } />
                    <RequestsActions />
                </div>
            );

        return (
            <div className="requests-container">
                <h2>Requests</h2>
                { contents }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return getRequestsState(state);
}

export default connect(
    mapStateToProps,
    { fetchRequests }
)(Requests);
