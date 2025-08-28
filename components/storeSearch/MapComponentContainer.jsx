import React from "react";
import SearchResultsMap from "./SearchResultsMap";
import SearchResultsSheet from "./SearchResultsSheet";
import { YStack } from "tamagui";

export default MapComponentContainer = ({ searchResults }) => {
  const currentUserLocation = {
    latitude: 37.5595,
    longitude: 127.0053,
  };

  const markers = searchResults.map((item) => ({
    latitude: item.latitude,
    longitude: item.longitude,
    storeId: item.storeId,
  }));

  return (
    <>
      <SearchResultsMap center={currentUserLocation} markers={markers} />
    </>
  );
};
