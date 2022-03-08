import React from "react";
import ObservationForm from "./ObservationForm";

export default function ObservationCreate() {
  return (
    <main>
      <h1 className="mb-3">Create Observation</h1>
      <ObservationForm mode="create" />
    </main>
  );
}
