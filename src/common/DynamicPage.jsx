import { useParams } from "react-router-dom";
import AllPages from "./AllPages";

const DynamicPage = () => {
  const { entity, searchParams } = useParams();
  const PageComponent = AllPages[entity];
  const decodedData = searchParams
    ? JSON.parse(decodeURIComponent(searchParams))
    : null;

  // Render the component for the specific entity with decoded data
  return <PageComponent data={decodedData} />;
};

export default DynamicPage;
