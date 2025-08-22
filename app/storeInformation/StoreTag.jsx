import React from "react";
import { XStack, Button } from "tamagui";
import Skeleton from "../../components/Skeleton";

const StoreTags = ({ loading, tags }) => {
  if (loading) {
    return (
      <XStack gap="$2" mt="$2" flexWrap="wrap">
        <Skeleton width={110} height={30} borderRadius="$10" />
        <Skeleton width={80} height={30} borderRadius="$10" />
        <Skeleton width={70} height={30} borderRadius="$10" />
      </XStack>
    );
  }

  return (
    <XStack gap="$2" mt="$2" flexWrap="wrap">
      {tags.map((tag) => (
        <Button
          key={tag.categoryId}
          backgroundColor="$primary"
          fontWeight="700"
          color="#fff"
          size="$2"
          theme="alt1"
          borderRadius="$10"
          disabled
          pressStyle={{ bg: "$primary" }}
        >
          {tag.name}
        </Button>
      ))}
    </XStack>
  );
};

export default StoreTags;
