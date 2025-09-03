/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { AccountInfo } from "api";

const DATABASE_NAME = "moment-up-db";
const DATABASE_VERSION = 1;
const ACCOUNTS_STORE = "accounts";

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(ACCOUNTS_STORE)) {
          const accountsStore = db.createObjectStore(ACCOUNTS_STORE, {
            keyPath: "id",
          });
          accountsStore.createIndex("username", "username", { unique: true });
        }
      };
    });
  }

  async getAllAccounts() {
    try {
      if (!this.db) await this.init();

      const transaction = this.db!.transaction([ACCOUNTS_STORE], "readonly");
      const store = transaction.objectStore(ACCOUNTS_STORE);
      const request = store.getAll();

      return new Promise<AccountInfo[] | null>((resolve) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async storeAccount(account: AccountInfo) {
    try {
      if (!this.db) await this.init();

      const transaction = this.db!.transaction([ACCOUNTS_STORE], "readwrite");
      const store = transaction.objectStore(ACCOUNTS_STORE);
      const request = store.put(account);

      return new Promise((resolve) => {
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }

  async removeAccount(accountId: string) {
    try {
      if (!this.db) await this.init();

      const transaction = this.db!.transaction([ACCOUNTS_STORE], "readwrite");
      const store = transaction.objectStore(ACCOUNTS_STORE);
      const request = store.delete(accountId);

      return new Promise((resolve) => {
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }

  async clearAllAccounts() {
    try {
      if (!this.db) await this.init();

      const transaction = this.db!.transaction([ACCOUNTS_STORE], "readwrite");
      const store = transaction.objectStore(ACCOUNTS_STORE);
      const request = store.clear();

      return new Promise((resolve) => {
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }
}

export const indexedDBService = new IndexedDBService();
