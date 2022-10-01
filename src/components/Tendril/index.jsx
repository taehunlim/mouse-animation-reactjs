import { useRef, useEffect } from "react";

import { tendrilAnimation } from "./tendrilAnimation";

function TendrilAnimation({ trails, settings }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current;

      tendrilAnimation({
        canvas,
        trails,
        settings,
      });
    }
  }, [ref]);
  return <canvas ref={ref}></canvas>;
}

export default TendrilAnimation;
