import { ReactElement, useCallback, useState } from "react";
import { Button, SectionList, Text, View } from "react-native";
import {
  useRookAndroidBackgroundSteps,
  useRookConfiguration,
  useRookDataSources,
} from "react-native-rook-sdk";
import { session } from "../../helpers/session";
import styles from "./styles";

export function Main(): ReactElement {
  const { ready: readyRookConfiguration, updateUserID } =
    useRookConfiguration();
  const { getAvailableDataSources, presentDataSourceView } =
    useRookDataSources();
  const {
    ready: readyRookAndroidBackgroundSteps,
    startSteps,
    stopSteps,
    isStepsAvailable,
    hasStepsPermissions,
    isStepsActive,
    getTodaySteps,
  } = useRookAndroidBackgroundSteps();
  const [submitting, toggleSubmitting] = useState(false);
  const [isStepsAvailableState, setIsStepsAvailableState] = useState(false);
  const [hasStepsPermissionsState, setHasStepsPermissionsState] =
    useState(false);
  const [isStepsActiveState, setIsStepsActiveState] = useState(false);
  const [todaySteps, setTodaySteps] = useState<string | null>(null);

  const doPress = useCallback(async (): Promise<void> => {
    try {
      toggleSubmitting(true);
      await updateUserID(session.userUuid);
      try {
        await startSteps();
        setIsStepsAvailableState(await isStepsAvailable());
        setHasStepsPermissionsState(await hasStepsPermissions());
        setIsStepsActiveState(await isStepsActive());
        setTodaySteps(String(await getTodaySteps()));
      } catch (err) {
        setTodaySteps(JSON.stringify(err));
      }
    } finally {
      toggleSubmitting(false);
    }
  }, [readyRookConfiguration, readyRookAndroidBackgroundSteps]);

  return (
    <>
      <SectionList
        horizontal={false}
        keyExtractor={(item, index) => `${item}${index}`}
        renderItem={({ item }) => (
          <View style={styles.itemDefault}>
            <Text style={styles.itemTextDefault}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.headerDefault}>{title}</Text>
        )}
        sections={[
          { title: "Your User Id", data: [session.userUuid] },
          {
            title: "isStepsAvailable",
            data: [isStepsAvailableState ? "Yes" : "No"],
          },
          {
            title: "hasStepsPermissions",
            data: [hasStepsPermissionsState ? "Yes" : "No"],
          },
          {
            title: "isStepsActive",
            data: [isStepsActiveState ? "Yes" : "No"],
          },
          { title: "Today Steps", data: [todaySteps] },
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.sectionDefault}
      />
      <Button
        disabled={
          !readyRookConfiguration ||
          !readyRookAndroidBackgroundSteps ||
          submitting
        }
        title={submitting ? "Wait..." : "Get steps count for Android!"}
        onPress={doPress}
      />
    </>
  );
}
