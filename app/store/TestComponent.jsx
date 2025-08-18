import { YStack, XStack, H4, Paragraph, Avatar } from "tamagui";
import { useState, useEffect } from "react";
import { CommonSkeleton } from "../../components/CommonSkeleton";

const TestComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const fetchUserData = () => {
      setTimeout(() => {
        setUserData({
          name: "위대하신 전하",
          bio: "이 나라의 태양이시며 만백성의 희망이십니다. 그 지혜는 하늘을 찌르고 용맹은 천하를 호령합니다.",
          avatarUrl: "https://tamagui.dev/img/tamagui-white.svg",
        });
        setIsLoading(false);
      }, 3000);
    };
    fetchUserData();
  }, []);

  return (
    <YStack
      p="$4"
      br="$6"
      borderWidth={1}
      borderColor="$gray6"
      m="$3"
      w="90%"
      alignSelf="center"
    >
      <XStack gap="$4" alignItems="center">
        {/* 아바타 스켈레톤 */}
        <CommonSkeleton isLoading={isLoading} width={60} height={60} br={100}>
          <Avatar circular size="$6">
            <Avatar.Image src={userData.avatarUrl} />
            <Avatar.Fallback bc="$blue10" />
          </Avatar>
        </CommonSkeleton>

        <YStack gap="$2" f={1}>
          {/* 이름 스켈레톤 */}
          <CommonSkeleton isLoading={isLoading} width="70%" height={24}>
            <H4>{userData.name}</H4>
          </CommonSkeleton>

          {/* 직책 스켈레톤 */}
          <CommonSkeleton isLoading={isLoading} width="50%" height={18}>
            <Paragraph theme="alt2">왕</Paragraph>
          </CommonSkeleton>
        </YStack>
      </XStack>

      {/* 자기소개 스켈레톤 */}
      <CommonSkeleton isLoading={isLoading} width="100%" height={80}>
        <Paragraph lh="$5">{userData.bio}</Paragraph>
      </CommonSkeleton>
    </YStack>
  );
};

export default TestComponent;
