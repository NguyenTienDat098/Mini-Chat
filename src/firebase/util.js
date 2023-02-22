import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "./config";

const addDocument = async (colName, docName, data) => {
  await setDoc(doc(db, colName, docName), data);
};

const getSimpleDocument = async (colName, docName) => {
  const docRef = doc(db, colName, docName);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return -1;
  }
};

const getMutipleDocuments = async (colName, fieldName, compare, valueFind) => {
  let response = [];
  const q = query(
    collection(db, colName),
    where(fieldName, compare, valueFind)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc, i) => {
    response.push(doc.data());
  });
  return response;
};

const updateArrayField = async (colName, docName, field, value) => {
  await updateDoc(doc(db, colName, docName), {
    [field]: arrayUnion(value),
  });
};

const updateField = async (colName, docName, field, value) => {
  await updateDoc(doc(db, colName, docName), {
    [field]: value,
  });
};

const listenDocument = (colName, docName, callback) => {
  onSnapshot(doc(db, colName, docName), (doc) => {
    callback(doc.data());
  });
};

const getCollection = async (colName) => {
  let response = [];
  const querySnapshot = await getDocs(collection(db, colName));
  querySnapshot.forEach((doc) => {
    response.push(doc.data());
  });
  return response;
};

export {
  addDocument,
  getSimpleDocument,
  getMutipleDocuments,
  updateArrayField,
  updateField,
  listenDocument,
  getCollection,
};
