/* Validators.js — Validators to be used with react-hook-form */

/* ========= Custom Validation Functions  ========= */
const positive = value => parseInt(value, 10) > 0;

/* Validators are common validation functions to be used like:
    ```
    ref={register({
      required: true,
      validate: { positive: Validators.positive },
    })}
    ```
 */
const Validators = {
  positive,
};

/* Patterns are common input pattern+messages to be used like:
 * ```
 *  ref={register({
 *    required: true,
 *    pattern: Validators.patterns.email,
 *  })}
 * ```
 */
const Patterns = {
  email: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: 'Invalid Email Address',
  },
  phone: {
    value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
    message: 'Invalid Phone Number',
  },
};

/* ================================================================== */
/* ======================= DO NOT EDIT BELOW  ======================= */
/* ================================================================== */

/* OptionalValidators are validation functions to be used like:
 *   ```
 *   ref={register({
 *     required: false,
 *     validate: { positive: Validators.optional.positive },
 *   })}
 *   ```
 *
 * @NOTE: OptionalValildators is a copy of Validators above, but each function will respond
 * with `true` (eg does not trigger a form error) if the provided value is empty.
 */
const OptionalValidators = Object.keys(Validators).reduce(
  (acc, key) => {
    acc[key] = value => value === undefined || value === '' || Validators[key](value);
    return acc;
  },
  {},
);

export default {
  ...Validators,
  optional: {
    ...OptionalValidators,
  },
  patterns: {
    ...Patterns,
  },
};
