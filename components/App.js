import React from 'react';

import Header from './layouts/Header';
import Content from './layouts/Content';
import Body from './layouts/Body';
import Sidebar from './layouts/Sidebar';

import Modals from './Modals/Modals';

import OrderDetails from './OrderDetails/OrderDetails';
import Orders from './Orders/Orders';

const App = () => (
  <Body>
    <Header />
    <div className="flex h-screen justify-between">
      <Content>
        <Orders />
      </Content>
      <Sidebar>
        <OrderDetails />
      </Sidebar>
    </div>
    <Modals />
  </Body>
);

export default App;
