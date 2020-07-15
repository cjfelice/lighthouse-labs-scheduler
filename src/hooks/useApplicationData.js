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


  const setSpots = (state) => {
    let spotCount = 5;
    for (let day in state.days) {
      if (state.days[day].name === state.day) {
        for (let id of state.days[day].appointments) {
          if (state.appointments[id].interview !== null) {
            spotCount--;
          }
        }
      }
    }
    return state.days.map(day => {
      if (day.name !== state.day) {
        return day;
      }
      return {
        ...day,
        spots: spotCount
      };
    });
  }

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
      setState(state => ({...state, appointments }));
      setState(state => ({...state, days: setSpots(state)}));
    })
  };


  function cancelInterview(id) {
    const appointments = {
      ...state.appointments
    };
    appointments[id].interview = null;
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      setState(state => ({...state, appointments }));
      setState(state => ({...state, days: setSpots(state)}));
    })
  };

  return { state, setDay, bookInterview, cancelInterview, setSpots };
}