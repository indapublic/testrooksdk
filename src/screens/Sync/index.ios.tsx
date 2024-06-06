import { ReactElement, useCallback, useEffect, useState } from "react";
import { Button, SectionList, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import {
  useRookAppleHealth,
  useRookConfiguration,
  useRookSummaries,
} from "react-native-rook-sdk";
import { session } from "../../helpers/session";
import styles from "./styles";

export function Sync(): ReactElement {
  const { ready: readyRookConfiguration, updateUserID } =
    useRookConfiguration();
  const [submitting, toggleSubmitting] = useState(false);
  const {
    ready: readyRookSummaries,
    reSyncFailedSummaries,
    syncSleepSummary,
    syncPhysicalSummary,
    syncBodySummary,
  } = useRookSummaries();
  const { ready: rookAppleHealthReady, enableBackGroundUpdates } =
    useRookAppleHealth();
  const [syncing, setSyncing] = useState(false);
  const [syncDate, setSyncDate] = useState<string>("");
  const [data, setData] = useState<
    Array<{ title: string; data: Array<string> }>
  >([
    {
      title: "Your User Id",
      data: [session.userUuid],
    },
    {
      title: "Background sync enabled",
      data: [syncing ? "Yes" : "No"],
    },
  ]);

  useEffect(() => {
    readyRookConfiguration && updateUserID(session.userUuid);
  }, [readyRookConfiguration]);

  useEffect(() => {
    console.debug(`rookAppleHealthReady = ${rookAppleHealthReady}`);
    if (rookAppleHealthReady) {
      enableBackGroundUpdates()
        .then(() => {
          setSyncing(true);
          setData([
            { title: "Your User Id", data: [session.userUuid] },
            { title: "Background sync enabled", data: ["Yes"] },
          ]);
        })
        .catch(() => {
          setSyncing(false);
          setData([
            { title: "Your User Id", data: [session.userUuid] },
            { title: "Background sync enabled", data: ["Error"] },
          ]);
        });
    }
  }, [rookAppleHealthReady]);

  const doSync = useCallback(async (): Promise<void> => {
    if (0 === syncDate.length) {
      return;
    }

    const data: Array<{ title: string; data: Array<string> }> = [
      { title: "Your User Id", data: [session.userUuid] },
      { title: "Background sync enabled", data: [syncing ? "Yes" : "No"] },
    ];

    try {
      toggleSubmitting(true);

      await updateUserID(session.userUuid);

      await reSyncFailedSummaries();
      await syncSleepSummary(syncDate);
      await syncPhysicalSummary(syncDate);
      await syncBodySummary(syncDate);

      data.push({ title: "Result", data: ["OK"] });

      setData(data);
    } catch (err) {
      setData([
        { title: "Your User Id", data: [session.userUuid] },
        { title: "Background sync enabled", data: [syncing ? "Yes" : "No"] },
        { title: "Result", data: ["Error"] },
        {
          title: "Error",
          data: [JSON.stringify(err)],
        },
      ]);
    } finally {
      toggleSubmitting(false);
    }
  }, [
    readyRookSummaries,
    reSyncFailedSummaries,
    syncSleepSummary,
    syncPhysicalSummary,
    syncBodySummary,
    syncDate,
    syncing,
  ]);

  const doSelect = useCallback((value: DateData): void => {
    setSyncDate(value.dateString);
  }, []);

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
        sections={data}
        showsVerticalScrollIndicator={false}
        style={styles.sectionDefault}
      />
      <Calendar
        onDayPress={doSelect}
        markedDates={{
          [syncDate]: { selected: true },
        }}
      />
      <Button
        disabled={
          !readyRookConfiguration ||
          !readyRookSummaries ||
          0 === syncDate.length ||
          submitting
        }
        title={
          submitting
            ? "Wait..."
            : 0 === syncDate.length
            ? "Choose date first"
            : `Sync for ${syncDate}`
        }
        onPress={doSync}
      />
    </>
  );
}
