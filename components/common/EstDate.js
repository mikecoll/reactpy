import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';

export const timeZoneString = 'America/New_York';
export const dateTimeFormats = {
  short: 'YYYY/MM/DD',
  long: 'YYYY/MM/DD hh:mm:ss A',
  iso8601: 'YYYY-MM-DD hh:mm:ss',
  human: 'LLLL',
};

export const isValidMomentDate = utcDate => (
  !(!utcDate || !moment(utcDate).isValid())
);

export const estToUtc = (utcDate, format = null) => (
  (isValidMomentDate(utcDate))
    ? moment
      .tz(utcDate, timeZoneString)
      .utc()
      .format(format || dateTimeFormats.short)
    : null
);

export const utcToEst = (utcDate, format = null) => {
  if (!isValidMomentDate(utcDate)) {
    return null;
  }

  return moment(utcDate)
    .tz(timeZoneString)
    .format(format || dateTimeFormats.short);
};

const EstDate = (props) => {
  const {
    value,
    format,
  } = props;

  return utcToEst(value, format);
};

EstDate.defaultProps = {
  value: null,
  format: null, // functions default to dateTimeFormats.short
};

EstDate.propTypes = {
  value: PropTypes.string,
  format: PropTypes.string,
};

export default EstDate;
