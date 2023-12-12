import { createBrowserRouter } from 'react-router-dom';

import { PATHS } from './constants/paths';
import AuthPage from './pages/Auth/Auth';
import NavigateToPlugin from './services/NavigateToPlugin/NavigateToPlugin';
import RequireAuth from './services/RequireAuth/RequireAuth';
import Layout from './ui/templates/Layout/Layout';
import App from './App';

export const router = createBrowserRouter([
  {
    path: PATHS.PATH_MAIN,
    element: <App />,
    children: [
      {
        path: PATHS.PATH_MAIN,
        element: (
          <RequireAuth>
            <NavigateToPlugin />
          </RequireAuth>
        ),
      },
      {
        path: PATHS.PATH_AUTH,
        element: <AuthPage />,
      },
      {
        path: PATHS.PATH_PLUGIN,
        element: <Layout />,
      },
      {
        path: PATHS.PATH_404,
        element: <>404</>,
      },
    ],
  },
]);
