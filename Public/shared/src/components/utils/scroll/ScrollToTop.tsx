import { useEffect } from "react";
import { useSearchParams } from 'next/navigation';

const useScrollToTop = () => {
  const pathname = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
