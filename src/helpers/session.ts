import { MMKV } from "react-native-mmkv";

class Session {
  private _storage: MMKV;
  private _userUuid: string | null = null;

  constructor() {
    this._storage = new MMKV({
      id: `@testrooksdk/settings`,
      encryptionKey: "hunter2",
    });
  }

  public clear(): void {
    this._storage.clearAll();
  }

  public set userUuid(value: string) {
    this._storage.set("userUuid", value);
    this._userUuid = value;
  }

  public get userUuid(): string {
    if (null === this._userUuid) {
      this._userUuid =
        this._storage.getString("userUuid") ||
        (Math.random() + 1).toString(36).substring(7);

      this._storage.set("userUuid", this._userUuid);
    }

    return this._userUuid;
  }
}

export const session = new Session();
