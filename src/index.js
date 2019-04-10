import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

class AddForm extends React.Component {

    constructor(props) {
        super(props);

        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    handleKeyUp(e) {
        const onAddTodo = this.props.onAddTodo;
        if (onAddTodo && e.key === 'Enter') {
            onAddTodo(e.target.value);
            e.target.value = "";
        }
    }

    render() {
        return (
            <div className="add-form">
                <input type="text" placeholder="Add a todo" onKeyUp={this.handleKeyUp} />
            </div>
        );
    }

}

class TodoListItem extends React.Component {

    constructor(props) {
        super(props);
        this.handleTodoItemClick = this.handleTodoItemClick.bind(this);
    }

    handleTodoItemClick(e, text) {
        e.preventDefault();

        const { changeTodoStatus } = this.props;
        if (changeTodoStatus) {
            changeTodoStatus(text);
        }
    }

    handleDeleteButtonClick(e, text) {
        e.preventDefault();

        const { deleteTodoItem } = this.props;
        if (deleteTodoItem) {
            deleteTodoItem(text);
        }
    }

    render() {
        const { text, done } = this.props;
        const style = { textDecoration: done ? "line-through" : "none" };
        return (
            <li className="todo-item">
                <button
                    className="link-button"
                    onClick={(e) => this.handleTodoItemClick(e, text)}>
                    <span style={style}>{text}</span>
                </button>
                {' '}
                <button
                    className="link-button del"
                    onClick={(e) => this.handleDeleteButtonClick(e, text)}>
                    <span style={{ color: 'red' }}>{'x'}</span>
                </button>
            </li>
        );
    }

}

class TodoList extends React.Component {

    render() {
        const { todos, display, changeTodoStatus, deleteTodoItem } = this.props;

        let todoListFiltered = [];

        if (display === 'All') {
            todoListFiltered = todos;
        } else if (display === 'Active') {
            todoListFiltered = todos.filter(item => !item.done);
        } else if (display === 'Done') {
            todoListFiltered = todos.filter(item => item.done);
        }

        return (
            <ul className="todo-list">
                {todoListFiltered.map((item, index) =>
                    <TodoListItem
                        text={item.text}
                        key={item.text}
                        done={item.done}
                        changeTodoStatus={changeTodoStatus}
                        deleteTodoItem={deleteTodoItem}
                    />
                )}
            </ul>
        );
    }

}

class ActionBar extends React.Component {

    render() {
        const { display, countActive, changeView } = this.props;
        return (
            <div className="action-bar">
                <span style={{float: "left"}}>{countActive} items remaining</span>
                <button
                    className={"link-button " + (display === 'All' ? 'active' : '')}
                    onClick={(e) => changeView('All')}>
                    All
                </button>
                {' '}
                <button
                    className={"link-button " + (display === 'Active' ? 'active' : '')}
                    onClick={(e) => changeView('Active')}>
                    Active
                </button>
                {' '}
                <button
                    className={"link-button " + (display === 'Done' ? 'active' : '')}
                    onClick={(e) => changeView('Done')}>
                    Done
                </button>
            </div>
        );
    }

}

class TodoContainer extends React.Component {

    constructor(props) {
        super(props);

        this.onAddTodo = this.onAddTodo.bind(this);
        this.deleteTodoItem = this.deleteTodoItem.bind(this);
        this.changeTodoStatus = this.changeTodoStatus.bind(this);
        this.changeView = this.changeView.bind(this);

        this.state = {
            display: 'All',
            todos: []
        }
    }

    onAddTodo(text) {
        const todos = this.state.todos;
        todos.push({
            text: text,
            done: false
        });
        this.setState({
            todos: [...todos]
        })
    }

    deleteTodoItem(text) {
        const todos = this.state.todos;

        this.setState({
            todos: todos.filter(item => item.text !== text)
        })
    }

    changeView(display) {
        this.setState({
            display: display
        })
    }

    changeTodoStatus(text) {
        const todos = this.state.todos;
        todos.filter(item => item.text === text).map(item => item.done = !item.done);
        this.setState({
            todos: [...todos]
        })
    }

    render() {
        const { todos, display } = this.state;
        const countActive = todos.filter(item => !item.done).length;
        return (
            <div>
                <AddForm onAddTodo={this.onAddTodo} />
                {todos.length > 0 && (
                    <TodoList
                        todos={todos}
                        changeTodoStatus={this.changeTodoStatus}
                        deleteTodoItem={this.deleteTodoItem}
                        display={display}
                    />
                )}
                {todos.length > 0 && (
                    <ActionBar 
                        changeView={this.changeView}
                        display={display} 
                        countActive={countActive} 
                    />
                )}
            </div>
        );
    }

}

ReactDOM.render(
    <TodoContainer />,
    document.getElementById('container')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
