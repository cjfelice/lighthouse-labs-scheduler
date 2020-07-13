

export function getAppointmentsForDay(state, day) {
  const appointArr = [];
  if (state.days[0]) {
    const filteredDays = state.days.filter((days) => days.name === day);
    if (filteredDays[0]) {
      const daysAppoints = filteredDays[0].appointments;
      for (let appoints of daysAppoints) {
        appointArr.push(state.appointments[appoints]);
      }
    }
  }
  return appointArr;
};


export function getInterview(state, interview) {
  let interOBJ = null;
  for (let item in state.interviewers) {
    if (interview && state.interviewers[item]) {
    if (state.interviewers[item].id === interview.interviewer) {
      interOBJ = {};
      interOBJ.interviewer = state.interviewers[item];
      interOBJ.student = interview.student;
    }
  }
  };
  return interOBJ;
};

export function getInterviewersForDay(state, day) {
  const appointArr = [];
  const interviewArr = [];
  const interOBJ = {};
  if (state.days[0]) {
    const filteredDays = state.days.filter((days) => days.name === day);
    if (filteredDays[0]) {
      const daysInterviewers = filteredDays[0].interviewers;
      for (let interviewers of daysInterviewers) {
        appointArr.push(state.interviewers[interviewers]);
      }
    }
  }
  return appointArr;
};
