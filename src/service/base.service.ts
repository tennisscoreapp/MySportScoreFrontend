import axios from 'axios'

export class BaseService {
	private client = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
		withCredentials: true,
	})

	protected async get<T>(url: string): Promise<T> {
		const response = await this.client.get<T>(url)
		return response.data
	}

	protected async post<T>(url: string, data: unknown): Promise<T> {
		const response = await this.client.post<T>(url, data)
		return response.data
	}

	protected async put<T>(url: string, data: unknown): Promise<T> {
		const response = await this.client.put<T>(url, data)
		return response.data
	}

	protected async delete<T>(url: string): Promise<T> {
		const response = await this.client.delete<T>(url)
		return response.data
	}
}
