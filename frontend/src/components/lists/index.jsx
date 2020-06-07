import React from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import {
    STATUS_LOADING, STATUS_SUCCESS, STATUS_FAILED
} from '../../constants';
import {
    fetchLists,
    toggleListSelection,
    clearListSelection,
    openItemAddForm,
    openItemEditForm,
    deleteListItem,
    confirmListItemEdit,
    cancelListItemEdit,
    moveListItem,
    openSaveListDialog,
    closeSaveListDialog,
    sendListUpdate
} from '../../redux/actions';
import { getListsState } from '../../redux/selectors';
import Loading from '../common/loading';
import Error from '../common/error';
import ListsComments from './comments';
import ListsData from './data';
import ListsControls from './controls';
import ListItemForm from './item-form';
import ListSaveDialog from './save-dialog';

class Lists extends React.Component {

    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.updateNotes = this.updateNotes.bind(this);
        this.openAddForm = this.openAddForm.bind(this);
        this.openEditForm = this.openEditForm.bind(this);
        this.editItem = this.editItem.bind(this);
        this.cancelEditItem = this.cancelEditItem.bind(this);
        this.moveItem = this.moveItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.openSaveDialog = this.openSaveDialog.bind(this);
        this.closeSaveDialog = this.closeSaveDialog.bind(this);
        this.confirmSave = this.confirmSave.bind(this);

        this.state = { notes: this.props.value || '' };
    }

    componentDidMount() {
        this.fetchLists();
        document.addEventListener('click', this.clearSelection, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.clearSelection, false);
    }

    fetchLists() {
        this.props.fetchLists();
    }

    updateNotes(notes) {
        this.setState({ notes });
    }

    moveItem(oldPosition, newPosition) {
        this.props.moveListItem(oldPosition, newPosition);
    }

    openSaveDialog() {
        this.props.openSaveListDialog();
    }

    closeSaveDialog() {
        this.props.closeSaveListDialog();
    }

    confirmSave() {
        this.props.sendListUpdate(this.props.items, this.state.notes);
    }

    select(id, type) {
        this.props.toggleListSelection(id, type);
    }

    clearSelection() {
        this.props.clearListSelection();
    }

    openAddForm() {
        this.props.openItemAddForm();
    }

    openEditForm(id) {
        this.props.openItemEditForm(id);
    }

    deleteItem(id) {
        this.props.deleteListItem(id);
    }

    editItem(id, data) {
        this.props.confirmListItemEdit(id, data);
    }

    cancelEditItem() {
        this.props.cancelListItemEdit();
    }

    isLoading() {
        return this.props.status === STATUS_LOADING;
    }

    isFailed() {
        return this.props.status === STATUS_FAILED;
    }

    isSuccessful() {
        return this.props.status === STATUS_SUCCESS;
    }

    getContents() {
        if (this.isLoading()) return <Loading />;
        if (this.isFailed()) return <Error message={'Unable to load lists'} />;
        return this.getListsContents();
    }

    getListsContents() {
        return (
            <div>
                <ListsComments value={ this.props.notes } onChange={ this.updateNotes } />
                <ListsData
                    data={this.props.items}
                    selectedComment={this.props.selectedComment}
                    onSelect={ this.select }
                    onEdit={ this.openEditForm }
                    onReorder={ this.moveItem }
                    onDelete={ this.deleteItem } />
                <ListsControls
                    onAdd={ this.openAddForm }
                    onSave={ this.openSaveDialog } />
            </div>
        );
    }

    getEditForm() {
        return this.props.editItem
            ? <ListItemForm
                id={ this.props.editItem.id }
                item={ this.props.editItem.data }
                new={ this.props.editItem.new }
                onEdit={ this.editItem }
                onCancel={ this.cancelEditItem } />
            : null;
    }

    getSaveDialog() {
        return this.props.saveDialog
            ? <ListSaveDialog status={ this.props.saveDialog.status }
                onConfirm={ this.confirmSave }
                onCancel={ this.closeSaveDialog } />
            : null;
    }

    render() {

        const contents = this.getContents();
        const editForm = this.getEditForm();
        const saveDialog = this.getSaveDialog();

        return (
            <div className="lists-container">
                { contents }
                { editForm }
                { saveDialog }
                <Prompt when={this.props.unsaved} message="You have unsaved data on this page. Continue?" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return getListsState(state);
}

export default connect(
    mapStateToProps, {
        fetchLists,
        toggleListSelection,
        clearListSelection,
        openItemAddForm,
        openItemEditForm,
        deleteListItem,
        confirmListItemEdit,
        cancelListItemEdit,
        moveListItem,
        openSaveListDialog,
        closeSaveListDialog,
        sendListUpdate
    }
)(Lists);
