import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'

function GroupPagination({
	pageSize,
	setPageSize,
	page,
	setPage,
	totalPages,
	selectOptions,
}: {
	pageSize: number
	setPageSize: (size: number) => void
	page: number
	setPage: (page: number) => void
	totalPages: number
	selectOptions: number[]
}) {
	const t = useTranslations('TournamentGroup')
	return (
		<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
			<div className='flex items-center gap-2'>
				<span className='text-sm text-muted-foreground'>
					{t('matches_history.pagination.page_size')}
				</span>
				<Select
					value={String(pageSize)}
					onValueChange={v => {
						setPage(1)
						setPageSize(Number(v))
					}}
				>
					<SelectTrigger className='w-[120px]'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{selectOptions.map(option => (
							<SelectItem key={option} value={String(option)}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='flex items-center gap-2'>
				<Button
					variant='outline'
					onClick={() => setPage(Math.max(1, page - 1))}
					disabled={page <= 1}
				>
					{t('matches_history.pagination.previous')}
				</Button>
				<span className='text-sm'>
					{t('matches_history.pagination.page')} {page}{' '}
					{t('matches_history.pagination.of')} {totalPages}
				</span>
				<Button
					variant='outline'
					onClick={() => setPage(Math.min(totalPages, page + 1))}
					disabled={page >= totalPages}
				>
					{t('matches_history.pagination.next')}
				</Button>
			</div>
		</div>
	)
}

export default GroupPagination
