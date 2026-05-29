import { useEffect, useState } from "react";

export function useHashRoute() {
  const readRoute = () => window.location.hash.replace("#", "") || "/login";
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (nextRoute) => {
    window.location.hash = nextRoute;
  };

  return [route, navigate];
}
