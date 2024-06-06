import { ReactElement, useCallback, useState } from "react";
import { Button, SectionList, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useRookConfiguration, useRookSummaries } from "react-native-rook-sdk";
import { session } from "../../helpers/session";
import styles from "./styles";

export function Sync(): ReactElement {
  const { ready: readyRookConfiguration, updateUserID } =
    useRookConfiguration();
  const [submitting, toggleSubmitting] = useState(false);
  const {
    ready: readyRookSummaries,
    shouldSyncFor,
    syncSummaries,
    reSyncFailedSummaries,
    syncSleepSummary,
    syncPhysicalSummary,
    syncBodySummary,
  } = useRookSummaries();
  const [syncDate, setSyncDate] = useState<string>("");
  const [data, setData] = useState<
    Array<{ title: string; data: Array<string> }>
  >([
    {
      title: "Your User Id",
      data: [session.userUuid],
    },
  ]);

  const doSync = useCallback(async (): Promise<void> => {
    if (0 === syncDate.length) {
      return;
    }

    const data: Array<{ title: string; data: Array<string> }> = [
      { title: "Your User Id", data: [session.userUuid] },
    ];

    data.push({
      title: "shouldSyncForBody",
      data: [
        (await shouldSyncFor({
          type: "BODY",
          date: syncDate,
        }))
          ? "Yes"
          : "No",
      ],
    });
    data.push({
      title: "shouldSyncForPhysical",
      data: [
        (await shouldSyncFor({
          type: "PHYSICAL",
          date: syncDate,
        }))
          ? "Yes"
          : "No",
      ],
    });
    data.push({
      title: "shouldSyncForSleep",
      data: [
        (await shouldSyncFor({
          type: "SLEEP",
          date: syncDate,
        }))
          ? "Yes"
          : "No",
      ],
    });

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
    shouldSyncFor,
    syncSummaries,
    reSyncFailedSummaries,
    syncSleepSummary,
    syncPhysicalSummary,
    syncBodySummary,
    syncDate,
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
