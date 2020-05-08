import React, {Component} from 'react';
import './App.css';

import firebase from "./firebase";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: "Marta",
            todoItems: [
                {action: "Run dishwasher", done: false},
                {action: "Water plants", done: false},
                {action: "Listen to Daily Cogito", done: false}
            ],
            nextItemText: ""
        }
    }

    updateNewTextValue = (event) => {
        this.setState({newItemText: event.target.value});
    }

    isValidInputText = (text) => {
        return text !== undefined && text.trim() !== "";
    }

    createNewTodo = () => {
        const db = firebase.firestore();
        let text = this.state.newItemText;

        if (this.isValidInputText(text) && !this.state.todoItems.find(item => item.action === text)) {
            db.collection("react-to-watch-list").doc(text).set({
                item: text,
                done: false,
                added: firebase.firestore.Timestamp.fromDate(new Date())
            });

            this.setState({
                todoItems: [...this.state.todoItems, {action: text, done: false}],
                nextItemText: ""
            });
        }
    }

    toggleTodo = (todo) => this.setState({
        todoItems: this.state.todoItems.map(item => item.action === todo.action ? {...item, done: !item.done} : item)
    });

    todoTableRows = () => this.state.todoItems.map(item =>
        <tr key={item.action}>
            <td>{item.action}</td>
            <td><input type="checkbox" checked={item.done} onChange={() => this.toggleTodo(item)}/></td>
        </tr>
    )

    render() {
        return (
            <div>
                <h4 className="bg-primary text-white text-center p-2">{this.state.userName}'s To Do List
                    ({this.state.todoItems.filter(t => !t.done).length} items to do)</h4>
                <div className="container-fluid">
                    <div className="my-1">
                        <input className="form-control" value={this.state.newItemText}
                               onChange={this.updateNewTextValue}/>
                        <button className="btn btn-primary mt-1" onClick={this.createNewTodo}>Add</button>
                    </div>
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <th>Description</th>
                            <th>Done</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.todoTableRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default App;
