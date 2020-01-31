import React, { Component } from 'react';
import posed from 'react-pose';
import './App.css';

// Next steps:
// Clear this.state.result when new operation is selected
// User validation & error messages
    // do not use capital letters
// Create guide to symbols & formatting
// Add description for each operation
// Separate library for fetchResults function ("newton.js" to import later)
// Work on layout/UI - spacing, describe ops for user, styling, examples

const Animated = posed.div({
  hoverable: true,
  init: { scale: 1 },
  hover: { scale: 1.1 },
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //to track when results from API have loaded
      isLoaded: false,
      operation: "",
      expression: "",
      result: "",
      error: {}
    }
    this.onChange = this.onChange.bind(this);
    this.fetchResult = this.fetchResult.bind(this);
  }

  onChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    }, () => {
      this.fetchResult();
    });
    console.log(this.state);
  }

    //Separate into another library to import later
  //Function takes operation + expression (given by user):
  // 1) URL encode expression
  // 2) build URL
  fetchResult() {
    console.log("this.state.operation", this.state.operation)
    console.log("this.state.expression", this.state.expression)
    const encodedExpr = encodeURI(this.state.expression.toLowerCase()); //take user input & encode expression into URL format
    const url = `https://newton.now.sh/${this.state.operation}/${encodedExpr}`
    fetch(url) 
      .then(res => res.json())    //turn results to JSON obj
      .then(({ operation, expression, result }) => {     //We use arrow function to unbind 'this', so 'this' refers to the instance of UserInput object as defined above 
        this.setState({
          isLoaded: true,
          result
        })
      })
      .catch((error) => this.setState({ error }))
  }

  render() {
    const { operation, expression, result, error } = this.state;
    console.log(error);
    return (
      <div>
        <div class="container"> 
          <h1 className="title is-1" id="logo"> Ming Newton </h1>
          <h2 className="title is-3"> Calculator for all of your advanced math needs. </h2> 
          <div className="columns is-mobile is-marginless is-paddingless">
            <div className="column is-4">
              {/* Select operator, onChange updates state */}
              <label className="label"> Operator: </label>
              <div className="select"> 
                <Animated>
                  <select onChange={this.onChange} className="is-focused is-large" name="operation">
                    <option>Choose operator</option>
                    <option value="simplify">Simplify</option>
                    <option value="factor">Factor</option>
                    <option value="derive">Derive</option>
                    <option value="integrate">Integrate</option>
                    <option value="zeroes">Find 0's</option>
                    <option value="tangent">Find Tangent</option>
                    <option value="area">Area Under Curve</option>
                    <option value="cos">Cosine</option>
                    <option value="sin">Sine</option>
                    <option value="tan">Tangent</option>
                    <option value="arccos">Inverse Cosine</option>
                    <option value="arcsin">Inverse Sine</option>
                    <option value="arctan">Inverse Tangent</option>
                    <option value="abs">Absolute Value</option>
                    <option value="log">Logarithm</option>
                  </select>
                </Animated>
              </div>
            </div>
            <div className="column is-8">
              <label className="label"> Expression: </label> 
              {/* Input expression: user types expression, onChange updates state */}
              <input onChange={this.onChange} className="input is-info is-hovered" name="expression" type="text" placeholder="Enter what you want to calculate"
              />

            </div>
          </div>
          <div className="results is-paddingless">
            {operation === "" && expression === "" ? "" : this.resultWithData()}
          </div>
        </div>
      </div>
    )
  }

  resultWithData(){
    const { operation, expression, result, error } = this.state
    return(
      operation !== "" && expression === "" ? "Enter an expression to derive" : 
      <div>
      {/* results div  */}
      {/* make display results conditional as long as no error */}
      {operation} {' '}
      {expression} <strong> =
       {result} </strong> 
      {/* give user more specific info about error */}
      {/* {error ? error : ""}  */}
      </div>
    )
  }
}

export default App;