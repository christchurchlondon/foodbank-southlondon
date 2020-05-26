import React from 'react';
import './styles/comments.scss';


export default class ListsComments extends React.Component {

    componentDidMount() {
        this.props.onChange(this.props.value);
    }

    render() {
        return (
            <section className="lists-comments panel">
                <label>Comments</label>
                <textarea value={ this.props.value } onChange={ e => this.props.onChange(e.target.value) }></textarea>
            </section>
        );
    }
}
