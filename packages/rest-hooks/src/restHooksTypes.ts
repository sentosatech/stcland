import { QueryFunctionContext, UseQueryOptions } from '@tanstack/react-query';
import {
  AxiosStatic, AxiosResponse, AxiosInstance, AxiosRequestConfig
} from 'axios'


export namespace StcRest {

  export interface RestQueryOptions extends Omit<UseQueryOptions,
    'queryFn' | 'queryKey'> // Taken care of internally
  {
    op: string
      // The operation being performed, for informative error messaging
      // For examlpe: "Fetching users"
    baseUrl?: string
      // base url for the query (if not provided default rest client url will be used)
    defaultResponse?: any
      // Will be returned as results when query returns `undefined`
    resultsPropName?: string
      // Include a prop in the results object that references the response data
    transformFn?: (data: any) => any
      // Transform the response data before returning
    restParams?:  RestParams
      // Path and query params to be applied to the query
      // eg: {
      //   pathParams: { id: 123 },
      //   queryParams: { paginate: true, page: 2 }
      //  }
  }

  /*
    Defines properties of a rest server to be accessed by the rest client.
  */
  export interface ServerConfig {
    defaultBaseUrl?: string;
      // The default base URL for REST actions.
      // This will be used if no URL is provided for REST actions.
      // It can be overridden with an axios config object `{ baseURL }`.
      // Example: "http://localhost:8888"
    timeout?: number;
      // Timeout period for requests in milliseconds. Default is 1000 ms.
  }

  /**
    Defines properties of a client configuration for REST interactions.
  */
  export interface ClientConfig {
    verbose?: boolean;
      // Flag indicating if REST interactions should be logged to the console.
    responsePostProcessorFn?: (rsp: AxiosResponse) => AxiosResponse;
      // Optional function to apply to the raw response before returning.
      // This function takes the raw `AxiosResponse` and returns the processed `AxiosResponse`.
    getAccessToken?: () => string;
      // Optional function to call to get the access token for the current user.
      // If not provided, the client will not add an access token to requests.
  }

  /**
   A type representing a REST client that includes methods for various HTTP actions
  and configurations.

  This type combines selected HTTP methods from `AxiosStatic` with additional
  properties and functions tailored for use with react-query.
  */
  export type RestClient =
    Pick<AxiosStatic, 'get' | 'post' | 'put' | 'patch' | 'delete'> & {
      // Standard axios methods
    clientConfig: ClientConfig;
      // the client side configuration used by this client
    serverConfig: ServerConfig;
      // the server side configuration used by this client
    axiosClient: AxiosInstance;
      // the axios client used by this rest client

    // The following functions create custom REST actions that can be
    // passed directly into react-query hooks
    createGetFn: CreateGetFn;
    createPostFn: CreatePostFn;
    createPutFn: CreatePutFn;
    createPatchFn: CreatePatchFn;
    createDeleteFn: CreateDeleteFn;
  };

  /**
    Function to be called to creates a REST client.
  */
    export type CreateRestClient = (
      clientConfig: ClientConfig,
        // Includes options such as access token getters and response post-processor.
      serverConfig: ServerConfig
        // Includes options such as the server base URL and request timeout.
    ) => RestClient;

  /**
    Object for representing path variables in REST paths.
    where the REST path uses `:variableToSubstitute` syntax.
      `key` represents the variable name w/in the pathtargeted for substitution.
      `value` represents the value to be substituted into the path variable.

    Example:
      For a path /things/:id, and pathParams = { id: 22 }
      The substitution results in path /things/22
  */
  export type PathParams = {
    [key: string]: string | number;
  };

  /**
   Object or string for representing query parameters  REST paths.

  As an object:

    Specifies a set of query parameters within REST query strings.
      `key`: Represent variable parameter names to add to the query string.
      `values`: Associated values to add to the query string.
    Example
      { smile: true, grumpy: false }
      Represents /somepath?smile=true&grumpy=false

    As a string:

      Raw string representing the query string.
      Example
        "?smile=true&grumpy=false"
        Represents /somepath?smile=true&grumpy=false
  */
  export type QueryParams =
    { [key: string]: string | number | boolean }
    | string;

  /**
    Represents path and query parameters for constructing REST API requests.
  */
  export type RestParams = {
    pathParams?: PathParams;
      // eg: { id: 123 } for substitution in `/users/:id`
    queryParams?: QueryParams;
      // eg: { paginate: true, page: 2 } for "/somepath?paginate=true&page=2"
  };

  /**
    A function that performs a REST GET request, specifically meant to be
    provided as the `queryFn` option for react-query `useQuery` hook.

    It is assumed that the function internally knows the path to the REST endpoint.

    example const getFn = () => axios.get('/api/user')
  */
  export type GetFn = (
    queryContext?: QueryFunctionContext
      // The context object provided by react-query for the query function.
      // It's use by the Get Fn is optoinal.
  )
  => Promise<AxiosResponse>;

