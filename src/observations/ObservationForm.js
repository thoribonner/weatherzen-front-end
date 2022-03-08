import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {
  readObservation,
  createObservation,
  updateObservation,
} from "../utils/api";

export default function ObservationForm({ mode }) {
  const history = useHistory();
  const { observationId } = useParams();

  const initialFormData = {
    latitude: "",
    longitude: "",
    sky_condition: "",
    air_temperature: "",
    air_temperature_unit: "",
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCon = new AbortController();
    async function getEditObservation() {
      try {
        const editObs = await readObservation(observationId);
        setFormData({ ...editObs });
      } catch (err) {
        setError(err);
      }
    }
    if (mode === "edit") getEditObservation();
    return abortCon.abort();
  }, [observationId, mode]);

  function cancelHandler() {
    history.push("/");
  }

  function changeHandler({ target: { name, value } }) {
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const submitHandler = (event) => {
    event.preventDefault();

    async function createNewObservation() {
      try {
        await createObservation(formData);
        history.push("/");
      } catch (err) {
        setError(err);
      }
    }

    async function updateThisObservation() {
      try {
        console.log('made it inside the front end update function')
        await updateObservation(formData);
        history.push("/");
      } catch (err) {
        setError(err);
      }
    }

    if (mode === "edit") updateThisObservation();
    if (mode === "create") createNewObservation();
  };

  return (
    <>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="latitude">
              Latitude
            </label>
            <input
              className="form-control"
              id="latitude"
              name="latitude"
              type="number"
              max="90"
              min="-90"
              value={formData.latitude}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Enter a value between -90 and 90.
            </small>
          </div>

          <div className="col-6">
            <label className="form-label" htmlFor="longitude">
              Longitude
            </label>
            <input
              className="form-control"
              id="longitude"
              name="longitude"
              type="number"
              max="180"
              min="-180"
              value={formData.longitude}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Enter a value between -180 and 180.
            </small>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label className="form-label" htmlFor="air_temperature">
              Air Temperature
            </label>
            <input
              className="form-control"
              id="air_temperature"
              name="air_temperature"
              type="number"
              max="107"
              min="-50"
              value={formData.air_temperature}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Enter a value between -50 and 107.
            </small>
          </div>

          <div className="col-6">
            <label className="form-label" htmlFor="air_temperature_unit">
              Air Temperature Unit
            </label>
            <select
              className="form-control"
              id="air_temperature_unit"
              name="air_temperature_unit"
              value={formData.air_temperature_unit}
              onChange={changeHandler}
              required={true}
            >
              <option value="">Select air temperature unit</option>
              <option value="C">Celcius</option>
              <option value="F">Farenheit</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="cloudCover">
            Sky conditions
          </label>
          <select
            className="form-control"
            id="sky_condition"
            name="sky_condition"
            value={formData.sky_condition}
            onChange={changeHandler}
            required={true}
          >
            <option value="">Select a sky condition option</option>
            <option value="100">Cloudless</option>
            <option value="101">Some clouds</option>
            <option value="102">Cloud covered</option>
            <option value="103">Foggy</option>
            <option value="104">Raining</option>
            <option value="106">Snowing</option>
            <option value="108">Hailing</option>
            <option value="109">Thunderstorms</option>
          </select>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
