import { StyleSheet } from "react-native";

const spacing = 4;

export default StyleSheet.create({
  container: {
    backgroundColor: "#f5f6fa",
    flex: 1,
    flexDirection: "column",
    gap: spacing * 5,
    padding: spacing * 4,
  },
  content: {
    flexDirection: "column",
    gap: spacing * 5,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    gap: spacing * 5,
  },
  label: {
    color: "#6b7280",
    fontWeight: "bold",
    fontSize: spacing * 5,
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderRadius: spacing * 5,
    color: "#1c1c1e",
    fontSize: spacing * 5,
    paddingHorizontal: spacing * 8,
    paddingVertical: spacing * 6,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: spacing * 4,
  },
  pressable: {
    alignItems: "center",
    borderRadius: spacing * 5,
    backgroundColor: "#0000ff",
    flex: 1,
    justifyContent: "center",
    padding: spacing * 5,
  },
  pressableDisabled: {
    backgroundColor: "#aaa",
  },
  pressableLabel: {
    color: "#ffffff",
    fontSize: spacing * 5,
    fontWeight: "bold",
  },
  logContainer: {
    backgroundColor: "#6b7280",
    borderRadius: spacing * 5,
    flex: 1,
  },
  logContentContainer: {
    padding: spacing * 4,
  },
  logItem: {
    color: "#ffffff",
    fontSize: spacing * 5,
  },
});
