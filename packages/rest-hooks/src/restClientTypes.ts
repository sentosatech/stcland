import { AxiosStatic, AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios'

export type FetchResponseContents = | 'FULL' | 'DATA_ONLY'


/**
 * Defines properties of a rest server to be used by the rest client.
 *
 * @property {string} [defaultBaseUrl] -
 *   The default base URL for REST actions.
 *   This will be used if no URL is provided for REST actions.
 *   It can be overridden with an axios config object `{ baseURL }`.
 * @example "http://localhost:8888"
 *
 * @property {number} [timeout=1000] -
 *   Timeout period for requests in milliseconds. Default is 1000 ms.
 */
export interface ServerConfig {
    defaultBaseUrl?: string;
    timeout?: number;
  }


/**
 * Defines properties of a client configuration for REST interactions.
 *
 * @property {boolean} [verbose=false] -
 *   Flag indication if REST interactions should be logged to the console.
 *   Default is `false`.
 *
 * @property {(rsp: AxiosResponse) => AxiosResponse} [responsePostProcessorFn] -
 *   Optional function to apply to the raw response before returning.
 *   This function takes the raw `AxiosResponse` and returns the processed `AxiosResponse`.
 *
 * @property {() => string} [getAccessToken] -
 *   Optional function to call to get the access token for the current user.
 *   If not provided, the client will not add an access token to requests.
 */
export interface ClientConfig {
    verbose?: boolean;
    responsePostProcessorFn?: (rsp: AxiosResponse) => AxiosResponse;
    getAccessToken?: () => string;
  }


/**
 * Function to be called to creates a REST client.
 *
 * @param {ClientConfig} clientConfig -
 *   The configuration for the client.
 *   This includes settings such as logging and response  post-processing
 *
 * @param {ServerConfig} serverConfig -
 *   The configuration for the server.
 *   This includes settings such as the base URL and request timeout.
 *
 * @returns {RestClient}
 *   A REST client configured with the specified client and server configurations.
 */
export type CreateRestClient = (
    clientConfig: ClientConfig,
    serverConfig: ServerConfig
  ) => RestClient;

/**
 * A type representing a REST client that includes methods for various HTTP actions and configurations.
 * This type combines selected methods from `AxiosStatic` with additional properties and functions.
 *
 * @property {ClientConfig} clientConfig -
 *   The configuration for the client, including settings for logging and post-processing functions.
 *
 * @property {ServerConfig} serverConfig -
 *   The configuration for the server, including the base URL and request timeout.
 *
 * @property {AxiosInstance} axiosClient -
 *   The Axios instance used for making HTTP requests.
 *
 * @property {CreateGetFnOrig} createGetFnOrig -
 *   Function to create a custom GET request handler.
 *
 * @property {CreatePostFn} createPostFn -
 *   Function to create a custom POST request handler.
 *
 * @property {CreatePutFn} createPutFn -
 *   Function to create a custom PUT request handler.
 *
 * @property {CreatePatchFn} createPatchFn -
 *   Function to create a custom PATCH request handler.
 *
 * @property {CreateDeleteFn} createDeleteFn -
 *   Function to create a custom DELETE request handler.
 */
export type RestClient =
  Pick<AxiosStatic, 'get' | 'post' | 'put' | 'patch' | 'delete'> & {
  clientConfig: ClientConfig;
  serverConfig: ServerConfig;
  axiosClient: AxiosInstance;
  createGetFnOrig: CreateGetFnOrig;
  createGetFn: CreateGetFn;
  createPostFn: CreatePostFn;
  createPutFn: CreatePutFn;
  createPatchFn: CreatePatchFn;
  createDeleteFn: CreateDeleteFn;
};

/**
 * Object that represents substitutions for path variables in REST paths,
 * where the REST path uses `:variableToSubstitute` syntax.
 *
 * @property {string | number} [key] -
 *   The key represents the variable name within the path that is targeted for substitution.
 *   The value represents the value that will be substituted into the path variable.
 * @example
 *   For a path /things/:id, and pathParams = { id: 22 }
 *   The substitution results in path /things/22
*
 */
export type PathParams = {
    [key: string]: string | number;
  };

/**
 * Object or string for representing query parameters  REST paths.
 *
 * As an object:
 * - Specifies a set of query parameters within REST query strings.
 * - Keys: Represent variable parameter names to add to the query string.
 * - Values: Associated values to add to the query string.
 *
 * @example
 * As an object:
 *   { smile: true, grumpy: false }
 *   Represents /somepath?smile=true&grumpy=false
 *
 * As a string:
 * - Raw string representing the query string.
 *
 * @example
 * As an string:
 *   "?smile=true&grumpy=false"
 *   represents /somepath?smile=true&grumpy=false
 */
export type QueryParams =
  { [key: string]: string | number | boolean }
  | string;

/**
 * Represents parameters for constructing REST API requests.
 *
 * @property {PathParams} [pathParams] -
 *   Optional object for substituting path variables in REST paths.
 *   Uses the `:variableToSubstitute` syntax in the path.
 * @example
 *   For a path "/users/:id" and pathParams = { id: 123 },
 *   the result would be "/users/123"
 *
 * @property {QueryParams} [queryParams] -
 *   Optional object or string for representing query parameters in REST paths.
 *   Can be provided as an object with key-value pairs or as a raw string.
 * @example
 *   As an object: { sort: "asc", limit: 10 }
 *   As a string: "?sort=asc&limit=10"
 *   Both represent "/somepath?sort=asc&limit=10"
 */
export type RestParams = {
    pathParams?: PathParams;
    queryParams?: QueryParams;
  };

/**
 * A function that performs a REST GET request.
 *
 * This function is designed to be called without arguments, assuming that
 * the path and parameters are known internally by the function.
 *
 * @returns {Promise<AxiosResponse>}
 *   A promise that resolves to the Axios response from the GET request.
 *
 * @remarks
 *   TODO: Consider modifying this function to accept a RestParams object as an argument
 *   for greater flexibility in specifying path and query parameters.
 *
 * @example
 *   const getUserData: GetFnOrig = () => {
 *     return axios.get('/api/user/123');
 *   };
 *
 *   getUserData().then(response => {
 *     console.log(response.data);
 *   });
 */
export type GetFnOrig = () => Promise<AxiosResponse>;

export type GetFn = (restParams?: RestParams) => Promise<AxiosResponse>;


/**
 * Creates a function that performs a REST GET request for the specified restPath and restParams.
 * The returned function can be passed directly into 'react-query' query hooks.
 *
 * @param {string} restPath -
 *   Path to the REST endpoint. Can contain path variables in the form of `:variableToSubstitute`.
 *
 * @param {RestParams} restParams -
 *   Object containing path and query parameters for the request.
 *   @see {@link RestParams} for detailed structure.
 *
 * @param {Partial<AxiosRequestConfig>} [axiosOptions] -
 *   Optional Axios request configuration.
 *   @see {@link https://axios-http.com/docs/req_config|Axios documentation} for available options.
 *
 * @returns {GetFnOrig}
 *   A function that can be called to perform a REST GET request.
 *   @see {@link GetFnOrig} for details on the returned function.
 *
 * @example
 *   // Basic usage
 *   const getThings = restClient.createGetFnOrig("/things")
 *   const things = await getThings()
 *
 * @example
 *   // With a specific ID in the path
 *   const getThing1 = restClient.createGetFnOrig("/things/1")
 *   const thing1 = await getThing1()
 *
 * @example
 *   // Using path variables
 *   const getThing1WithPathVariable = restClient.createGetFnOrig("/things/:id", {
 *     pathParams: { id: 1 }
 *   })
 *   const thing1WithVar = await getThing1WithPathVariable()
 *
 * @remarks
 *   The `restParams` object can include both `pathParams` and `queryParams`.
 *   Path variables in `restPath` (e.g., `:id`) will be substituted with values from `pathParams`.
 *   Query parameters from `queryParams` will be appended to the URL.
 */
export type CreateGetFnOrig = (
    restPath: string,
    restParams?: RestParams,
    axiosOptions?: Partial<AxiosRequestConfig>
  ) => GetFnOrig;


// SPS
// TODO: docs
export type CreateGetFn = (
  restPath: string,
  axiosOptions?: Partial<AxiosRequestConfig>
) => GetFn;

/**
 * A function that performs a REST mutation (create or update) operation.
 *
 * @param {object} params - The parameters for the mutation operation.
 * @param {unknown} params.data - The data to be sent to the server for resource creation or update.
 * @param {RestParams} [params.restParams] - Optional path and query parameters for the REST call.
 * @returns {Promise<AxiosResponse>} A promise containing the results of the mutation.
 */

export type MutateFn = ({
  data,
  restParams
}: {
  data: unknown,
  restParams?: RestParams
}) => Promise<AxiosResponse>;

  /**
   * Creates a function that performs a REST POST request for the specified restPath.
   * The returned function can be used for mutation operations.
   *
   * @param {string} restPath -
   *   Path to the REST endpoint. Can contain path substitution variables in the form of `/path/:variableToSubstitute`.
   *
   * @param {Partial<AxiosRequestConfig>} [axiosOptions] -
   *   Optional Axios request configuration.
   *   @see {@link https://axios-http.com/docs/req_config|Axios documentation} for available options.
   *
   * @returns {MutateFn}
   *   A function that can be called to perform a REST POST request.
   *   @see {@link MutateFn} for details on the returned function.
   *
   * @example
   *   // Creating a mutation function
   *   const createThing = restClient.createMutateFn("/things");
   *
   *   // Using the mutation function
   *   const response = await createThing({
   *     data: { name: "New Thing" },
   *     restParams: { queryParams: { validate: true } }
   *   });
   *
   * @example
   *   // With path variables
   *   const updateThing = restClient.createMutateFn("/things/:id");
   *
   *   const response = await updateThing({
   *     data: { name: "Updated Thing" },
   *     restParams: {
   *       pathParams: { id: 123 },
   *       queryParams: { version: 2 }
   *     }
   *   });
   */
  export type CreateMutateFn = (
    restPath: string,
    axiosOptions?: Partial<AxiosRequestConfig>
  ) => MutateFn;

/**
 * Creates a function that performs a REST POST request to the specified path.
 *
 * @param {string} restPath -
 *   Path to the REST endpoint.
 *   Can contain path substitution variables in the form of `/path/:variableToSubstitute`.
 *
 * @param {Partial<AxiosRequestConfig>} [axiosOptions] -
 *   Optional Axios request configuration.
 *   @see {@link https://axios-http.com/docs/req_config|Axios documentation} for available options.
 *
 * @returns {MutateFn}
 *   A function that performs a REST POST request and returns a promise resolving to the created object.
 *   This function can be passed into 'react-query' mutation hooks.
 *   @see {@link MutateFn} for details on the returned function.
 *
 *
 * @example
 *   const createThing = createPostFn("/things/:bucket")
 *   const newThing = await createThing({ thing: 'data' }, {
 *       pathParams: { bucket: 'blueThings' },
 *       queryParams: { smile: true }
 *     }
 *   )
 *   // => Request POST /things/blueThings?smile=true
 *   //    Body { thing: 'data' }
 */
export type CreatePostFn = CreateMutateFn;

/**
 * Creates a function that performs a REST PUT request to the specified path.
 *
 * @param {string} restPath -
 *   Path to the REST endpoint.
 *   Can contain path substitution variables in the form of `/path/:variableToSubstitute`.
 *
 * @param {Partial<AxiosRequestConfig>} [axiosOptions] -
 *   Optional Axios request configuration.
 *   @see {@link https://axios-http.com/docs/req_config|Axios documentation} for available options.
 *
 * @returns {MutateFn}
 *   A function that performs a REST PUT request and returns a promise resolving to the updated resource.
 *   This function can be passed into 'react-query' mutation hooks.
 *   @see {@link MutateFn} for details on the returned function.
 *
 * @example
 *   const updateThing1 = createPutFn("/things/1")
 *   const updatedThing1 = await updateThing1({ thing: 'updates' })
 *   // => Request PUT /things/1
 *   //    Body { thing: 'updates' }
 *
 * @example
 *   const updateThing2 = createPutFn("/things/:thingId")
 *   const updatedThing2 = await updateThing2(
 *     { thing: 'updates' },
 *     {
 *       pathParams: { thingId: 2 },
 *       queryParams: { smile: true }
 *     }
 *   )
 *   // => Request PUT /things/2?smile=true
 *   //    Body { thing: 'updates' }
 */
export type CreatePutFn = CreateMutateFn;

/**
 * Creates a function that performs a REST PATCH request to the specified path.
 *
 * @param {string} restPath -
 *   Path to the REST endpoint.
 *   Can contain path substitution variables in the form of `/path/:variableToSubstitute`.
 *
 * @param {Partial<AxiosRequestConfig>} [axiosOptions] -
 *   Optional Axios request configuration.
 *   @see {@link https://axios-http.com/docs/req_config|Axios documentation} for available options.
 *
 * @returns {MutateFn}
 *   A function that performs a REST PATCH request and returns a promise resolving to the updated resource.
 *   This function can be passed into 'react-query' mutation hooks.
 *   @see {@link MutateFn} for details on the returned function.
 *
 * @example
 *   const updateThing1 = createPatchFn("/things/1")
 *   const updatedThing1 = await updateThing1({ thing: 'updates' })
 *   // => Request PATCH /things/1
 *   //    Body { thing: 'updates' }
 *
 * @example
 *   const updateThing2 = createPatchFn("/things/:thingId")
 *   const updatedThing2 = await updateThing2({ thing: 'updates' }, {
 *       pathParams: { thingId: 2 },
 *       queryParams: { smile: true }
 *     }
 *   )
 *   // => Request PATCH /things/2?smile=true
 *   //    Body { thing: 'updates' }
 */
export type CreatePatchFn = CreateMutateFn;

/**
 * A function that performs a REST DELETE request.
 *
 * @param {RestParams} restParams -
 *   The path and query parameters to be used for the REST call.
 * @returns {Promise<AxiosResponse>}
 *   A promise containing the response to the delete request.
 */
export type DeleteFn = (restParams: RestParams) => Promise<AxiosResponse>;

/**
 * Creates a function that performs a REST DELETE request to the specified path.
 *
 * @param {string} restPath -
 *   Path to the REST endpoint.
 *   Can contain path substitution variables in the form of `/path/:variableToSubstitute`.
 *
 * @param {Partial<AxiosRequestConfig>} [axiosOptions] -
 *   Optional Axios request configuration.
 *   @see {@link https://axios-http.com/docs/req_config|Axios documentation} for available options.
 *
 * @returns {DeleteFn}
 *   A function that performs a REST DELETE request.
 *   This function can be passed into 'react-query' mutation hooks.
 *   @see {@link DeleteFn} for details on the returned function.
 *
 * @example
 *   const deleteThing = createDeleteFn("/things/:id")
 *   await deleteThing({ pathParams: { id: 123 } })
 *   // => Request DELETE /things/123
 */
export type CreateDeleteFn = (
  restPath: string,
  axiosOptions?: Partial<AxiosRequestConfig>
) => DeleteFn;
