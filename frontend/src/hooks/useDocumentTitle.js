import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE = "Task Manager";

export function useDocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/500") {
      document.title = `Server error · ${BASE}`;
      return;
    }
    if (pathname === "/login") {
      document.title = `Sign in · ${BASE}`;
      return;
    }
    if (pathname === "/register") {
      document.title = `Register · ${BASE}`;
      return;
    }
    if (pathname === "/tasks") {
      document.title = `Tasks · ${BASE}`;
      return;
    }
    if (pathname === "/" || pathname === "/dashboard") {
      document.title = `Dashboard · ${BASE}`;
      return;
    }
    document.title = `Not found · ${BASE}`;
  }, [pathname]);
}
