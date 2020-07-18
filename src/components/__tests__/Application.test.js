import React from "react";

import { render, waitForElement, fireEvent, getByPlaceholderText, getByText, getAllByTestId, getByAltText, queryByAltText, queryByText } from "@testing-library/react";

import axios from "axios";

import Application from "components/Application";


describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archibald Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    
    let day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    

    day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "no spots remaining")
    );
  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archibald Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archibald Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Delete the Appointment?")).toBeInTheDocument();
 
    fireEvent.click(queryByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

  });



  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archibald Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archibald Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));


    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Jonklin" }
    });
 
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();


    await waitForElement(() => getByText(appointment, 'Jonklin'));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();


  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archibald Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, 'Error')
    );

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archibald Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archibald Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Delete the Appointment?")).toBeInTheDocument();
 
    fireEvent.click(queryByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, 'Could not delete appointment.')
    );

  });


});