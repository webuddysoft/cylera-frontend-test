import React from "react";
import PayloadCard from "./components/PayloadCard";
import missionsJson from "./dataset/missions.json";

function App() {
  return (
    <div className="m-10">
      <PayloadCard missions={missionsJson.data.missions}/>
    </div>
  );
}

export default App;
