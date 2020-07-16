export default function someDisabled(disabled) {
  return (Array.isArray(disabled))
    ? disabled.some(d => (typeof d === 'function') ? d() : d) // eslint-disable-line no-confusing-arrow
    : disabled;
}
