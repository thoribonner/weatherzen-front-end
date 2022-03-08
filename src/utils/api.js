/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      return Promise.reject({ message: error.message });
    }
  }
}

/**
 * Retrieves all existing observations.
 * @returns {Promise<[observations]>}
 *  a promise that resolves to a possibly empty array of observations saved in the database.
 */
export async function listObservations(signal) {
  const url = `${API_BASE_URL}/observations`;
  const options = { headers, signal };
  return await fetchJson(url, options);
}

/**
 * Saves observation to the database (public/data/db.json).
 * There is no validation done on the observation object, any object will be saved.
 * @param observation
 *  the observation to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<observation>}
 *  a promise that resolves the saved observation, which will now have an `id` property.
 */
export async function createObservation(observation, signal) {
  const url = `${API_BASE_URL}/observations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: observation }),
    signal,
  };
  return fetchJson(url, options);
}

/**
 * Retrieves the observation with the specified `observationId`
 * @param observationId
 *  the `id` property matching the desired observation.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<any>}
 *  a promise that resolves to the saved observation.
 */
export async function readObservation(observationId, signal) {
  const url = `${API_BASE_URL}/observations/${observationId}`;
  return await fetchJson(url, { signal }, {});
}

/**
 * Updates an existing observation
 * @param updatedObservation
 *  the observation to save, which must have an `id` property.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the updated observation.
 */
export async function updateObservation(updatedObservation, signal) {
  const url = `${API_BASE_URL}/observations/${updatedObservation.observation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: updatedObservation }),
    signal,
  };
  return await fetchJson(url, options, updatedObservation);
}
