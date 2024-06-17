import {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import { useRookPermissions } from "react-native-rook-sdk";
import { AskForPermissions } from "./components";
import { RookContext } from "./context";
import { AvailabilityType, RookContextProps } from "./types";

export function Provider(
  props: PropsWithChildren,
): ReactElement<PropsWithChildren> {
  const { children } = props;
  const {
    ready,
    requestAllPermissions,
    requestAndroidBackgroundPermissions,
    checkAvailability,
  } = useRookPermissions();
  const [availability, setAvailability] = useState<AvailabilityType>(null);
  const [granted, toggleGranted] = useState(false);

  const requestPermissions = useCallback(async (): Promise<void> => {
    if (!ready) {
      console.error("not ready");

      return;
    }

    const availability = await checkAvailability();
    setAvailability(availability);

    if ("INSTALLED" !== availability) {
      return;
    }

    switch (Platform.OS) {
      case "android":
        try {
          await requestAllPermissions();
          await requestAndroidBackgroundPermissions();

          toggleGranted(true);
        } catch (err) {
          console.error(err);
        }

        break;

      case "ios":
        try {
          await requestAllPermissions();

          toggleGranted(true);
        } catch (err) {
          console.error(err);
        }

        break;
    }
  }, [ready]);

  const memoizedValue = useMemo(
    (): RookContextProps => ({
      availability,
      granted,
      requestPermissions,
    }),
    [availability, granted, requestPermissions],
  );

  return (
    <RookContext.Provider value={memoizedValue}>
      {granted ? children : <AskForPermissions />}
    </RookContext.Provider>
  );
}
