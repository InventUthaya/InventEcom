import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

export const EvaluateBreadcrumbItems = atom({
  key: "EvaluateBreadcrumbItems",
  default: [
    { id: 1, title: "Overall condition", path: "#", active: true },
    { id: 2, title: "Physical condition", path: "#", active: false },
    {
      id: 3,
      title: "Functional & warranty condition",
      path: "#",
      active: false,
    },
    { id: 4, title: "Exact Value", path: "#", active: false },
  ],
});

export const EvaluateBreadcrumbActive = (id: number) => {
  const [evaluateBreadcrumbItems, setEvaluateBreadcrumbItems] = useRecoilState(
    EvaluateBreadcrumbItems
  );
  // this useEffect will run when the page load and it's only one time
  useEffect(() => {
    // This function updates the active state based on `initialActiveId`
    const updateActiveBreadcrumb = () => {
      const updatedBreadcrumbs = evaluateBreadcrumbItems.map((breadcrumb) => ({
        ...breadcrumb,
        active: breadcrumb.id === id,
      }));

      setEvaluateBreadcrumbItems(updatedBreadcrumbs);
    };

    updateActiveBreadcrumb();
  }, []);
};

export const EvaluateProgressStatus = atom({
  key: "EvaluateProgressStatus",
  default: 0,
});

export const EvaluateProgressSummary = atom<any>({
  key: "EvaluateProgressSummary",
  default: {},
});
