// js/utils/storage-manager.js
import { db } from '../database/db.js';
import { initialData } from '../database/seed.js';

export class StorageManager {
  /**
   * Export all stores into a single downloadable JSON file
   */
  async exportBackup() {
    const dbInstance = await db.open();
    const storeNames = Array.from(dbInstance.objectStoreNames);
    const backupData = {
      appName: 'StudentManagementSystem',
      version: 1,
      exportedAt: new Date().toISOString(),
      stores: {}
    };

    for (const name of storeNames) {
      backupData.stores[name] = await db.getAll(name);
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sms_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Import data from JSON backup file with format validation
   */
  async importBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);

          // Validation
          if (!data.stores || typeof data.stores !== 'object') {
            throw new Error('Invalid backup format: missing "stores" object.');
          }

          const dbInstance = await db.open();
          for (const storeName of Object.keys(data.stores)) {
            if (dbInstance.objectStoreNames.contains(storeName)) {
              const storeWrite = await db.getStore(storeName, 'readwrite');
              storeWrite.clear();

              for (const record of data.stores[storeName]) {
                await db.add(storeName, record);
              }
            }
          }
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read backup file.'));
      reader.readAsText(file);
    });
  }

  /**
   * Reset database back to default initial seed data
   */
  async resetToDefaults() {
    const dbInstance = await db.open();
    for (const name of Array.from(dbInstance.objectStoreNames)) {
      const store = await db.getStore(name, 'readwrite');
      store.clear();
    }

    for (const storeName of Object.keys(initialData)) {
      for (const item of initialData[storeName]) {
        await db.add(storeName, item);
      }
    }
  }
}

export const storageManager = new StorageManager();