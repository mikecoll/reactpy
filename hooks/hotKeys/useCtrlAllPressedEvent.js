import { useKeyPress } from 'react-use';

const eventPredicate = (e) => {
  if (
    e.code === 'KeyA'
    && e.type === 'keydown'
    && !e.target.type
    && !e.repeat
    && (e.metaKey || e.ctrlKey)
  ) {
    // console.log('useCtrlAllPressedEvent.eventPredicate.suppressed_event', e); /* eslint-disable-line */
    e.preventDefault();
    return true;
  }

  return false;
};

const useCtrlAllPressedEvent = () => useKeyPress(eventPredicate);

export default useCtrlAllPressedEvent;
