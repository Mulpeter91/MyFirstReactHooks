import {useReducer, useCallback} from 'react';

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
      case 'SEND': 
        return { loading: true, error: null, data: null};
      case 'RESPONSE':
        return { ...currentHttpState,loading: false, data: action.responseData}
      case 'ERROR':
        return { loading: false, error: action.errorMessage }
      case 'CLEAR':
        return {...currentHttpState, error: null}
      default:
        throw new Error('Should not be reached!');
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, 
        {
            loading: false, 
            error: null,
            data: null
        });

    const sendRequest = useCallback((url, method, body) => {
        dispatchHttp({type: 'SEND'});
        fetch(url, 
          {
            method: method, 
            body: body, 
            header: {
                'Context-Type': 'application/json'
            }
          })
          .then(response => {
            return response.json();
          })
          .then(responseData => {
            dispatchHttp({type: 'RESPONSE', responseData: responseData});
          })
          .catch(error => {
            dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong'});
          });   
    }, []);    

    //can return whatever you like
    return {
        isLoading: httpState.loading, 
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest
    };
};

export default useHttp;

//called with sendRequest