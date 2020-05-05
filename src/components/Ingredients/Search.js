import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
 const { onLoadIngredients } = props;
 const [enteredFilter, setEnteredFilter] = useState('');
 const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value){
        const query = enteredFilter.length === 0 
        ? '' 
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-a32e8.firebaseio.com/ingredients.json' + query).then(
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
        onLoadIngredients(loadedIngredients);
      });
      }     
    }, 500); //<-- only making a call if the user stops typing for 500 miliseconds
    return () => {
      clearTimeout(timer);
    }; //this is cleanup return fuction for useEffect, it runs before the function body only AFTER the first call 
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={enteredFilter} onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
