import * as yup from "yup";

const title = yup
  .string()
  .required("Title of the post is required")
  .min(3, "Title should have atleast 3 charracters")
  .max(100, "Title can have atmost 100 characters");

const description = yup
  .string()
  .required("Content of the post is required")
  .min(10, "Content should have atleast 10 characters")
  .max(3000, "Content can have atmost 3000 characters");

export const NewPostvalidationRules = yup.object().shape({
  title,
  description,
});
