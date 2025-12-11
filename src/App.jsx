import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import DefaultRedirect from "./components/navigation/DefaultRedirect";
import PageNotFound from "./components/PageNotFound";
import AppLayout from "./layout/AppLayout";
import ImportDeductee from "./pages/ImportDeductee";
import Settings from "./pages/Settings";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Redirect root to dynamic importDeductee route */}
        <Route path="/" element={<DefaultRedirect />} />

        <Route path="home" element={<AppLayout />} errorElement={<ErrorPage />}>
          <Route
            path="listSearch/importDeductee/:params"
            element={<ImportDeductee />}
          />
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
