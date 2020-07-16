import { pickBy } from 'lodash';

export default function removeEmptyStrings(object) {
  return pickBy(object, value => typeof value !== 'string' || value.length > 0);
}
