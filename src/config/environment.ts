import { EnvironmentVariables } from '@/interfaces'

const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENTE_MAIL, API_URL } = process.env

const privateKey = JSON.parse(FIREBASE_PRIVATE_KEY || '{}').privateKey

export const environment: EnvironmentVariables = {
  projectId: FIREBASE_PROJECT_ID as string,
  privateKey,
  clientEmail: FIREBASE_CLIENTE_MAIL as string,
  apiUrl: API_URL as string
}
