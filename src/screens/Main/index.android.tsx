import { ReactElement, useCallback, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import {
  useRookAndroidBackgroundSteps,
  useRookConfiguration,
  useRookDataSources,
} from "react-native-rook-sdk";
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
  const [todaySteps, setTodaySteps] = useState<string | null>(null);

  const doPress = useCallback(async (): Promise<void> => {
    try {
      toggleSubmitting(true);
      await updateUserID("foo");
      try {
        setTodaySteps(String(await getTodaySteps()));
      } catch (err) {
        setTodaySteps(JSON.stringify(err));
      }
    } finally {
      toggleSubmitting(false);
    }
  }, [readyRookConfiguration, readyRookAndroidBackgroundSteps]);

  return (
    <View style={styles.containerDefault}>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerDefault}>Today Steps</Text>
        <Text style={styles.textDefault}>{todaySteps}</Text>
      </ScrollView>
      <Button
        disabled={
          !readyRookConfiguration ||
          !readyRookAndroidBackgroundSteps ||
          submitting
        }
        title={submitting ? "Wait..." : "Get steps count for Android!"}
        onPress={doPress}
      />
    </View>
  );
}
