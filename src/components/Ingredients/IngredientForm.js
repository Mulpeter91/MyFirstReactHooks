import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo(props => {
  //unlike component state it doesn't have to be an object. Can be a simlpe data type
  //useState returns an array of two elements. 1st is either the initial state or the updated state if changed. 2nd is a function to allow you to update state
  //this is implementing array destructuring
  //const [ inputState, setInputState ] = useState({title: '', amount: ''});
  const [ enteredTitle, setEnteredTitle ] = useState('');
  const [ enteredAmount, setEnteredAmount ] = useState('');

  // you must only use hooks inside functional components
  // you must use the hook on the root component
  // you also can't use them inside conditions 

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title"            
            //value={inputState.title} 
            value={enteredTitle}
            onChange={event => {
              //const newTitle = event.target.value;              
              // setInputState((prevInputState) => ({
              //   title: newTitle, 
              //   amount: prevInputState.amount
              // }))
              setEnteredTitle(event.target.value)
            }}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" 
            value={enteredAmount}
            onChange={event => {
              setEnteredAmount(event.target.value)
            }}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading ? <LoadingIndicator /> : null}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
