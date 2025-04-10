import { ReactElement, useEffect, useState } from "react";
import {
  FlatList,
  NativeEventEmitter,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getRookModule,
  useRookAppleHealth,
  useRookConfiguration,
  useRookPermissions,
} from "react-native-rook-sdk";
import styles from "./styles";

/**
 *
 */
export function Welcome(): ReactElement {
  const { ready: readyRookConfiguration, updateUserID } =
    useRookConfiguration();
  const {
    ready: readyRookPermissions,
    requestAllPermissions,
    checkAvailability,
  } = useRookPermissions();
  const { ready: readyRookAppleHealth, enableBackGroundUpdates } =
    useRookAppleHealth();

  const [userId, setUserId] = useState("");
  const [userReady, setUserReady] = useState(false);
  const [logs, setLogs] = useState<Array<string>>([]);

  /**
   *
   */
  useEffect((): (() => void) => {
    const rookModule = getRookModule();
    const eventEmitter = new NativeEventEmitter(rookModule);
    const subscription = eventEmitter.addListener(
      "ROOK_NOTIFICATION",
      (notification): void => {
        setLogs(prev => [...prev, JSON.stringify(notification)]);
      },
    );

    return (): void => {
      subscription.remove();
    };
  }, [setLogs]);

  const doPress = async (): Promise<void> => {
    await updateUserID(userId);
    const availability = await checkAvailability();

    if (availability !== "INSTALLED") {
      throw new Error(`ROOK_${availability}`);
    }

    await requestAllPermissions();
    await enableBackGroundUpdates();
    setUserReady(true);
  };

  return (
    <View style={styles.container}>
      {readyRookConfiguration &&
        readyRookPermissions &&
        readyRookAppleHealth && (
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>User ID</Text>
              <TextInput
                autoFocus
                placeholder="Put user id and press button"
                readOnly={userReady}
                style={styles.textInput}
                value={userId}
                onChangeText={setUserId}
              />
              <TouchableOpacity
                disabled={userId.length === 0 || userReady}
                style={[
                  styles.pressable,
                  (userId.length === 0 || userReady) &&
                    styles.pressableDisabled,
                ]}
                onPress={doPress}>
                <Text style={styles.pressableLabel}>Set user ID</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      <FlatList
        contentContainerStyle={styles.logContentContainer}
        data={logs}
        showsVerticalScrollIndicator
        style={styles.logContainer}
        renderItem={({ item }) => {
          return <Text style={styles.logItem}>{item}</Text>;
        }}
      />
    </View>
  );
}
