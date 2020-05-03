import React from 'react';
import { connect } from 'react-redux';
import {
    STATUS_LOADING
} from '../../constants';
import { fetchLists } from '../../redux/actions';
import { getListsState } from '../../redux/selectors';
import Loading from '../common/loading';

class Lists extends React.Component {

    componentDidMount() {
        this.fetchLists();
    }

    fetchLists() {
        this.props.fetchLists();
    }

    isLoading() {
        return this.props.status === STATUS_LOADING;
    }

    render() {

        // TODO components for displaying data

        const contents = this.isLoading()
            ? <Loading />
            : <div>
                <p>TODO: General comments</p>
                { this.props.items.map(i => <p>{i.description}</p>) }
                <p>TODO: Save button</p>
            </div>;

        return (
            <div className="lists-container">
                <h2>Lists</h2>
                { contents }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return getListsState(state);
}

export default connect(
    mapStateToProps,
    { fetchLists }
)(Lists);
