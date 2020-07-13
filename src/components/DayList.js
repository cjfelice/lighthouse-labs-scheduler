import React from "react";
import DayListItem from "components/DayListItem";


export default function DayList(props) {
  const days = props.days.map(days => {
    return <DayListItem 
    name={days.name} 
    spots={days.spots} 
    selected={days.name === props.day}
    setDay={props.setDay} />
  })
   return (
     <ul>
       {days}
     </ul>
   );
 }
