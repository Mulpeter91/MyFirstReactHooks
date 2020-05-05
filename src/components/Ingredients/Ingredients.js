import React, { useReducer, useState, useEffect, useCallback } from 'react'; 
//useReducer has no connection to the Redux library
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModel from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET' :
      return action.ingredients;
    case 'ADD' :
      return [...currentIngredients, action.ingredient];
    case 'DELETE' :
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND': 
      return { loading: true, error: null};
    case 'RESPONSE':
      return { ...currentHttpState,loading: false}
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR':
      return {...currentHttpState, error: null}
    default:
      throw new Error('Should not be reached!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

  //custom hook alternative
  //const { isLoading, error, data, sendRequest } = useHttp();

  //const [userIngredients, setUserIngredients ] = useState([]);
  //const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();

  //useEffect is to handle side-effects, such as an API. 
  //so you have some logic that does effect your application but is not in your render flow
  //this function always runs AFTER EVERY render cycle
  //moved function to search component
  // useEffect(() => {
  //   fetch('https://react-hooks-a32e8.firebaseio.com/ingredients.json').then(
  //     response => response.json()
  //   ).then(responseData => {
  //     const loadedIngredients = [];
  //     for (const key in responseData) {
  //       loadedIngredients.push({
  //         id: key, 
  //         title: responseData[key].title, 
  //         amount: responseData[key].amount
  //       });
  //     }
  //     setUserIngredients(loadedIngredients);
  //   });
  //   // to stop infinite loops, you pass a second object to useEffect containing the function depedencies, 
  //   // and only when they change is a re-render triggered. 
  // }, []); //an empty array is like a componentDidMount <- renders once

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]); // so this useEffect will run if userIngredients is updated

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

  const clearError = () => {
    //setError(null);
    dispatchHttp({type: 'CLEAR'});
  }

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    //setUserIngredients(filteredIngredients);
    dispatch({
      type: 'SET', 
      ingredients: filteredIngredients
    })
  }, []); //this function will now be cached rather than being called every time -> triggering infinit loops on chilc components

  const addIngredientHandler = ingredient => {
    //setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hooks-a32e8.firebaseio.com/ingredients.json', {
      method: 'POST', 
      body: JSON.stringify(ingredient), 
      headers: { 'Content-type': 'application/json'}
    }).then(response => {
      //setIsLoading(false);
      dispatchHttp({type: 'RESPONSE'});
      return response.json();      
    }).then(responseBody => {
      dispatch({
        type: 'ADD', 
        ingredient: {id: responseBody.name, ...ingredient}
      });
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients, 
      //   {id: responseBody.name, ...ingredient}
      // ]);
    });
  };

  const removeIngredientHandler = useCallback(ingredientId => {
    //setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    fetch(`https://react-hooks-a32e8.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      //setIsLoading(false);
      dispatchHttp({type: 'RESPONSE'});
      // setUserIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({
        type: 'DELETE', 
        id: ingredientId
      });
    }).catch(error => {
      //these two state updates are batched together by React, so it only re-renders ONCE, rather than both times
      //setError('something went wrong!');      
      //setIsLoading(false);
      dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong'});
    });    
  }, []);

  return (
    <div className="App">
      {httpState.error && <ErrorModel onClose={clearError}>{httpState.error}</ErrorModel>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
