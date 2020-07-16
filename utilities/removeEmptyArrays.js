import { pickBy } from 'lodash';

export default function removeEmptyArrays(object) {
  return pickBy(object, value => !Array.isArray(value) || value.length > 0);
}
