import { useKeyPress } from 'react-use';

const eventPredicate = (e) => {
  if (
    e.code === 'KeyC'
    && e.type === 'keydown'
    && !e.target.type
    && !e.repeat
    && (e.metaKey || e.ctrlKey)
    /* CTRL+C will not trigger if other text is selected on the page so-as to not interfear with
     * things the user is doing.
     */
    && window.getSelection().toString().length === 0
  ) {
    // console.log('useCtrlCPressedEvent.eventPredicate.suppressed_event', e); /* eslint-disable-line */
    e.preventDefault();
    return true;
  }

  return false;
};

const useCtrlCPressedEvent = () => useKeyPress(eventPredicate);

export default useCtrlCPressedEvent;
