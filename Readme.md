# USE-AJAX-REQUEST

Use-ajax-request is a javascript library capable of sending http requests to a server. It was built with the aim of aiding react-js developers managel less state when they want to send/get data from a server. This hook manages the **data** recieved from the response, the **error** recieved from the response, the **funtion** to be called inorder to send the http request and the **isLoading** state to verify if the request is still or is done loading.

## Instalation

To install this package run `npm install use-ajax-request` **OR** `yarn add use-ajax-request`
To install this a specific version run `npm install use-ajax-request@version` **OR** `yarn add use-ajax-request@version`. Replace _version_ with the package version **e.g 1.0.0**

## How to use the package

**N.B: To use this package you MUST have react, react-dom and axios installed**
Import the package

```javascript
import useAjaxRequest from "use-ajax-request";
```

Assign the hook to a constant variable (You can also destructure the variable).
The useAjaxRequest hook always returns an object containing

```javascript
{
     data: String,
    loading: Boolean,
    error: Boolean,
    sendRequest: Function
}
```

Therefore we can destructure it like this:

```javascript
const { data, loading, error, sendRequest } = useAjaxRequest();
```

But before we go further the useAjaxRequestHook takes in an object which **MUST** be supplied. I.e

```javascript
{
    instance: Function /* Axios instance or axios function */,
    options: {
    url: String,
    method: String,
    headers: Object,
    //...other axios properties
    }
}
```

The `instance` **MUST** contain either an axios instance **OR** an axios function, because that's going to be used to send the http request.
The `options` contains the properties of the request, e.g: headers, url, method, etc...

After doing all these we should now have this in our code:

```javascript
import useAjaxRequest from "use-ajax-request";

const { loading, data, sendRequest, error } = useAjaxRequest({
  instance: axios,
  options: {
    url: "https://somedomain.com/route",
    method: "GET",
  },
});
```

Then we execute the sendRequest function anytime we want to trigger the request.
E.g

```javascript
sendRequest();
```

Let's try calling it from a `useEffectHook`:

```javascript
useEffect(() => {
  sendRequest();
}, []);
```

Sometimes it may require us to add the `sendRequest` function as a dependency in the array, in that case we would have to wrap the parameters we are passing into `useAjaxRequest` with a `useMemo()` hook to avoid an infinite loop. I.e:

```javascript
import useAjaxRequest from "use-ajax-request";

const { loading, data, sendRequest, error } = useAjaxRequest(
  useMemo(() => {
    return {
      instance: axios,
      options: {
        url: "https://somedomain.com/route",
        method: "GET",
      },
    };
  }, [])
);

useEffect(() => {
  sendRequest();
}, [sendRequest]);
```

The `data` variable holds the result of the response if it encounted no errors:

```javascript
console.log(data);
//False if no data else response data
```

The `error` variable holds the error of the request if it encounted an error, it returns false if they were no errors:

```javascript
console.log(error);
//False if no error else request error
```

The `loading` variable returns the state of the request, True if it's still ongoing, false if it's done:

```javascript
console.log(loading);
//False if done loading else request True
```

Then you can add some JSX code to verify if it's working correctly:

```javascript
return (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>There was an error</p>
      ) : !data ? (
        <p>No movies available</p>
      ) : (
        data?.results?.map((eachMovie) => (
          <div key={eachMovie?.episode_id}>
            <p>
              <b>Title:</b> {eachMovie?.value}
            </p>
            <p>
              <b>Episode:</b> {eachMovie?.value}
            </p>
            <p>
              <b>Opening:</b> {eachMovie?.value}
            </p>
            <p>
              <b>Date released:</b>
              {new Date()?.toUTCString()}
            </p>
          </div>
        ))
      )}
    </header>
  </div>
);
```

At the end our code should look like this:

```javascript
import logo from "./logo.svg";
import "./App.css";
import useAjaxRequest from "use-ajax-request";
import { useEffect, useMemo } from "react";
import axios from "axios";

function App() {
  const { loading, data, sendRequest, error } = useAjaxRequest(
    useMemo(() => {
      return {
        instance: axios,
        options: {
          url: "https://swapi.dev/api/films",
          method: "GET",
        },
      };
    }, [])
  );
  error && console.log("ERROR", error);

  useEffect(() => {
    sendRequest();
  }, [sendRequest]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>There was an error</p>
        ) : data?.results?.length < 1 ? (
          <p>No movies available</p>
        ) : (
          data?.results?.map((eachMovie) => (
            <div key={eachMovie?.episode_id}>
              <p>
                <b>Title:</b> {eachMovie?.title}
              </p>
              <p>
                <b>Episode:</b> {eachMovie?.episode_id}
              </p>
              <p>
                <b>Opening:</b> {eachMovie?.opening_crawl}
              </p>
              <p>
                <b>Date released:</b>
                {new Date(eachMovie?.release_date)?.toUTCString()}
              </p>
            </div>
          ))
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

**N.B:** We can also add onSuccess or onError functions, which will be called if we recieve a successfull response or we recieve an error respectively. E.g:

```javascript
const onSuccess = () => {
  // ...perform something
};
const onError = () => {
  // ...perform something
};

useEffect(() => {
  sendRequest(onSuccess, onError);
}, [sendRequest]);
```

In order to pass a parameter to the respective functions we just need to add the `.bind()` function to them:

```javascript
useEffect(() => {
  sendRequest(
    onSuccess.bind(null, parameter1, parameter2),
    onError.bind(null, parameter1, parameter2)
  );
}, [sendRequest]);
```

More features will be added to it in the future. Thank you.
Please if you like it star the github repo or fork it. Thanks
[useAjaxRequest Repo](https://github.com/onukwilip/use-ajax-hook.git)
