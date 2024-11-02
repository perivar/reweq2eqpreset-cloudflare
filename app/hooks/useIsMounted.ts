import { useCallback, useEffect, useRef } from "react";

// https://usehooks-ts.com/react-hook/use-is-mounted
// https://gist.github.com/troygoode/0702ebabcf3875793feffe9b65da651a
//
// usage:
// const isMounted = useIsMounted()
// if (isMounted()) setData('OK')
const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true; // Will set it to true on mount ...
    return () => {
      isMounted.current = false;
    }; // ... and to false on unmount
  }, []);

  return useCallback(() => isMounted.current, []);
};

export default useIsMounted;
