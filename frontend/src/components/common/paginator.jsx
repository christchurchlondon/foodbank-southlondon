import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/paginator.scss';

export default class Paginator extends React.Component {

    midPageCount = 3;

    constructor(props) {
        super(props);
        this.selectNext = this.selectNext.bind(this);
        this.selectPrev = this.selectPrev.bind(this);
        this.selectPage = this.selectPage.bind(this);
    }

    isFirstPage() {
        return this.props.selectedPage === 1;
    }

    isLastPage() {
        return this.props.selectedPage === this.props.pages;
    }

    showStartPages() {
        return this.props.selectedPage > this.midPageCount + 1;
    }

    showEndPages() {
        return this.props.selectedPage < this.props.pages - this.midPageCount; // + 2;
    }

    getStartPages() {
        return this.showStartPages()
            ? <Page page={1} selected={ this.isFirstPage() } onSelect={ this.selectPage } />
            : null;
    }

    getStartSpacer() {
        return this.showStartPages()
            ? <span className="page-spacer" />
            : null;
    }

    getMidPages() {
        const page = this.props.selectedPage;
        const total = this.props.pages;
        const count = this.midPageCount;
        const start = (page <= count + 1) ? 1 : Math.min(page - 1, total - count - 1);
        const end = (page >= total - count) ? total : Math.max(page + 1, count + 2);
        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(
                <Page key={i} page={i}
                    selected={ i === this.props.selectedPage }
                    onSelect={ this.selectPage } />
            );
        }
        return pages;
    }

    getEndSpacer() {
        return this.showEndPages()
            ? <span className="page-spacer" />
            : null;
    }    

    getEndPages() {
        return this.showEndPages()
            ? <Page page={this.props.pages} selected={ this.isLastPage() } onSelect={ this.selectPage } />
            : null;
    }

    getPrevLink() {
        return (
            <span className={'page' + (this.isFirstPage() ? ' disabled' : '')}
                onClick={ this.selectPrev }>
                <FontAwesomeIcon icon="chevron-left" />
            </span>
        );
    }

    getNextLink() {
        return (
            <span className={'page' + (this.isLastPage() ? ' disabled' : '')}
                onClick={ this.selectNext }>
                <FontAwesomeIcon icon="chevron-right" />
            </span>
        );
    }

    getDescription() {
        if (!this.props.pageSize || !this.props.totalRecords) {
            return null;
        }
        const start = this.props.pageSize * (this.props.selectedPage - 1) + 1;
        const end = Math.min(this.props.pageSize * this.props.selectedPage, this.props.totalRecords);
        return <p className="pagination-description">Showing {start} - {end} of { this.props.totalRecords }</p>
    }

    select(page) {
        if (this.props.onSelect) {
            this.props.onSelect(page);
        }
    }

    selectPrev() {
        if (this.isFirstPage()) return;
        this.select(this.props.selectedPage - 1);
    }

    selectNext() {
        if (this.isLastPage()) return;
        this.select(this.props.selectedPage + 1);
    }

    selectPage(page) {
        if (page === this.props.selectedPage) return;
        this.select(page);
    }

    render() {
        if (!this.props.pages || this.props.pages < 0) return null;
        return (
            <div className="paginator">
                <div className="pages">
                    { this.getPrevLink() }
                    { this.getStartPages() }
                    { this.getStartSpacer() }
                    { this.getMidPages() }
                    { this.getEndSpacer() }
                    { this.getEndPages() }
                    { this.getNextLink() }
                </div>
                { this.getDescription() }
            </div>
        );

    }
}

function Page(props) {
    return (
        <span className={'page' + (props.selected ? ' selected' : '')}
            onClick={ () => props.onSelect(props.page) }>
            { props.page }
        </span>
    );
}
