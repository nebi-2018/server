import * as yup from "yup";

const username = yup
  .string()
  .required("username is required")
  .min(5, "username should have atleast five charracters")
  .max(10, "Username should have at most 10 characters.")
  .matches(/^\w+$/, "Should be alphanumeric.");

const email = yup
  .string()
  .required("email is required")
  .email("This is invalid email");

const password = yup
  .string()
  .required("Password is required")
  .min(5, "password should have atleast five charracters")
  .max(10, "Username should have at most 10 characters.");

//Validation Schema for user Registration
export const UserRegistrationRules = yup.object().shape({
  username,
  password,
  email,
});

//Validation Schema for User Authentication

export const UserAuthenticationRules = yup.object().shape({
  username,
  password,
});
