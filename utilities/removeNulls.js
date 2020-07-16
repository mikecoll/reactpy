import { pickBy } from 'lodash';

export default function removeNulls(object) {
  return pickBy(object, value => value != null);
}
