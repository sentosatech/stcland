import { AxiosStatic, AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios'

export type FetchResponseContents = | 'FULL' | 'DATA_ONLY'

/*
  Defines properties of a rest server to be used by the client
*/
export interface ServerConfig {
  defaultBaseUrl?: string
    // will be default if no url provided for rest actions
    // can be over-ridden with axios config object { baseURL }
    // example: http://localhost:8888
  timeout?: number
    // timeout period for requests (default 1000 ms)
}

/*
  Defines properties of a rest server to be used by the client
*/
export interface ClientConfig {
  verbose?: boolean
    // should rest interactions be logged to the console (default false)
  responsePostProcessorFn?: (rsp: AxiosResponse) => AxiosResponse
    // optonal function to apply to raw response before returning

  getAccessToken?: () => string
    // optional function to call to get the access token for the current user
    // if not provided, the client will not add an access token to requests
}

export type RestClient =
Partial<Pick<AxiosStatic,
  'get' | 'post' | 'put' | 'patch' | 'delete' >> &
{
  clientConfig: ClientConfig
  serverConfig: ServerConfig
  axiosClient: AxiosInstance
  createGetFn?: CreateGetFn
  createPostFn?: CreatePostFn
  createPutFn?: CreatePutFn
  createPatchFn?: CreatePatchFn
  createDeleteFn?: CreateDeleteFn
}

/*
    Object that represents substitutions for path variables in rest paths,
    were the rest path uses `:variableToSubsititue` syntax
    - keys: represents variable names withinin the path targeted for subsitution
    - values: values that will be substitued into the path variable

   Example
    - for a path /things/:id, and pathParams = { id: 22 }
    - the substition results in path /things/22
*/
export type PathParams = {
  [key: string]: string | number
}

/*
   Object or string for representing query parameters for rest paths

  As object
    - specifies set of query params within rest query strings,
    - keys: represents variable paramater name to add to the query string
    - values: associated value to add to the query string

    example:
      - { smile: true, grumpy: false }
      - represents /somepath?smile=true&grumpy=false

  As String
    - raw string representing the query string

    example:
      - "?smile=true&grumpy=false"
      - represents /somepath?smile=true&grumpy=false
*/
export type QueryParams =
  { [key: string]: string | number | boolean }
  | string


/**
 * @type RestParams: represents rest path parameters and query parameters
 */
export type RestParams = {
  pathParams?: PathParams
  queryParams?: QueryParams
}

/*
  A function that can be called to perform a rest GET request. It is assumed
  that the path and parameters are konwn internally by the function.
*/
export type GetFn = () => Promise<AxiosResponse>
  // - returns a promise containing the response to the query
  // - TODO: should this take a RestParams object as an argument?

/*
  Returns a function that can be called to perform a REST get
  request for the specified restPath/restParams.  The returned function
  can be passed directly into 'react-query' query hooks

  Examples:
    const getThings = restClient.createGetFn("/things")
    const things = await getThings()

    const getThing1 = restClient.createGetFn("/things/1")
    const thing1 = await getThing1()

    const getThing1WithPathVariable =
      restClient.createGetFn("/things/:id", {
        pathParams: { id: 1 }
    })
    const thing1WithVar = await getThing1WithPathVariable()
*/
export type CreateGetFn = (
  restPath: string,
    // path to rest endpoint
    // can contain path variables in the form of :variableToSubsititue
  restParams: RestParams,
    // { PathParams, QueryParams }
    // See documentation for these types
  axiosOptions?: Partial<AxiosRequestConfig>
    // optional axios request configuration
    // see axios documentation for options
) => GetFn
    // Retuns a function that can be called to perform a rest GET request

export type MutateFn = ({
  data,
    // The data to be sent to the server for resource create or update
  restParams
    // The path and query parameters to be used for the rest call
  }
: { data: unknown, restParams?: RestParams }
) => Promise<AxiosResponse>
  // - returns a promise containing the results of the mutation

type CreateMutateFn = (
    restPath: string,
      // path to rest endpoint
      // can contain path subsitiion variables in the form of `/path/:variableToSubsititue'
    axiosOptions?: Partial<AxiosRequestConfig>
      // optional axios request configuration
      // see axios documentation for options
  ) => MutateFn
      // Retuns a function that can be called to perform a rest REST POST


/*
  Returns a function that
  - performs a rest POST to restPath with substituded pathParams and appended queryParams
  - returns promise the created object

  Example
  ```
    const createThing = createPostFn("/things/:bucket")
    const newThing = await createThing({ thing: 'data'}, {
      pathParams: { bucket: 'blueThings' }
      queryParams: { smile: true }
    })
    // => Request POST /things/blueThings?smile=true
    //    Body { thing: 'data'}
  ````
*/
type CreatePostFn = CreateMutateFn
  // See documentation for CreatePostFn

/*
  Returns a function that
  - performs a rest PUT to restPath with substituded pathParams and appended queryParams
  - returns promise to the updated resource

  Examples
  ```
    const updateThing1 = createPutFn("/things/1")
    const updatedThing1 = await updateThing1( { thing: 'updates' })
    // => Request PUT /things/1
    //    Body { thing: 'updates' }

    const updateThing2 = createPutFn("/things/:thingId")
    const updatedThing2 = await updateThing2({ thing: 'updates' }, {
      pathParams: { thingId: 2 }
      queryParams: { smile: true }
    })
    // => Request PUT /things/2?smile=true
    //    Body { thing: 'updates' }
  ````
*/
type CreatePutFn = CreateMutateFn
  // See documentation for CreateMutateFn

/*
  Returns a function that
  - performs a rest PUT to restPath with substituded pathParams and appended queryParams
  - returns promise to the updated resource

  Examples
  ```
    const updateThing1 = CreatePatchFn("/things/1")
    const updatedThing1 = await updateThing1( { thing: 'updates' })
    // => Request PUT /things/1
    //    Body { thing: 'updates' }

    const updateThing2 = CreatePatchFn("/things/:thingId")
    const updatedThing2 = await updateThing2({ thing: 'updates' }, {
      pathParams: { thingId: 2 }
      queryParams: { smile: true }
    })
    // => Request PUT /things/2?smile=true
    //    Body { thing: 'updates' }
  ````
*/
type CreatePatchFn = CreateMutateFn
  // See documentation for CreateMutateFn

/*
  A function that can be called to perform a rest DELETE request. It is assumed
  that the rest path is konwn internally by the function.
*/
export type DeleteFn = (
  restParams: RestParams
    // The path and query parameters to be used for the rest call
) => Promise<AxiosResponse>
   // // - returns a promise containing the response to the delete request

type CreateDeleteFn = (
  restPath: string,
    // path to rest endpoint
    // can contain path subsitiion variables in the form of `/path/:variableToSubsititue'
  axiosOptions?: Partial<AxiosRequestConfig>
    // optional axios request configuration
    // see axios documentation for options
) => DeleteFn
