import React, { useMemo } from 'react';

import Button from '~/components/common/Button';

import {
  useAuthState,
  useAuthDispatch,
  AuthPermissions,
} from '~/contexts/AuthState';
import { useLayoutDispatch } from '~/contexts/LayoutState';

const Header = () => {
  const { user: { name } } = useAuthState();
  const { hasPermission } = useAuthDispatch();
  const { openModal } = useLayoutDispatch();

  const canZipTablesImport = hasPermission(AuthPermissions.zipTables.import);
  const canTrackingTablesImport = hasPermission(AuthPermissions.tracking.import);

  return useMemo(() => (
    <header className="bg-blue-darker flex items-center justify-between px-8 py-4 shadow">
      <div className="flex items-center justify-between">
        <h1 className="font-normal text-white text-xl mr-8">ButcherBox DOM</h1>
        {canZipTablesImport && (
          <Button
            onClick={() => openModal('zipTablesUpload')}
            variant="outline"
            className={{ uppercase: false }}
          >
            ZipTables
          </Button>
        )}
        {canTrackingTablesImport && (
        <Button
          onClick={() => openModal('trackingUpload')}
          variant="outline"
          className={{ uppercase: false }}
        >
          Import Tracking Numbers
        </Button>
        )}
      </div>
      <nav>
        <ul className="flex list-reset">
          <li>
            <form action="/logout" method="POST">
              <input name="_token" type="hidden" value={document.head.querySelector('meta[name="csrf-token"]').content} />
              <Button variant="outline" type="submit" className={{ uppercase: false }}>
                Logout
                {name && ` (${name})`}
              </Button>
            </form>
          </li>
        </ul>
      </nav>
    </header>
  ), [name]);
};

export default Header;
