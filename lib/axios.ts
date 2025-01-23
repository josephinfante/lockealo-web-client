import { API_URL, HOST_URL } from '@/config/envd'
import axios from 'axios'

export const API = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})

export const HOST = axios.create({
	baseURL: HOST_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})
