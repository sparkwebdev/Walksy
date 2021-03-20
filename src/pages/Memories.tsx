import React, { useContext } from "react";

import MemoriesContext from "../data/memories-context";
import MemoriesContent from "../components/MemoriesContent";

const GoodMemories: React.FC = () => {
  const memoriesCtx = useContext(MemoriesContext);

  return (
    <MemoriesContent
      title="Good Memories"
      fallbackText="No good memories found."
      memories={memoriesCtx.memories}
    />
  );
};

export default GoodMemories;
