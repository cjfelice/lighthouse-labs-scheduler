import React, { useState } from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Confirm from "./Confirm";
import Status from "./Status";
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
    .then(() => { transition(SHOW) });
  }

  function remove(id) {
    transition(DELETING);
    props.cancelInterview(id)
    .then(() => { transition(EMPTY) });
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
    </article>
  );
}