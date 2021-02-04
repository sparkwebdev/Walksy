import React, { useContext } from "react";

import WalksContext from "../data/walks-context";
import WalksContent from "../components/WalksContent";

const GuidedWalks: React.FC = () => {
  const walksCtx = useContext(WalksContext);

  const guidedWalks = walksCtx.walks.filter((walk) => walk.type === "guided");
  return (
    <WalksContent
      title="Guided Walks"
      fallbackText="No guided walks found."
      walks={guidedWalks}
    />
  );
};

export default GuidedWalks;
