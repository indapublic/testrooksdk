import { StyleSheet } from "react-native";

const spacing = 4;

export default StyleSheet.create({
  container: {
    backgroundColor: "#F5F6FA",
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    gap: spacing * 5,
    padding: spacing * 5,
  },
  label: {
    color: "#6B7280",
    fontWeight: "bold",
    fontSize: spacing * 5,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: spacing * 5,
    color: "#1C1C1E",
    fontSize: spacing * 5,
    paddingHorizontal: spacing * 8,
    paddingVertical: spacing * 6,
  },
  pressable: {
    alignItems: "center",
    borderRadius: spacing * 5,
    backgroundColor: "#00f",
    justifyContent: "center",
    padding: spacing * 5,
  },
  pressableDisabled: {
    backgroundColor: "#aaa",
  },
  pressableLabel: {
    color: "#fff",
    fontSize: spacing * 5,
    fontWeight: "bold",
  },
  logContainer: {
    backgroundColor: "#6B7280",
    flex: 1,
  },
  logContentContainer: {
    padding: spacing * 4,
  },
  logItem: {
    color: "#FFFFFF",
    fontSize: spacing * 5,
  },
});
