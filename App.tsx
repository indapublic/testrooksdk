/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { ReactElement } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { RookSyncGate } from "react-native-rook-sdk";
import { Screens } from "./src/screens";

export function App(): ReactElement {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#ffffff" barStyle="light-content" />
      <RookSyncGate
        enableBackgroundSync
        enableEventsBackgroundSync
        clientUUID="88e4e31c-2a2a-4b8b-adda-112142651364"
        enableLogs
        environment="sandbox"
        password="8oi5C47Q1GvjztMKZT5wbTSggO46rbdHlUS7">
        <Screens.Welcome />
      </RookSyncGate>
    </SafeAreaView>
  );
}
