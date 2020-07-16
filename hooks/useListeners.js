import { useState, useEffect } from 'react';
import { uniqueId } from 'lodash';

const useListeners = () => {
  const [listeners, setListeners] = useState({});
  const [mounted, setMounted] = useState(true);

  const removeListener = id => mounted && setListeners((state) => {
    const {
      [id]: discardListener,
      ...restListeners
    } = state;

    return restListeners;
  });

  /** addWatcher is intended to be used in a 'useEffect' as it's response is
   *      a refrence to remove the listener from this listeners state.
   *
   * Intedned use:
   *    useEffect(() => addListener(updateData), []);
   *
   */
  const addListener = (cb) => {
    const id = uniqueId();

    mounted && setListeners(state => ({ ...state, [id]: cb }));

    return () => mounted && removeListener(id);
  };

  const triggerListeners = async () => mounted && Promise.all(
    Object.values(listeners).map(cb => new Promise((resolve, reject) => {
      if (typeof cb === 'function') {
        return resolve(cb());
      }

      return reject(cb);
    })),
  );

  useEffect(() => () => mounted && setMounted(false), []);

  return [listeners, {
    addListener,
    removeListener,
    triggerListeners,
  }];
};

export default useListeners;
