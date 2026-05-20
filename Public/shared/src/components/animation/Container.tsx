import { useRecoilValue } from "recoil";
import { containerZindex } from "../../recoil/styleState";

function Container({ children }: { children: any }) {
  const zIndex = useRecoilValue(containerZindex);
  return (
    <div
      className={`bg-[#F9FAFA] opacity-0 relative top-3 mt-5 animate-[opacity_0.5s_0.5s_forwards_ease-in-out] ${zIndex} flex flex-col gap-5`}
    >
      {children}
    </div>
  );
}

export default Container;
