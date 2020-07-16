import { useCallback } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useLayoutDispatch } from '~/contexts/LayoutState';

import pluralizeOrder from '~/utilities/pluralizeOrder';

const useCopyNotify = () => {
  const { notify } = useLayoutDispatch();
  const [, copyToClipboard] = useCopyToClipboard();

  const copyNotify = useCallback(({ numbers, verb = null }) => {
    const verbTxt = verb || pluralizeOrder(numbers, 'Order Number', true);

    copyToClipboard(numbers.join(', '));
    notify.success(
      `Copied ${verbTxt} to clipboard.`,
    );
  }, []);

  return copyNotify;
};

export default useCopyNotify;
