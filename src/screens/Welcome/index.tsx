import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactElement, useCallback, useEffect, useState } from "react";
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
  const {
    ready: readyRookConfiguration,
    updateUserID,
    clearUserID,
  } = useRookConfiguration();
  const {
    ready: readyRookPermissions,
    requestAllPermissions,
    checkAvailability,
  } = useRookPermissions();
  const { ready: readyRookAppleHealth, enableBackGroundUpdates } =
    useRookAppleHealth();

  const [userId, setUserId] = useState("");
  const [userLogged, setUserLogged] = useState(false);
  const [logs, setLogs] = useState<Array<string>>([]);

  /**
   *
   */
  const loadUser = useCallback(async (): Promise<void> => {
    const value = await AsyncStorage.getItem("userId");
    setUserId(value || "");
  }, []);
  useEffect((): void => {
    loadUser();
  }, [loadUser]);

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

  /**
   *
   */
  const doSignIn = async (): Promise<void> => {
    if (userLogged) {
      return;
    }

    if (!userId.length) {
      return;
    }

    const availability = await checkAvailability();

    if (availability !== "INSTALLED") {
      setLogs(prev => [...prev, `ROOK_${availability}`]);

      return;
    }

    await updateUserID(userId);
    await AsyncStorage.setItem("userId", userId);
    await requestAllPermissions();
    await enableBackGroundUpdates();
    setUserLogged(true);
  };

  /**
   *
   */
  const doRefresh = async (): Promise<void> => {
    if (!userLogged) {
      return;
    }

    if (!userId.length) {
      return;
    }

    await updateUserID(userId);
    await enableBackGroundUpdates();
  };

  /**
   *
   */
  const doSignOut = async (): Promise<void> => {
    if (!userLogged) {
      return;
    }

    await clearUserID();
  };

  return (
    <View style={styles.container}>
      {readyRookConfiguration &&
        readyRookPermissions &&
        readyRookAppleHealth && (
          <View style={styles.content}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>User ID</Text>
                <TextInput
                  autoFocus
                  placeholder="Put user id and press button"
                  readOnly={userLogged}
                  style={styles.textInput}
                  value={userId}
                  onChangeText={setUserId}
                />
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              {!userLogged && (
                <TouchableOpacity
                  disabled={userId.length === 0}
                  style={[
                    styles.pressable,
                    userId.length === 0 && styles.pressableDisabled,
                  ]}
                  onPress={doSignIn}>
                  <Text style={styles.pressableLabel}>Sign in</Text>
                </TouchableOpacity>
              )}
              {userLogged && (
                <TouchableOpacity style={styles.pressable} onPress={doSignOut}>
                  <Text style={styles.pressableLabel}>Sign out</Text>
                </TouchableOpacity>
              )}
              {userLogged && (
                <TouchableOpacity style={styles.pressable} onPress={doRefresh}>
                  <Text style={styles.pressableLabel}>Refresh</Text>
                </TouchableOpacity>
              )}
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
