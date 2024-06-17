import { ReactElement, useCallback, useState } from "react";
import { Button, SectionList, Text, View } from "react-native";
import {
  useRookAppleHealthVariables,
  useRookConfiguration,
} from "react-native-rook-sdk";
import { session } from "../../helpers/session";
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
      await updateUserID(session.userUuid);
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
          { title: "Today Steps", data: [todaySteps] },
          {
            title: "Today Active Calories Burned",
            data: [todayActiveCaloriesBurned],
          },
        ]}
        showsVerticalScrollIndicator={false}
        style={styles.sectionDefault}
      />
      <Button
        disabled={
          !readyRookConfiguration ||
          !readyRookAppleHealthVariables ||
          submitting
        }
        title={submitting ? "Wait..." : "Get steps count for iOS!"}
        onPress={doPress}
      />
    </>
  );
}
