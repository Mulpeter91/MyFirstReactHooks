import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);

  //useEffect is to handle side-effects, such as an API. 
  //so you have some logic that does effect your application but is not in your render flow
  //this function always runs AFTER EVERY render cycle
  useEffect(() => {
    fetch('https://react-hooks-a32e8.firebaseio.com/ingredients.json').then(
      response => response.json()
    ).then(responseData => {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key, 
          title: responseData[key].title, 
          amount: responseData[key].amount
        });
      }
      //setUserIngredients(loadedIngredients);
    });
  });

  // this code block would cause an infinite loop: it's inside of render which triggers when state update and around it goes 
  // fetch('https://react-hooks-a32e8.firebaseio.com/ingredients.json').then(
  //   response => response.json()
  // ).then(responseData => {
  //   const loadedIngredients = [];
  //   for (const key in responseData) {
  //     loadedIngredients.push({
  //       id: key, 
  //       title: responseData[key].title, 
  //       amount: responseData[key].amount
  //     });
  //   }
  //   setUserIngredients(loadedIngredients);
  // });


  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-a32e8.firebaseio.com/ingredients.json', {
      method: 'POST', 
      body: JSON.stringify(ingredient), 
      headers: { 'Content-type': 'application/json'}
    }).then(response => {
      return response.json()      
    }).then(responseBody => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        {id: responseBody.name, ...ingredient}
      ]);
    });
  };

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={() => {}}/>
      </section>
    </div>
  );
}

export default Ingredients;
