import { ReactElement, useContext, useState } from "react";
import { Button, Text, View } from "react-native";
import Modal from "react-native-modal";
import { RookContext } from "../../context";
import styles from "./styles";

export function AskForPermissions(): ReactElement {
  const { availability, granted, requestPermissions } = useContext(RookContext);
  const [visible, toggleVisible] = useState(null === availability && !granted);

  return (
    <Modal animationIn="fadeIn" isVisible={visible}>
      <View style={styles.containerDefault}>
        <View style={styles.contentDefault}>
          {null !== availability && (
            <Text style={styles.messageDefault}>{availability}</Text>
          )}
          <Text style={styles.messageDefault}>
            Please grant the necessary permissions
          </Text>
          <View style={{ flexDirection: "column" }}>
            <Button title="Request Permissions" onPress={requestPermissions} />
            <View style={{ height: 10 }} />
            <Button
              color="red"
              title="Close"
              onPress={() => toggleVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