  /**
    Creates a function that performs a REST GET request for specified path and rest params
    The returned function can be passed directly into 'react-query' query hooks.

    Examples:
      const getThings = createGetFn("/things")
      const things = await getThings() //=> GET /things

      const getThing1 = createGetFn("/things/1")
      const thing1 = await getThing1() //=> GET /things/1

      const getThing2 = createGetFn("/things/1?version=2")
      const thing2 = await getThing1() //=> GET /things/1?version=2

      const getThing1WithParams = createGetFn("/things/:id")
      const thing3 = await getThing1WithParams({
        pathParams: { id: 123 },
        queryParams: { hydrate: true }
      }); //=> GET /things/123?hydrate=true

    */
  export type CreateGetFn = (
    restPath: string,
      // Path to the REST endpoint (including query parameters if desired)
      // Can contain path variables in the form of `:variableToSubstitute`.
    restParams?: RestParams,
      // Optional path and query parameters for the REST call.
    axiosOptions?: Partial<AxiosRequestConfig>
      // Optional Axios request configuration.
    ) => GetFn;

  
  /**
    Options passed into the {@link MutateFn}.
  */
  export interface MutateFnOptions {
    data: unknown;
      // The parameters for the mutation operation.
    restParams?: RestParams;
      // restParams.pathParams - For path variable substitutions.
      // restParams.queryParams - Optional path and query params for the REST call.
  }

  /**
    Function that performs a REST mutation (create or update) for specified path and rest params.
    This function can be passed into 'react-query' mutation hooks.
   
    See {@link MutateFnOptions} for details on the available options.
   */
  export type MutateFn = (
    options: MutateFnOptions
      // A promise containing the results of the mutation.
  ) => Promise<AxiosResponse>;

  /**
    Creates a function that performs a mutation request (POST, PUT, PATCH) to the specified REST path.
    @see {@link MutateFn} for details on the returned function.
   
    Examples:
    // Creating a mutation function
    const createThing = restClient.createMutateFn("/things");

     // Using the mutation function
      const response = await createThing({
        data: { name: "New Thing" },
        restParams: { queryParams: { validate: true } }
       });
     // With path variables
     const updateThing = restClient.createMutateFn("/things/:id");
   
     const response = await updateThing({
      data: { name: "Updated Thing" },
      restParams: {
        pathParams: { id: 123 },
        queryParams: { version: 2 }
      }
     });
   */
  export type CreateMutateFn = (
    restPath: string,
      // Path to the REST endpoint.
      // Can contain path substitution variables in the form of `/path/:variableToSubstitute`.
    axiosOptions?: Partial<AxiosRequestConfig>
      // Optional Axios request configuration.
      // @see {@link https://axios-http.com/docs/req_config|Axios documentation} for available options.
  ) => MutateFn;

  /**
    Creates a function that performs a REST POST request to the specified path.
    @see {@link CreateMutateFn} for details about the base function.
   
    Example:
      const createThing = createPostFnOrig("/things/:bucket")
   
      const newThing = await createThing({ thing: 'data' }, {
          pathParams: { bucket: 'blueThings' },
          queryParams: { smile: true }
        }
      )
      => Request POST /things/blueThings?smile=true
        Body { thing: 'data' }
   */
  export type CreatePostFn = CreateMutateFn;

  /**
    Creates a function that performs a REST PUT request to the specified path.
    @see {@link CreateMutateFn} for details about the base function.
   
      Examples:
      const updateThing1 = createPutFn("/things/1")
      const updatedThing1 = await updateThing1({ thing: 'updates' })
       => Request PUT /things/1
         Body { thing: 'updates' }
   
      const updateThing2 = createPutFn("/things/:thingId")
      const updatedThing2 = await updateThing2(
        { thing: 'updates' },
        {
          pathParams: { thingId: 2 },
          queryParams: { smile: true }
        }
      )
       => Request PUT /things/2?smile=true
         Body { thing: 'updates' }
   */
  export type CreatePutFn = CreateMutateFn;

  /**
    Creates a function that performs a REST PATCH request to the specified path.
     @see {@link CreateMutateFn} for details about the base function.
   
    Examples:
      const updateThing1 = createPatchFn("/things/1")
      const updatedThing1 = await updateThing1({ thing: 'updates' })
       => Request PATCH /things/1
         Body { thing: 'updates' }
   
      const updateThing2 = createPatchFn("/things/:thingId")
      const updatedThing2 = await updateThing2({ thing: 'updates' }, {
          pathParams: { thingId: 2 },
          queryParams: { smile: true }
        }
      )
       => Request PATCH /things/2?smile=true
         Body { thing: 'updates' }
   */
  export type CreatePatchFn = CreateMutateFn;

  /**
    A function that performs a REST DELETE request.
    This function can be passed into 'react-query' mutation hooks.
    Returns a promise containing the response to the delete request.
   */
  export type DeleteFn = (
    restParams: RestParams
      // The path and query parameters to be used for the REST call.
  ) => Promise<AxiosResponse>;

  /**
    Creates a function that performs a REST DELETE request to the specified path.
    @see {@link DeleteFn} for details on the returned function.
   
    Example:
      const deleteThing = createDeleteFn("/things/:id")
      await deleteThing({ pathParams: { id: 123 } })
      => Request DELETE /things/123
   */
  export type CreateDeleteFn = (
    restPath: string,
      // Path to the REST endpoint.
      // Can contain path substitution variables in the form of `/path/:variableToSubstitute`.
    axiosOptions?: Partial<AxiosRequestConfig>
      // Optional Axios request configuration.
      // @see {@link https://axios-http.com/docs/req_config|Axios documentation} for available options.
  ) => DeleteFn;
}
