
import DayList from "components/DayList";
import React from "react";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

import "components/Application.scss";


export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  const dayAppoints = getAppointmentsForDay(state, state.day);

  const dayInterviewers = getInterviewersForDay(state, state.day);

  const bookings = dayAppoints.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewer={interview && interview.interviewer}
        student={interview && interview.student}
        interviewers={dayInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
      <img
      className="sidebar--centered"
      src="images/logo.png"
      alt="Interview Scheduler"
    />
    <hr className="sidebar__separator sidebar--centered" />
    <nav className="sidebar__menu">
    <DayList
    days={state.days}
    day={state.day}
    setDay={setDay}
    />
    </nav>
    <img
    className="sidebar__lhl sidebar--centered"
    src="images/lhl.png"
    alt="Lighthouse Labs"
    />
      </section>
      <section className="schedule">
        { bookings }
        <Appointment key="last" time="5pm" />
      </section>
    </main>
    
  );
}

