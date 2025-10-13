export interface NewPlayerFormData {
	is_couple: boolean
	player_name: string
	second_player: string
	email: string
	phone: string
	status: 'active' | 'inactive'
}

export interface PlayerSendData
	extends Omit<NewPlayerFormData, 'second_player' | 'player_name'> {
	first_name: string
	last_name: string
}
