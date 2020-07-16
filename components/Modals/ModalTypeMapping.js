import CancelOrdersModalContainer from '~/containers/CancelOrdersModalContainer';
import EditOrderModalContainer from '~/containers/EditOrderModalContainer';
import EditOrdersModalContainer from '~/containers/EditOrdersModalContainer';
import HoldOrdersModalContainer from '~/containers/HoldOrdersModalContainer';
import ReleaseOrdersModalContainer from '~/containers/ReleaseOrdersModalContainer';
import SubstituteProductsModalContainer from '~/containers/SubstituteProductsModalContainer';
import StageOrdersModalContainer from '~/containers/StageOrdersModalContainer';
import UnstageOrdersModalContainer from '~/containers/UnstageOrdersModalContainer';

import PreflightProcessZeroFixModal from './releaseOrders/PreflightProcessZeroFixModal';
import PreflightLaserShipFixModal from './releaseOrders/PreflightLaserShipFixModal';
import ZipTablesUploadModal from './ZipTables/ZipTablesUploadModal';
import TrackingUploadModal from './Tracking/TrackingUploadModal';
import SubstituteProductTypes from './Substitute/SubstituteProductTypesModel';

export default {
  editOrder: EditOrderModalContainer,
  editOrders: EditOrdersModalContainer,
  holdOrders: HoldOrdersModalContainer,
  substituteProducts: SubstituteProductsModalContainer,
  substituteProductTypes: SubstituteProductTypes,

  cancelOrders: CancelOrdersModalContainer,
  releaseOrders: ReleaseOrdersModalContainer,
  stageOrders: StageOrdersModalContainer,
  unstageOrders: UnstageOrdersModalContainer,

  // Preflight Fix Modals
  preflightProcessZeroFix: PreflightProcessZeroFixModal,
  preflightLaserShipFix: PreflightLaserShipFixModal,

  zipTablesUpload: ZipTablesUploadModal,
  trackingUpload: TrackingUploadModal,
};
