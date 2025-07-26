export interface User {
	id: number
	email: string
	first_name: string
	last_name: string
	created_at: string
}

export interface AuthContextType {
	user: User | null
	loading: boolean
	login: (email: string, password: string) => Promise<void>
	logout: () => Promise<void>
	checkAuth: () => Promise<void>
}
