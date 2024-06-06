/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { ReactElement } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { RookSyncGate } from "react-native-rook-sdk";
import { Environment } from "react-native-rook-sdk/lib/typescript/src/context/RookSyncGateTypes";
import env from "./env.json";
import { Screens } from "./src/screens";

export function App(): ReactElement {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#ffffff" barStyle="light-content" />
      <RookSyncGate
        enableBackgroundSync
        enableEventsBackgroundSync
        clientUUID={env.ROOK_CLIENT_ID}
        enableLogs
        environment={env.ROOK_ENVIRONMENT as Environment}
        password={env.ROOK_PASSWORD}>
        <Screens.Welcome />
      </RookSyncGate>
    </SafeAreaView>
  );
}
