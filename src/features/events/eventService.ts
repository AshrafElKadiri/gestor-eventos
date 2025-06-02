/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

// Definición de la interfaz para un evento básico
export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

// Referencia a la colección 'events' en Firestore
const eventsCollection = collection(db, 'events');

/**
 * Crea un nuevo evento en Firestore.
 * @param eventData - Objeto con los datos del evento a crear.
 * @returns La promesa con el documento creado.
 */
export const createEvent = async (eventData: any) => {
  return await addDoc(eventsCollection, eventData);
};

/**
 * Obtiene todos los eventos almacenados en Firestore.
 * @returns Un arreglo con los eventos, cada uno incluye su id y datos.
 */
export const getEvents = async () => {
  const snapshot = await getDocs(eventsCollection);
  // Mapea cada documento a un objeto que incluye id y los datos del evento
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Elimina un evento por su id.
 * @param id - Identificador del evento a eliminar.
 */
export const deleteEvent = async (id: string) => {
  return await deleteDoc(doc(db, 'events', id));
};

/**
 * Actualiza los datos de un evento específico.
 * @param id - Identificador del evento a actualizar.
 * @param data - Objeto con los datos a modificar.
 */
export const updateEvent = async (id: string, data: any) => {
  return await updateDoc(doc(db, 'events', id), data);
};

/**
 * Obtiene un evento por su id.
 * @param id - Identificador del evento.
 * @returns El evento con su id y datos, o null si no existe.
 */
export const getEventById = async (id: string) => {
  const ref = doc(db, 'events', id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

/**
 * Registra a un usuario en un evento.
 * Crea o actualiza el documento de registro con email y timestamp.
 * @param eventId - Id del evento donde se registra el usuario.
 * @param user - Objeto usuario que debe contener al menos uid y email.
 */
export const registerUserToEvent = async (eventId: string, user: any) => {
  const ref = doc(db, `events/${eventId}/registrations`, user.uid);
  return await setDoc(ref, {
    email: user.email,
    timestamp: new Date(),
  });
};

/**
 * Obtiene la lista de usuarios registrados en un evento.
 * @param eventId - Id del evento.
 * @returns Un arreglo con los registros de usuarios.
 */
export const getRegistrations = async (eventId: string) => {
  const snap = await getDocs(collection(db, `events/${eventId}/registrations`));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Verifica si un usuario está registrado en un evento.
 * @param eventId - Id del evento.
 * @param userId - Id del usuario.
 * @returns true si el usuario está registrado, false si no.
 */
export const isUserRegistered = async (eventId: string, userId: string) => {
  const ref = doc(db, `events/${eventId}/registrations/${userId}`);
  const snap = await getDoc(ref);
  return snap.exists();
};
