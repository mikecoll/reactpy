import { useSelectedOrdersState } from '../../contexts/SelectedOrdersState';
import { useLayoutDispatch } from '../../contexts/LayoutState';

import { getOrdersExport } from '../../utilities/api';

const exporter = {
  exportTypes: {
    orders: 'EXPORT_ORDERS',
    lineItems: 'EXPORT_LINE_ITEMS',
    substitutions: 'EXPORT_SUBS',
  },
  downloadCsv: async (csvData, filename) => {
    const url = window.URL.createObjectURL(new Blob([csvData]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    return this;
  },
  notifySuccess: ({
    selectedOrders, exportType, notify,
  }) => {
    const orderVerb = (selectedOrders.length === 1)
      ? 'Order'
      : `${selectedOrders.length} Orders`;

    const message = (selectedOrders.length === 1)
      ? `Successfully Exported Selected ${exportType}`
      : `Successfully Exported Selected ${exportType}`;

    return notify(message);
  },
  getFileFormatTime: () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;// JavaScript months are 0-based.
    const d = today.getDate();
    const h = today.getHours();
    const mi = today.getMinutes();
    const s = today.getSeconds();
    return `${y}-${m}-${d}-${h}${mi}${s}`;
  },
};

const useExportOrders = () => {
  const { selectedOrders } = useSelectedOrdersState();
  const { notify } = useLayoutDispatch();

  const exportOrders = async (
    exportType = exporter.exportTypes.orders,
  ) => {
    const response = await getOrdersExport(
      selectedOrders,
      exportType,
    );

    const fileNameHeader = 'content-disposition';
    const suggestedFileName = response.headers[fileNameHeader]
      .replace('attachment; filename=', '');
    const effectiveFileName = (!suggestedFileName)
      ? `DOM-orders${exportType ? '-line-items' : ''}-${exporter.getFileFormatTime()}.csv`
      : suggestedFileName;

    exporter.downloadCsv(response.data, effectiveFileName) && exporter.notifySuccess({
      selectedOrders,
      exportType,
      notify: notify.success,
    });
  };

  return [exportOrders];
};

export default useExportOrders;
