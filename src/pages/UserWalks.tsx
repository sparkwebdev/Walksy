import React, { useContext } from "react";

import WalksContext from "../data/walks-context";
import WalksContent from "../components/WalksContent";

const UserWalks: React.FC = () => {
  const walksCtx = useContext(WalksContext);

  const userWalks = walksCtx.walks.filter((walk) => walk.type === "user");

  return (
    <WalksContent
      title="User Walks"
      fallbackText="No User Walks found."
      walks={userWalks}
    />
  );
};

export default UserWalks;
