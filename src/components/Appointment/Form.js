import React, { useState } from "react";
import InterviewerList from "components/InterviewerList"
import Button from "components/Button"


export default function Form(props) {

  const [nameText, setNameText] = useState(props.name || "")
  const [interviewer, setInterviewer] = useState(props.interviewer || null)
  const [error, setError] = useState("");

  const reset = function() {
    setInterviewer(null);
    setNameText("");
  };

  function validate() {
    if (nameText === "") {
      setError("Student name cannot be blank");
      return;
    }

    setError("");
    props.onSave(nameText, interviewer);
  }

  const cancel = function() {
    reset();
    props.onCancel();
  }
  return (
    <main className="appointment__card appointment__card--create">
  <section className="appointment__card-left">
    <form autoComplete="off" onSubmit={event => event.preventDefault()}>
      <input
        className="appointment__create-input text--semi-bold"
        name="name"
        type="text"
        placeholder="Enter Student Name"
        value={nameText}
        onChange={(event) => setNameText(event.target.value)}
        data-testid="student-name-input"
      />
    </form>
    <section className="appointment__validation">{error}</section>
    <InterviewerList interviewers={props.interviewers} interviewer={interviewer} onChange={(interviewer) => setInterviewer(interviewer)} />
  </section>
  <section className="appointment__card-right">
    <section className="appointment__actions">
      <Button onClick={() => cancel()} danger>Cancel</Button>
      <Button onClick={() => validate()} confirm>Save</Button>
    </section>
  </section>
</main>
  );
}