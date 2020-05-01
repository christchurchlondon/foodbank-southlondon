import React from 'react';
import { connect } from 'react-redux';
import Header from '../header';
import Requests from '../requests';
import Lists from '../lists';
import { getTab } from '../../redux/selectors';
import './styles/index.css';


class Main extends React.Component {
    render() {

        const contents = this.props.tab === 'requests'
            ? <Requests />
            : <Lists />;

        return (
            <main class="main">
                <Header />
                <div class="contents">
                    { contents }
                </div>
            </main>
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
