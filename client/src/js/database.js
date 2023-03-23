import { openDB } from 'idb';

const initdb = async () =>
  openDB('texedDB', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('texedDB')) {
        console.log('texedDB database already exists');
        return;
      }
      db.createObjectStore('texedDB', { keyPath: 'id', autoIncrement: true });
      console.log('texedDB database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {

  console.log('PUT to the database');
  const editorDb = await openDB('texedDB', 1);
  const tx = editorDb.transaction('texedDB', 'readwrite');
  const store = tx.objectStore('texedDB');
  const request = store.put({ editor: content });
  const result = await request;
  console.log('🚀 - data saved to the database', result);

};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {

  console.log('GET from the database');
  const editorDb = await openDB('texedDB', 1);
  const tx = editorDb.transaction('texedDB', 'readonly');
  const store = tx.objectStore('texedDB');
  const request = store.getAll();
  const result = await request;
  console.log('result.value', result);
  return result;

}

initdb();
