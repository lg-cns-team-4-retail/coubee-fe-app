import React from "react";
import { YStack, XStack, Text, Input, Button, Paragraph } from "tamagui";
import { Search, ChevronDown } from "@tamagui/lucide-icons";

const OrderHistoryHeader = ({ userName }) => {
  return (
    <YStack space="$4" p="$4" backgroundColor="$cardBg">
      {/* 제목 */}
      <YStack>
        <Paragraph size="$8" fontWeight="bold">
          <Text color="$info">{userName}</Text>님이
        </Paragraph>
        <Paragraph size="$8" fontWeight="bold" color="$gray11">
          구매한 내역이에요
        </Paragraph>
      </YStack>

      {/* 검색창 */}
      <XStack
        ai="center"
        space="$3"
        backgroundColor="$backgroundPress"
        borderRadius="$10"
        px="$3.5"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <Input
          flex={1}
          borderWidth={0}
          backgroundColor="transparent"
          placeholder="주문 내역을 검색해보세요"
          placeholderTextColor="$gray10"
          focusStyle={{
            borderWidth: 0,
          }}
        />
        <Search color="$gray10" />
      </XStack>

      {/* 필터 버튼 */}
      {/* <XStack space="$3">
        <Button
          iconAfter={<ChevronDown size={16} />}
          borderRadius="$10"
          size="$3"
        >
          조회 기간
        </Button>
        <Button
          iconAfter={<ChevronDown size={16} />}
          borderRadius="$10"
          size="$3"
        >
          주문 상태
        </Button>
      </XStack> */}
    </YStack>
  );
};

export default OrderHistoryHeader;
