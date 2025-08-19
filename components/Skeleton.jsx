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
    >
      {children}
    </SkeletonComponent>
  );
};
