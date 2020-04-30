import React from 'react';
import { connect } from 'react-redux';
import Header from '../header';
import Requests from '../requests';
import Lists from '../lists';
import { getTab } from '../../redux/selectors';


class Main extends React.Component {
    render() {

        const contents = this.props.tab === 'requests'
            ? <Requests />
            : <Lists />;

        return (
            <div class="main">
                <Header />
                { contents }
            </div>
        );
    }
}

const mapStateToProps = state => {
    const tab = getTab(state);
    return { tab };
}

export default connect(
    mapStateToProps
    // TODO actions
)(Main);
