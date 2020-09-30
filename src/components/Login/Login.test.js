import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Login from "./Login";
// import intl from "./helper";
import { act } from "react-dom/test-utils";
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * Setup funtion for app component
 * @returns {ShallowWrapper}
 */

describe("Login component tests", () => {
  test("Login component renders without error", () => {
    render(<Login />);
  });

  test("Update state on user-name change", async () => {
    const { getByTestId } = render(<Login />);
    const usernameTextfield = getByTestId("username-textfield");
    await act(async () => {
      fireEvent.change(usernameTextfield, { target: { value: "testUser" } });
    });
    expect(usernameTextfield.value).toEqual("testUser");
  });
  test("Update state on password change", async () => {
    const { getByTestId } = render(<Login />);
    const element = getByTestId("password-textfield");
    const passwordTextfield = element.children[0];
    await act(async () => {
      fireEvent.change(passwordTextfield, {
        target: { value: "testPassword" },
      });
    });
    expect(passwordTextfield.value).toEqual("testPassword");
  });
  test("Should click login button", async () => {
    const mockLogin = jest.fn();
    React.useState = jest.fn(() => ["", mockLogin]);
    const { getByTestId } = render(<Login />);
    const usernameTextfield = getByTestId("username-textfield");
    const element = getByTestId("password-textfield");
    const passwordTextfield = element.children[0];
    const loginButton = getByTestId("login-button");
    await act(async () => {
      fireEvent.change(usernameTextfield, { target: { value: "testUser" } });
      fireEvent.change(passwordTextfield, {
        target: { value: "" },
      });
      fireEvent.click(loginButton);
    });
    expect(mockLogin).toHaveBeenCalled();
    // expect(mockLogin).toBeCalledWith({
    //   username: "testUser",
    //   password: "testPassword",
    //   showPassword: false,
    // });
  });
});
