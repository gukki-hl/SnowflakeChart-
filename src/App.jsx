import SnowflakeChart from "./components/SnowflakeChart";
import dimensionData from "./dimensionData.json";

const App = () => {
  return <SnowflakeChart data={dimensionData} />;
};

export default App;
