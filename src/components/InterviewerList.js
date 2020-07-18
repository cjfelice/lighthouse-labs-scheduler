import React from "react";
import InterviewerListItem from "components/InterviewerListItem";
import PropTypes from "prop-types";

import "components/InterviewerList.scss";

export default function InterviewerList(props) {

  InterviewerList.propTypes = {
    interviewer: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };

  const interviewers = props.interviewers.map(interviewer => {
    return (
    <InterviewerListItem
    key={interviewer.id}
    name={interviewer.name} 
    avatar={interviewer.avatar} 
    selected={interviewer.id === props.interviewer}
    setInterviewer={action => props.onChange(interviewer.id)} 
    />
    );
  });

   return (
    <section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewer</h4>
    <ul className="interviewers__list">{interviewers}</ul>
  </section>
   );
 }