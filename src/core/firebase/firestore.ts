import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type WithFieldValue,
} from 'firebase/firestore'
import type { QueryFilter, QueryOptions } from '@/types'
import { getFirestoreDb } from './firebase.config'

function buildConstraints(options?: QueryOptions): QueryConstraint[] {
  const constraints: QueryConstraint[] = []

  options?.filters?.forEach((filter: QueryFilter) => {
    constraints.push(where(filter.field, filter.operator, filter.value))
  })

  if (options?.orderBy) {
    constraints.push(orderBy(options.orderBy.field, options.orderBy.direction ?? 'asc'))
  }

  if (options?.limit) {
    constraints.push(limit(options.limit))
  }

  if (options?.startAfter) {
    constraints.push(startAfter(options.startAfter))
  }

  return constraints
}

export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>,
  id?: string,
): Promise<string> {
  const db = getFirestoreDb()
  if (id) {
    await setDoc(doc(db, collectionName, id), data)
    return id
  }
  const ref = await addDoc(collection(db, collectionName), data)
  return ref.id
}

export async function getDocument<T>(
  collectionName: string,
  id: string,
): Promise<(T & { id: string }) | null> {
  const snapshot = await getDoc(doc(getFirestoreDb(), collectionName, id))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...(snapshot.data() as T) }
}

export async function getDocuments<T>(
  collectionName: string,
  options?: QueryOptions,
): Promise<Array<T & { id: string }>> {
  const q = query(collection(getFirestoreDb(), collectionName), ...buildConstraints(options))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as T) }))
}

export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>,
): Promise<void> {
  await updateDoc(doc(getFirestoreDb(), collectionName, id), data as DocumentData)
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  await deleteDoc(doc(getFirestoreDb(), collectionName, id))
}

export async function upsertDocument(
  collectionName: string,
  id: string,
  data: DocumentData,
): Promise<void> {
  await setDoc(doc(getFirestoreDb(), collectionName, id), data, { merge: true })
}
