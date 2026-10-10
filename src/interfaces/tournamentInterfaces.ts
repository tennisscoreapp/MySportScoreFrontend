export interface Tournament {
	scoring_mode?: 'tennis' | 'legacy'
	id: number
	user_id: number
	name: string
	year: number
	start_date: string
	end_date: string
	status: 'active' | 'completed' | 'cancelled'
	created_at: string
	public_token: string
	// null until a Google Drive folder is set for PDF export
	drive_folder_id: string | null
	drive_file_name: string
}

export interface DriveSettings {
	drive_folder_id: string | null
	drive_file_name: string
}

export const driveFolderUrl = (folderId: string) =>
	`https://drive.google.com/drive/folders/${folderId}`

export interface TournamentGroup {
	id: number
	tournament_id: number
	name: string
	status: 'active' | 'completed' | 'cancelled'
	created_at: string
	is_public: boolean
}
