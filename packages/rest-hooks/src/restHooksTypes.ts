import type { QueryFunctionContext, UseQueryOptions, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import type {
  AxiosStatic, AxiosResponse, AxiosInstance, AxiosRequestConfig
} from 'axios'


export namespace StcRest {

  export interface UseRestQueryOptions<TDefaultResponse> extends Omit<UseQueryOptions,
    'queryFn' | 'queryKey'> // Taken care of internally
  {
    op: string
      // The operation being performed, for informative error messaging
      // For examlpe: "Fetching users"
    resultsPropName: string
      // Include a prop in the results object that references the response data
    defaultResponse: TDefaultResponse
      // Will be returned as results when query returns `undefined`
    baseUrl?: string
      // base url for the query (if not provided default rest client url will be used)
    transformResult?: (rsp: any) => any
      // Transform the data referenced by resultsPropName before returning
      // Note: this will be appliaed to the data selected by the `pickResults` function
    pickResults?: (rsp: any) => any
      // * Function to grab the data from the response, that will be referenced by resultsPropName
      // * if you are using useQuery `select` option, this function is applied to the
      //   outcomed of the `select` function
      // * If not supplied, default function will pick useQueryRsp.data
    pickMeta?: (rsp: any) => any
      // * Function to grab the meta from the response
      // * If you are using useQuery `select` option, this function is applied to the
      //   outcomed of the `select` function
      // * If not supplied, meta will be udefined
    pathParams?: PathParams
      // Path values to be applied to path variables in the query
      // eg: { id: 123 } for substitution in `/users/:id`
    queryParams?: QueryParams
      // Query values to be applied to the query
      // eg: { paginate: true, page: 2 } for "/somepath?paginate=true&page
      // restParams?:  RestParams
  }

  export type UseRestQueryResult<
    TData,
    TDefaultResponse = TData,
    TMeta = any,
    TResultsName extends string = string
  > = UseQueryResult<any> & {
    meta?: TMeta | undefined;
  } & {
    [key in TResultsName]: TData | TDefaultResponse;
  };

  export type UseRestQuery = <TData, TDefaultResponse = TData, TMeta = any>(
    restClient: RestClient,
      // The REST client to use for the query
    queryKey: [any],
      // The key to use for the query
    restPath: string,
      // The path to the REST endpoint
    options: UseRestQueryOptions<TDefaultResponse>
      // Options for the query
  ) => UseRestQueryResult<TData, TDefaultResponse, TMeta>

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
    createGetFn: CreateGetFnOld;
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

    Example:
    ```
    const getFn = () => axios.get('/api/user')
    ```
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
    ```
    const getThings = createGetFn('/things')
    const things = await getThings() //=> GET /things

    const getThing1 = createGetFn('/things/1')
    const thing1 = await getThing1() //=> GET /things/1

    const getThing2 = createGetFn('/things/1?version=2')
    const thing2 = await getThing1() //=> GET /things/1?version=2

    const getThing1WithParams = createGetFn('/things/:id')
    const thing3 = await getThing1WithParams({
      pathParams: { id: 123 },
      queryParams: { hydrate: true }
    }) //=> GET /things/123?hydrate=true
     ```
  */

  export interface CreateGetFnOptions {
    restParams?: RestParams;
      // Optional path and query parameters for the REST call.
    axiosOptions?: Partial<AxiosRequestConfig>;
      // Optional Axios request configuration.
  }

  export type CreateGetFn = (
    restPath: string,
      // Path to the REST endpoint (including query parameters if desired)
      // Can contain path variables in the form of `:variableToSubstitute`.
    options?: CreateGetFnOptions
      // Optional path and query parameters for the REST call.
    ) => GetFn;

  export type CreateGetFnOld = (
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
    data?: unknown;
      // The parameters for the mutation operation.
    restParams?: RestParams;
      // restParams.pathParams - For path variable substitutions.
      // restParams.queryParams - Optional path and query params for the REST call.
  }

  /**
    Function that performs a REST mutation (create or update) for specified path and rest params.
    This function can be passed into 'react-query' mutation hooks.
   */
  export type MutateFn = (
    options?: MutateFnOptions
      // A promise containing the results of the mutation.
  ) => Promise<AxiosResponse>;

  /**
    Creates a function that performs a mutation request (POST, PUT, PATCH) to the specified REST path.

    Examples:
    ```
     // Creating a mutation function
    const createThing = restClient.createMutateFn('/things')

    // Using the mutation function
    const response = await createThing({
      data: { name: 'New Thing' },
      restParams: { queryParams: { validate: true } }
    })
    // With path variables
    const updateThing = restClient.createMutateFn('/things/:id')

    const response = await updateThing({
      data: { name: 'Updated Thing' },
      restParams: {
        pathParams: { id: 123 },
        queryParams: { version: 2 }
      }
    })
    ```
   */
  export type CreateMutateFn = (
    restPath: string,
      // Path to the REST endpoint.
      // Can contain path substitution variables in the form of `/path/:variableToSubstitute`.
    axiosOptions?: Partial<AxiosRequestConfig>
      // Optional Axios request configuration.
  ) => MutateFn;

  /**
    Creates a function that performs a REST POST request to the specified path.

    Example:
    ```
    const createThing = createPostFnOrig('/things/:bucket')
    const newThing = await createThing({ thing: 'data' }, {
      pathParams: { bucket: 'blueThings' },
      queryParams: { smile: true }
    }
    )
    //=> Request POST /things/blueThings?smile=true
    //  Body { thing: 'data' }
    ```
   */
  export type CreatePostFn = CreateMutateFn;

  /**
    Creates a function that performs a REST PUT request to the specified path.

    Examples:
    ```
    const updateThing1 = createPutFn('/things/1')
    const updatedThing1 = await updateThing1({ thing: 'updates' })
    //=> Request PUT /things/1
    //  Body { thing: 'updates' }

    const updateThing2 = createPutFn('/things/:thingId')
    const updatedThing2 = await updateThing2(
      { thing: 'updates' },
      {
        pathParams: { thingId: 2 },
        queryParams: { smile: true }
      }
    )
    // => Request PUT /things/2?smile=true
    //   Body { thing: 'updates' }
    ```
   */
  export type CreatePutFn = CreateMutateFn;

  /**
    Creates a function that performs a REST PATCH request to the specified path.

    Examples:
    ```
    const updateThing1 = createPatchFn('/things/1')
    const updatedThing1 = await updateThing1({ thing: 'updates' })
    //=> Request PATCH /things/1
    // Body { thing: 'updates' }

    const updateThing2 = createPatchFn('/things/:thingId')
    const updatedThing2 = await updateThing2({ thing: 'updates' }, {
      pathParams: { thingId: 2 },
      queryParams: { smile: true }
    }
    )
    // => Request PATCH /things/2?smile=true
    // Body { thing: 'updates' }
    ```
   */
  export type CreatePatchFn = CreateMutateFn;

  /**
    Creates a function that performs a REST DELETE request to the specified path.

    Example:
    ```
    const deleteThing = createDeleteFn('/things/:id')
    await deleteThing({ pathParams: { id: 123 } })
    //=> Request DELETE /things/123
    ```
   */
  export type CreateDeleteFn = CreateMutateFn


  /*
  All of the mutate hooks return a standard react-query useMutation() object

  The returned object will include the standard use-query mutation functions
  mutate and mutateAsync (which can be given custom names via options)

  All of the returned mutation functions recieve an optional last argument
  `params` (see documentation for each specific hook). The param object allows
  path paramaters and query options to be provided as follows

  params {
    pathParams {
        keys: values
        * keys: variables in the path name that will be substituted
        * values: string | number, values that will be substitued in the path
      }
    queryParams {
      keys: values // for query string to be appended
      * keys: query paramater variable names
      * values: query paramater variable values (string, number or bool)
    }
    -or-
    queryParams:
      string: will be appended directly to the request usrl
  }

  An options object can be supplied to the mutation functions, which can include
  any of the standard react-query useMutation() options

  In addition, the following options can also be included

  options: {

    mutationFnName: string
    * response object will include fxns providedFnName amd providedFnNameAsync
      which reference the stnadard react-query mutation functions

    baseUrl: string
    * optional - the base URL to use for the mutation query

    navigate: () => void
    * trigger redirect after on success.

    toastFn: (message: string) => void
    * trigger toast selected by client when on success

    onSuccess: { // as object
      cachesToAddTo: ['cachId' | [cacheId]] // list of standard react-query cache ID
      * add the entity as a new cache entry on success
      * currently NYI TODO: implement (some complications getting queryFn fetchQuery  )

      cachesToInvalidate [ 'cachId' | [cacheId] ] // list of standard react-query cache ID
      * list of caches to invalidate on success

      cachesToRemove [ 'cachId' | [cacheId] ]
      * list of standard react-query cache ID

      actions []
      * list of functions to perform

      toastMessage: string
      * Passed to the toasFn base option.

      routeTo: string
      * Passed to the navigateFn base option.

    }
    -or-
    onSuccess: // as func
      called with create/updated/deleted passed in when op is succesful

    onError: {
      navigate: () => void
      * trigger redirect after on error.

      toastMessage:
      * Passed to the toasFn base option.
    }
    -or-
    onError: // as func
      called with error passed in when op is fails
  }

  Advanced Options Usage

  * cacheId / routeTo as functions

    For any option functions that recieves `cacheId` or `routeTo` as inputs,
    these may be functions

    The functions sill be passed the entity that was created/updated/deleted,
    and is expected to return the approrate cache id or route

    This can be useful if you need to construct a route or cacheId in real time
    that is dependent upon the entity being operated upon

    example
      const cacheId = newEntitiy => `[entities, newEntity.id]`
      const routeTo = newEntitiy => `/entities/${newEntity.id}`
  }
*/

/*
  Returns react-query mutation object, which includes the standard react-query
  mutation functions to create an entity, and which have the following signatures

  mutate({ data, params })
    returns created data

  mutateAsync({ data, params })
    return promise which resolves to created data

  The mutation function names can be customized via options: { mutationFnName }
    example options: { mutationFnName: createThing }
*/
  export type UseRestMutate = <TData = unknown, TVariables = unknown, TError = unknown>
  (mutateFn: (restPath: string, options?: AxiosRequestConfig) => (variables: TVariables) =>
    Promise<TData>, restPath: string, options?: StcRest.MutateBaseProps['options']) =>
      UseMutationResult<TData, TError, TVariables>

  type Action = () => void
  export type ActionsList = Action[]

  export type MutationOptions = {
      cachesToAdd?: any[][]
      cachesToInvalidate?: any[][]
      cachesToRemove?: any[][]
      actions?: ActionsList
      routeTo?: string
      toastMessage?: string
  }

  export type OnSucessOptions = MutationOptions
  export type OnErrorOptions = Pick<MutationOptions, 'toastMessage'>
  export type OnMutateOptions = Pick<MutationOptions, 'cachesToAdd' | 'cachesToRemove' | 'cachesToInvalidate'>

  export interface MutateBaseProps {
    mutateFn: CreatePostFn | CreatePutFn | CreateDeleteFn | CreatePatchFn
    options: {
      mutationFnName?: string
      onSuccess?: OnSucessOptions | (()=> void)
      onError?: OnErrorOptions | (()=> void)
      onMutate?: OnMutateOptions | (()=> void)
      baseUrl?: string
      navigateFn?: (routeTo?: string) => void
      toastSuccessFn?: (toastMessage?: string) => void
      toastErrorFn?: (toastMessage?: string) => void
    }
  }
}
