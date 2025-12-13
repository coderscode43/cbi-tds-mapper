import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import DynamicPage from "./common/DynamicPage";
import ErrorPage from "./components/ErrorPage";
import DefaultRedirect from "./components/navigation/DefaultRedirect";
import PageNotFound from "./components/PageNotFound";
import AppLayout from "./layout/AppLayout";
import Settings from "./pages/Settings";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Redirect root to dynamic deposit route */}
        <Route path="/" element={<DefaultRedirect />} />

        <Route path="home" element={<AppLayout />} errorElement={<ErrorPage />}>
          <Route path="listSearch/:entity/:params" element={<DynamicPage />} />
          <Route path="list/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </>
    ),
    {
      basename: "/TDSMapper",
    }
  );
  return <RouterProvider router={router} />;
};

export default App;
