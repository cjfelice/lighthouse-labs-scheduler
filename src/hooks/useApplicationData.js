import { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData(initial) {
  
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


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {
      setState({...state, appointments });
    })
  };


  function cancelInterview(id) {
    const appointments = {
      ...state.appointments
    };
    appointments[id].interview = null;
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      setState({...state, appointments });
    })
  };

  return { state, setDay, bookInterview, cancelInterview };
}