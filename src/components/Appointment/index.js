import React, { useState } from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Confirm from "./Confirm";
import Status from "./Status";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";


export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW: EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
  }

  function remove(id) {
    transition(DELETING, true);
    props.cancelInterview(id)
    .then(() => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => {transition(CREATE)}} />}
      {mode === SHOW && (
        <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer.name}
        onEdit={() => {transition(EDIT)}}
        onDelete={() => {transition(CONFIRM)}}
      /> )}
      {mode === CREATE && <Form 
        name={""}
        interviewers={props.interviewers}
        interviewer={null}
        onSave={save}
        onCancel={back}
      />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && <Confirm  message="Delete the Appointment?" onCancel={back} onConfirm={() => {remove(props.id)}}/>}
      {mode === EDIT && <Form 
        onSave={save}
        onCancel={back}
        interviewers={props.interviewers}
        interviewer={props.interviewer.id}
        name={props.student}
      />}
      {mode === ERROR_SAVE && <Error 
      message="Could not save appointment."
      onClose={back} 
      />}
      {mode === ERROR_DELETE && <Error 
      message="Could not delete appointment."
      onClose={back} 
      />}
    </article>
  );
}