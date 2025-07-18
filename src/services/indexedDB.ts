import type { AccountInfo, API } from "api";

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

  async getAllAccounts(): Promise<API<AccountInfo[]>> {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([ACCOUNTS_STORE], "readonly");
        const store = transaction.objectStore(ACCOUNTS_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve({
            success: true,
            message: "Accounts fetched successfully",
            data: request.result,
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            message: "Failed to fetch accounts from IndexedDB",
          });
        };
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
      return {
        success: false,
        message: "Failed to access IndexedDB",
      };
    }
  }

  async storeAccount(account: AccountInfo): Promise<API<void>> {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([ACCOUNTS_STORE], "readwrite");
        const store = transaction.objectStore(ACCOUNTS_STORE);
        const request = store.put(account);

        request.onsuccess = () => {
          resolve({
            success: true,
            message: "Account stored successfully",
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            message: "Failed to store account in IndexedDB",
          });
        };
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
      return {
        success: false,
        message: "Failed to access IndexedDB",
      };
    }
  }

  async storeMultipleAccounts(accounts: AccountInfo[]): Promise<API<void>> {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([ACCOUNTS_STORE], "readwrite");
        const store = transaction.objectStore(ACCOUNTS_STORE);

        let completedCount = 0;
        let hasError = false;

        if (accounts.length === 0) {
          resolve({
            success: true,
            message: "No accounts to store",
          });
          return;
        }

        for (const account of accounts) {
          const request = store.put(account);

          request.onsuccess = () => {
            completedCount++;
            if (completedCount === accounts.length) {
              resolve({
                success: !hasError,
                message: hasError
                  ? "Some accounts failed to store"
                  : "All accounts stored successfully",
              });
            }
          };

          request.onerror = () => {
            hasError = true;
            completedCount++;
            if (completedCount === accounts.length) {
              resolve({
                success: false,
                message: "Failed to store some accounts",
              });
            }
          };
        }
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
      return {
        success: false,
        message: "Failed to access IndexedDB",
      };
    }
  }

  async removeAccount(accountId: string): Promise<API<void>> {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([ACCOUNTS_STORE], "readwrite");
        const store = transaction.objectStore(ACCOUNTS_STORE);
        const request = store.delete(accountId);

        request.onsuccess = () => {
          resolve({
            success: true,
            message: "Account removed successfully",
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            message: "Failed to remove account from IndexedDB",
          });
        };
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
      return {
        success: false,
        message: "Failed to access IndexedDB",
      };
    }
  }

  async clearAllAccounts(): Promise<API<void>> {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve) => {
        const transaction = this.db!.transaction([ACCOUNTS_STORE], "readwrite");
        const store = transaction.objectStore(ACCOUNTS_STORE);
        const request = store.clear();

        request.onsuccess = () => {
          resolve({
            success: true,
            message: "All accounts cleared successfully",
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            message: "Failed to clear accounts from IndexedDB",
          });
        };
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
      return {
        success: false,
        message: "Failed to access IndexedDB",
      };
    }
  }
}

export const indexedDBService = new IndexedDBService();
