
import Button from "components/Button";
import DayListItem from "components/DayListItem";
import DayList from "components/DayList";
import React, { useState, useEffect } from "react";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

import axios from "axios"; 

import "components/Application.scss";


export default function Application(props) {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get(`http://localhost:8001/api/days`)),
      Promise.resolve(axios.get(`http://localhost:8001/api/appointments`)),
      Promise.resolve(axios.get(`http://localhost:8001/api/interviewers`))
    ]).then((all) => {
      const [dayData, appointmentData, interviewerData] = all;
      setState(prev => ({ ...prev, days: dayData.data, appointments: appointmentData.data, interviewers: interviewerData.data }));
    });
  }, []);

  const dayAppoints = getAppointmentsForDay(state, state.day);

  const dayInterviewers = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({...state, appointments });
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview: interview });
  }

  const bookings = dayAppoints.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dayInterviewers}
        bookInterview={bookInterview}
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

