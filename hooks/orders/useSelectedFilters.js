import { useLocalStorage } from 'react-use';
import { useFiltersDispatch } from '~/contexts/FiltersState';

const useSelectedFilters = () => {
  const { resetFilters, resetFilter } = useFiltersDispatch();

  const [selections, setSelections] = useLocalStorage(
    'dom-attribute-filters', {},
  );

  const onChange = (newSelections) => {
    setSelections((state) => {
      const newState = { ...state };

      const selectedKeys = newSelections
        && newSelections.length > 0
        && newSelections.map(selection => selection.value);

      if (Object.keys(state).length) {
        const disableKeys = Object.keys(state)
          .filter(
            key => (!selectedKeys || !selectedKeys.includes(key))
              // don't include the key if the filter is not visible
              && (newState[key] && state[key].visible),
          );

        // remove filters
        disableKeys.forEach((key) => {
          resetFilter(key);

          // @NOTE: not deleting here to perserve any other custom attributes
          newState[key] = {
            ...newState[key],
            visible: false,
          };
        });
      }

      // add/
      selectedKeys
        && selectedKeys.length
        && selectedKeys.forEach((key) => {
          if (!newState[key]) {
            // initalize key/filter config
            // @TODO: make a constant for this default as it grows more complex
            newState[key] = {
              visible: false,
            };
          }

          newState[key] = { ...newState[key], visible: true };
        });

      return newState;
    });
  };

  return [
    selections,
    {
      onChange,
      resetFilters,
    },
  ];
};

export default useSelectedFilters;
