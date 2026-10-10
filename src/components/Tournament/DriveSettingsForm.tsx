'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateTournamentDriveMutation } from '@/hooks/mutations/useUpdateTournamentDriveMutation'
import { driveFolderUrl } from '@/interfaces/tournamentInterfaces'
import { isAxiosError } from 'axios'
import { Check, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FormEvent, useState } from 'react'

// Google Drive folder and file name pattern used by "Export PDF to Google Drive" on each group
export default function DriveSettingsForm({
	tournamentId,
	folderId,
	fileName,
}: {
	tournamentId: string
	folderId: string | null
	fileName: string
}) {
	const t = useTranslations('TournamentGroups.drive')
	const [folder, setFolder] = useState(folderId ? driveFolderUrl(folderId) : '')
	const [name, setName] = useState(fileName)
	const save = useUpdateTournamentDriveMutation(tournamentId)
	const invalid =
		isAxiosError(save.error) && save.error.response?.status === 400

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault()
		save.mutate({ folder, file_name: name })
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='mt-6 sm:mt-10 flex flex-col gap-3 rounded-lg border p-4'
		>
			<div className='flex items-center justify-between gap-2'>
				<h2 className='text-lg sm:text-xl font-bold'>{t('title')}</h2>
				{folderId && (
					<a
						href={driveFolderUrl(folderId)}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center gap-1 text-sm text-blue-600'
					>
						{t('open_folder')}
						<ExternalLink className='size-3' />
					</a>
				)}
			</div>
			<p className='text-sm text-muted-foreground'>{t('description')}</p>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div className='space-y-2'>
					<Label htmlFor='drive-folder'>{t('folder_label')}</Label>
					<Input
						id='drive-folder'
						value={folder}
						placeholder='https://drive.google.com/drive/folders/…'
						aria-invalid={invalid}
						onChange={event => {
							setFolder(event.target.value)
							save.reset()
						}}
					/>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='drive-file-name'>{t('file_name_label')}</Label>
					<Input
						id='drive-file-name'
						value={name}
						onChange={event => {
							setName(event.target.value)
							save.reset()
						}}
					/>
					<p className='text-xs text-muted-foreground'>
						{t('file_name_hint', {
							tournament: '{tournament}',
							group: '{group}',
						})}
					</p>
				</div>
			</div>
			<div className='flex flex-wrap items-center gap-3'>
				<Button type='submit' size='sm' disabled={save.isPending}>
					{save.isPending ? t('saving') : t('save')}
				</Button>
				{save.isSuccess && (
					<span
						role='status'
						className='inline-flex items-center gap-1 text-sm text-green-700'
					>
						<Check className='size-4' />
						{t('saved')}
					</span>
				)}
				{save.isError && (
					<span role='alert' className='text-sm text-red-600'>
						{invalid ? t('invalid') : t('save_failed')}
					</span>
				)}
			</div>
		</form>
	)
}
