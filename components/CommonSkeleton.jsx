import { Skeleton } from "moti/skeleton";
import { YStack, useThemeName } from "tamagui";

/**
 * 앱 전체에서 사용할 공용 스켈레톤 컴포넌트이옵니다.
 * @param isLoading - true이면 스켈레톤 UI를, false이면 children을 보여줍니다.
 * @param children - 로딩이 완료된 후 보여줄 실제 컴포넌트입니다.
 * @param props - width, height, borderRadius 등 Skeleton에 적용할 스타일 속성입니다.
 */
export const CommonSkeleton = ({ isLoading, children, ...props }) => {
  const { width, height } = props;
  const themeName = useThemeName();
  if (isLoading) {
    return (
      <Skeleton
        width={width}
        height={height}
        colorMode={themeName}
        transition={{ type: "timing" }}
      >
        <YStack opacity={0}>{children}</YStack>
      </Skeleton>
    );
  }

  return <>{children}</>;
};
