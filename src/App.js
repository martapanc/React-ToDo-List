import React, {Component} from 'react';
import './App.css';
import firebase from "./firebase";
import {TodoRow} from './component/TodoRow';
import {TodoBanner} from "./component/TodoBanner";
import {TodoCreator} from "./component/TodoCreator";
import {VisibilityControl} from "./component/VisibilityControl";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: "Marta",
            todoItems: [
                {action: "Run dishwasher", done: false},
                {action: "Water plants", done: false},
                {action: "Listen to Daily Cogito", done: false}
            ],
            showCompleted: true
        }
    }

    updateNewTextValue = (event) => {
        this.setState({newItemText: event.target.value});
    }

    isValidInputText = (text) => {
        return text !== undefined && text.trim() !== "";
    }

    createNewTodo = (task) => {
        const db = firebase.firestore();

        if (this.isValidInputText(task) && !this.state.todoItems.find(item => item.action === task)) {
            db.collection("react-to-watch-list").doc(task).set({
                item: task,
                done: false,
                added: firebase.firestore.Timestamp.fromDate(new Date())
            });

            this.setState({
                todoItems: [...this.state.todoItems, {action: task, done: false}],
                nextItemText: ""
            });
        }
    }

    toggleTodo = (todo) => this.setState({
        todoItems: this.state.todoItems.map(item => item.action === todo.action ? {...item, done: !item.done} : item)
    });

    todoTableRows = (doneValue) => this.state.todoItems
        .filter(item => item.done === doneValue)
        .map(item =>
            <TodoRow key={item.action} item={item} callback={this.toggleTodo}/>
        )

    render() {
        return (
            <div>
                <TodoBanner name={this.state.userName} tasks={this.state.todoItems}/>
                <div className="container-fluid">
                    <TodoCreator callback={this.createNewTodo}/>
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th className="col-lg-8">Description</th>
                            <th className="col-lg-4">Done</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.todoTableRows(false)}
                        </tbody>
                    </table>
                    <div className="bg-secondary text-white text-center p-2">
                        <VisibilityControl isChecked={this.state.showCompleted}
                                           callback={(checked) => this.setState({showCompleted: checked})}
                        />
                    </div>
                    {
                        this.state.showCompleted &&
                        <table className="table table-striped table-bordered">
                            <thead>
                            <tr>
                                <th className="col-md-8 col-lg-8 col-xl-8">Description</th>
                                <th className="col-md-4 col-lg-4 col-xl-4">Done</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.todoTableRows(true)}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        );
    }
}
