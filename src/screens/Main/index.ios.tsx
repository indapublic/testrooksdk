import { ReactElement, useCallback, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import {
  useRookAppleHealthVariables,
  useRookConfiguration,
} from "react-native-rook-sdk";
import styles from "./styles";

export function Main(): ReactElement {
  const { ready: readyRookConfiguration, updateUserID } =
    useRookConfiguration();
  const {
    ready: readyRookAppleHealthVariables,
    getTodaySteps,
    getTodayActiveCaloriesBurned,
    enableBackGroundForSteps,
    enableBackGroundForCalories,
  } = useRookAppleHealthVariables();
  const [submitting, toggleSubmitting] = useState(false);
  const [todaySteps, setTodaySteps] = useState<string | null>(null);
  const [todayActiveCaloriesBurned, setTodayActiveCaloriesBurned] = useState<
    string | null
  >(null);

  const doPress = useCallback(async (): Promise<void> => {
    try {
      toggleSubmitting(true);
      await updateUserID("foo");
      await enableBackGroundForCalories();
      await enableBackGroundForSteps();
      try {
        setTodaySteps(String(await getTodaySteps()));
      } catch (err) {
        setTodaySteps(JSON.stringify(err));
      }
      try {
        setTodayActiveCaloriesBurned(
          String(await getTodayActiveCaloriesBurned()),
        );
      } catch (err) {
        setTodayActiveCaloriesBurned(JSON.stringify(err));
      }
    } finally {
      toggleSubmitting(false);
    }
  }, [readyRookConfiguration, readyRookAppleHealthVariables]);

  return (
    <View style={styles.containerDefault}>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerDefault}>Today Steps</Text>
        <Text style={styles.textDefault}>{todaySteps}</Text>
        <Text style={styles.headerDefault}>Today Active Calories Burned</Text>
        <Text style={styles.textDefault}>{todayActiveCaloriesBurned}</Text>
      </ScrollView>
      <Button
        disabled={
          !readyRookConfiguration ||
          !readyRookAppleHealthVariables ||
          submitting
        }
        title={submitting ? "Wait..." : "Get steps count for iOS!"}
        onPress={doPress}
      />
    </View>
  );
}
