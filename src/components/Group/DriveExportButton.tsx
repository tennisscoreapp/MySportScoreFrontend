'use client'
import { Button } from '@/components/ui/button'
import { useExportToDriveMutation } from '@/hooks/mutations/useExportToDriveMutation'
import { isAxiosError } from 'axios'
import { CloudUpload, ExternalLink, LoaderCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { createGroupPDFBase64 } from './handleDownloadPDF'

// API error codes with their own explanation; anything else is a generic failure
const ERROR_KEYS = {
	drive_folder_missing: 'folder_missing',
	drive_not_configured: 'not_configured',
	drive_folder_unavailable: 'folder_unavailable',
} as const

export default function DriveExportButton({
	groupId,
	tournamentId,
	getExportRoot,
}: {
	groupId: string
	tournamentId: string
	getExportRoot: () => HTMLDivElement | null
}) {
	const t = useTranslations('TournamentGroup.drive_export')
	const exportToDrive = useExportToDriveMutation(groupId)

	const handleExport = () => {
		const root = getExportRoot()
		if (root) exportToDrive.mutate(() => createGroupPDFBase64(root))
	}

	const code = isAxiosError(exportToDrive.error)
		? exportToDrive.error.response?.data?.code
		: undefined
	const errorKey =
		ERROR_KEYS[code as keyof typeof ERROR_KEYS] ?? ('failed' as const)

	return (
		<div className='flex flex-col items-center gap-2 max-w-xs text-center'>
			<Button
				onClick={handleExport}
				variant='secondary'
				className='hover:bg-blue-600 hover:text-white'
				disabled={exportToDrive.isPending}
			>
				{exportToDrive.isPending ? (
					<LoaderCircle className='animate-spin' />
				) : (
					<CloudUpload />
				)}
				{exportToDrive.isPending ? t('uploading') : t('button')}
			</Button>
			{exportToDrive.isSuccess && (
				<p role='status' className='text-sm text-green-700'>
					{t('uploaded')} ·{' '}
					<a
						href={exportToDrive.data.url}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center gap-1 underline'
					>
						{t('open_file')}
						<ExternalLink className='size-3' />
					</a>
				</p>
			)}
			{exportToDrive.isError && (
				<p role='alert' className='text-sm text-red-600'>
					{t(errorKey)}{' '}
					{errorKey === 'folder_missing' && (
						<Link href={`/tournaments/${tournamentId}`} className='underline'>
							{t('tournament_settings')}
						</Link>
					)}
				</p>
			)}
		</div>
	)
}
