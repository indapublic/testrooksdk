/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { ReactElement } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { RookSyncGate } from "react-native-rook-sdk";
import { Providers } from "./src/providers";
import { Screens } from "./src/screens";

export function App(): ReactElement {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#ffffff" barStyle="light-content" />
      <RookSyncGate
        environment="sandbox"
        clientUUID="56d4ae03-5bbb-4a1a-972b-e79d6302cf03"
        password="AFhHtKITlIk7UdQrmgWygVz9zUNSOdmQ9xFH"
        enableLogs>
        <Providers.Rook>
          <Screens.Sync />
        </Providers.Rook>
      </RookSyncGate>
    </SafeAreaView>
  );
}
