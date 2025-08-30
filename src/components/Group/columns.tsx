import { ColumnDef, Row } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

interface GroupPlayer {
	index: number
	player_name: string
	player_last_name: string
	matches_played: number
	matches_won: number
	sets_played: string
	sets_difference: number
	games_played: string
	games_difference: number
}

export const createColumns = (
	t: ReturnType<typeof useTranslations>,
	numberOfWinners: number,
	tournamentColor: string
): ColumnDef<GroupPlayer>[] => [
	{
		accessorKey: 'player_name',
		header: () => {
			return <div className='text-center'>{t('group_table.player')}</div>
		},
		enableResizing: true,
		meta: {
			getStyles: (row: Row<GroupPlayer>) => {
				const isWinner = row.original.index <= numberOfWinners
				return {
					backgroundColor: isWinner ? tournamentColor : 'transparent',
				}
			},
		},
		cell: ({ row }) => {
			return (
				<div className='flex flex-col'>
					<div className='text-left'>
						{row.original.index}. {row.original.player_name}
					</div>
					<div className='ml-11'>{row.original.player_last_name}</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'matches_played',
		header: () => {
			return (
				<div className='text-center'>{t('group_table.matches_played')}</div>
			)
		},
		cell: ({ row }) => {
			return <div className='text-center'>{row.original.matches_played}</div>
		},
	},
	{
		accessorKey: 'matches_won',
		header: () => {
			return <div className='text-center'>{t('group_table.matches_won')}</div>
		},
		cell: ({ row }) => {
			return <div className='text-center'>{row.original.matches_won}</div>
		},
	},
	{
		accessorKey: 'sets_played',
		header: () => {
			return <div className='text-center'>{t('group_table.sets_played')}</div>
		},
		cell: ({ row }) => {
			return <div className='text-center'>{row.original.sets_played}</div>
		},
	},
	{
		accessorKey: 'sets_difference',
		header: () => {
			return (
				<div className='text-center'>{t('group_table.sets_difference')}</div>
			)
		},
		cell: ({ row }) => {
			return <div className='text-center'>{row.original.sets_difference}</div>
		},
	},
	{
		accessorKey: 'games_played',
		header: () => {
			return <div className='text-center'>{t('group_table.games_played')}</div>
		},
		cell: ({ row }) => {
			return <div className='text-center'>{row.original.games_played}</div>
		},
	},
	{
		accessorKey: 'games_difference',
		header: () => {
			return (
				<div className='text-center'>{t('group_table.games_difference')}</div>
			)
		},
		cell: ({ row }) => {
			return <div className='text-center'>{row.original.games_difference}</div>
		},
	},
]
