import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import pageRoutes from './components/routes';
import Locales from './modules/locales/container'
import Socket from './modules/socket/ProviderContainer'
function RouterConfig({ history }) {
  return (
        <Socket>
          <Locales>
            <Router history={history}>
              {pageRoutes}
            </Router>
          </Locales>
        </Socket>

  )
}
export default RouterConfig;
