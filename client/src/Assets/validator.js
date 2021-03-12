import validate from "validator";

const Validator = function (key, value) {
  if (typeof value !== "string" || validate.isEmpty(value)) return false;
  const objectKeys = {
    email: () => validate.isEmail(value) && validate.isLength(value, { max: 100 }),
    userName: () => /^[a-zA-Z0-9]{2,15}[\-\_\.]{0,1}[a-zA-Z0-9]{2,15}$/g.test(value),
    lastName: () => validate.isAlpha(value) && validate.isLength(value, { min: 4, max: 25 }),
    firstName: () => validate.isAlpha(value) && validate.isLength(value, { min: 4, max: 25 }),
    password: () =>
      validate.isStrongPassword(value, {
        minLength: 8,
        returnScore: true,
      }) > 35 && validate.isLength(value, { max: 60 }),
    token: () => validate.isBase64(value) && validate.isLength(value, { min: 0, max: 172 }),
  };
  return objectKeys[key]() ? true : false;
};
export { Validator };
