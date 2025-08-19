// components/Skeleton.js

import { Skeleton as SkeletonComponent } from "moti/skeleton";
import { useThemeName } from "tamagui";

export default Skeleton = ({ width, height, show, children, ...props }) => {
  const themeName = useThemeName();
  return (
    <SkeletonComponent
      transition={{ type: "timing" }}
      colorMode={themeName}
      show={show}
      width={width}
      height={height}
      {...props} // 다른 props도 전달되도록 추가
    >
      {/* show가 true일 때는 스켈레톤 UI만 필요하므로 자식 렌더링을 막고,
        false일 때만 자식을 보여주는 것이 더 안정적입니다.
      */}
      {show ? null : children}
    </SkeletonComponent>
  );
};
