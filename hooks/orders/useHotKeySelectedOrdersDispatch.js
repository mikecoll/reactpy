import { useSelectedOrdersDispatch } from '../../contexts/SelectedOrdersState';

const useHotKeySelectedOrdersDispatch = () => {
  const dispatch = useSelectedOrdersDispatch();

  // TODO: override functions with HotKey specific functionality

  return {
    ...dispatch,
  };
};

export default useHotKeySelectedOrdersDispatch;
