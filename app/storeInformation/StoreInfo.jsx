// components/StoreInfo.js

import React from "react";
import { YStack, Text } from "tamagui";
import Skeleton from "../../components/Skeleton";
import KakaoMap from "../../components/KakaoMap";
import PhoneLink from "../../components/PhoneLink";

const InfoSection = ({ title, children }) => (
  <YStack gap="$3" width="100%">
    <Text fontSize={18} fontWeight="bold" color="$color11">
      {title}
    </Text>
    <YStack backgroundColor="$cardBg" borderRadius="$6" padding="$4" gap="$2">
      {children}
    </YStack>
  </YStack>
);

// 메인 컴포넌트
const StoreInfo = ({ loading, data }) => {
  return (
    <YStack gap="$6" px="$4" mt="$8">
      {/* 가게 소개 */}
      <InfoSection title="가게 소개">
        {loading ? (
          <YStack gap="$2">
            <Skeleton width="100%" height={22} />
            <Skeleton width="100%" height={22} />
            <Skeleton width="85%" height={22} />
          </YStack>
        ) : (
          <Text lineHeight={22}>{data?.description}</Text>
        )}
      </InfoSection>

      {/* 가게 위치 */}
      <InfoSection title="가게 위치">
        {loading ? (
          <Skeleton width="100%" height={150} borderRadius="$4" />
        ) : (
          <KakaoMap latitude={data?.latitude} longitude={data?.longitude} />
        )}
        <Skeleton show={loading}>
          <Text>{data?.storeAddress || "주소를 불러오는 중입니다..."}</Text>
        </Skeleton>
      </InfoSection>

      {/* 영업 시간 */}
      <InfoSection title="영업 시간">
        <Skeleton show={loading}>
          {/* API에서 한 줄로 내려오므로 Text 하나로 처리합니다. */}
          <Text>
            {data?.workingHour || "영업시간 정보를 불러오고 있습니다."}
          </Text>
        </Skeleton>
      </InfoSection>

      {/* 사업자 정보 (API에 연락처만 있으므로 연락처만 표시) */}
      <InfoSection title="연락처">
        <Skeleton show={loading}>
          <PhoneLink phoneNumber={data?.contactNo || "00-0000-0000"} />
        </Skeleton>
      </InfoSection>
    </YStack>
  );
};

export default StoreInfo;
