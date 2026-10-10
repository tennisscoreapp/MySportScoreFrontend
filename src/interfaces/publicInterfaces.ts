import { GroupData } from './groupInterfaces'

export interface PublicTournament {
	name: string
	start_date: string
	end_date: string | null
	groups: { id: number; name: string }[]
}

export interface PublicGroup {
	tournament_name: string
	group_data: GroupData
}
