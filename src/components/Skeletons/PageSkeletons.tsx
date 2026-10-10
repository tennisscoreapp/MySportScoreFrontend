'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/shadcn/css'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

// Page-level loading placeholders; each mirrors the layout of the page it stands in for

function SkeletonPage({
	className,
	children,
}: {
	className?: string
	children: ReactNode
}) {
	const t = useTranslations('Global')
	return (
		<div role='status' aria-busy='true' className={className}>
			<span className='sr-only'>{t('loading')}</span>
			{children}
		</div>
	)
}

function FieldSkeleton({ labelClassName = 'w-20' }: { labelClassName?: string }) {
	return (
		<div className='space-y-2'>
			<Skeleton className={cn('h-4', labelClassName)} />
			<Skeleton className='h-9 w-full' />
		</div>
	)
}

const repeat = (count: number) => Array.from({ length: count }, (_, i) => i)

export function TournamentsListSkeleton() {
	return (
		<SkeletonPage className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex items-center gap-3 mb-4 sm:mb-8'>
					<Skeleton className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200' />
					<div className='space-y-2'>
						<Skeleton className='h-6 sm:h-7 w-40 bg-gray-200' />
						<Skeleton className='h-4 w-56 sm:w-72 bg-gray-200' />
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8'>
					{repeat(3).map(i => (
						<div
							key={i}
							className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'
						>
							<div className='mb-4 space-y-2'>
								<Skeleton className='h-6 w-3/4' />
								<Skeleton className='h-4 w-20' />
							</div>
							<div className='space-y-2 mb-2 sm:mb-4'>
								<Skeleton className='h-4 w-44' />
								<Skeleton className='h-4 w-44' />
							</div>
							<div className='flex items-center justify-between pt-2 sm:pt-4 border-t border-gray-100'>
								<Skeleton className='h-3 w-12' />
								<Skeleton className='w-5 h-5 sm:w-6 sm:h-6 rounded-full' />
							</div>
						</div>
					))}
				</div>

				<div className='flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center'>
					<Skeleton className='h-9 sm:h-11 w-full sm:w-44 bg-gray-200' />
					<Skeleton className='h-9 sm:h-11 w-full sm:w-28 bg-gray-200' />
				</div>
			</div>
		</SkeletonPage>
	)
}

export function TournamentSkeleton({
	withActions = true,
}: {
	withActions?: boolean
}) {
	return (
		<SkeletonPage className='container mx-auto p-8 sm:p-12 min-h-screen'>
			<div className='mb-4 sm:mb-8'>
				<Skeleton className='h-7 sm:h-8 w-64 mb-4' />
				<div className='bg-gray-100 p-2 sm:p-4 rounded-lg mb-2 sm:mb-6'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-1 sm:gap-4'>
						{repeat(2).map(i => (
							<div key={i} className='space-y-2'>
								<Skeleton className='h-4 w-32 bg-gray-200' />
								<Skeleton className='h-5 w-24 bg-gray-200' />
							</div>
						))}
					</div>
				</div>
			</div>

			<Skeleton className='h-6 sm:h-7 w-48 mb-4' />
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-4'>
				{repeat(3).map(i => (
					<div
						key={i}
						className='p-1 sm:p-4 border border-gray-300 rounded-lg bg-white'
					>
						<Skeleton className='h-5 sm:h-7 w-1/2 mb-2' />
						<div className='flex justify-end'>
							<Skeleton className='h-4 w-24' />
						</div>
					</div>
				))}
			</div>

			{withActions && (
				<>
					<div className='mt-2 sm:mt-10 flex flex-wrap gap-2 sm:gap-4'>
						<Skeleton className='h-8 w-32' />
						<Skeleton className='h-8 w-44' />
						<Skeleton className='h-8 w-20' />
					</div>
					<div className='mt-6 sm:mt-10 flex flex-col gap-3 rounded-lg border p-4'>
						<Skeleton className='h-6 w-32' />
						<Skeleton className='h-4 w-3/4' />
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FieldSkeleton labelClassName='w-28' />
							<FieldSkeleton labelClassName='w-24' />
						</div>
						<Skeleton className='h-8 w-24' />
					</div>
				</>
			)}
		</SkeletonPage>
	)
}

export function GroupSkeleton({ readOnly = false }: { readOnly?: boolean }) {
	return (
		<SkeletonPage>
			<div className='flex flex-col gap-10 p-10'>
				<div className='flex flex-col items-center gap-10'>
					<Skeleton className='h-8 w-64 max-w-full' />
					<Skeleton className='h-8 w-40 max-w-full' />
				</div>
				<div className='overflow-x-auto'>
					<div className='min-w-[640px] divide-y rounded-md border'>
						{repeat(6).map(row => (
							<div key={row} className='flex h-14 items-center gap-4 px-4'>
								<Skeleton className='h-4 w-8' />
								<Skeleton className='h-4 w-28' />
								{repeat(5).map(col => (
									<Skeleton key={col} className='h-4 flex-1' />
								))}
							</div>
						))}
					</div>
				</div>
			</div>
			<div className='mt-10 pl-10 pr-10'>
				<div className='flex gap-4 flex-col lg:flex-row lg:gap-0 mt-10 justify-between'>
					<div className='flex flex-col lg:flex-row gap-4'>
						{!readOnly && (
							<>
								<Skeleton className='h-9 w-full lg:w-32' />
								<Skeleton className='h-9 w-full lg:w-36' />
							</>
						)}
					</div>
					<div className='flex flex-col lg:flex-row gap-4'>
						<Skeleton className='h-9 w-full lg:w-48' />
						<Skeleton className='h-9 w-full lg:w-20' />
					</div>
				</div>
			</div>
		</SkeletonPage>
	)
}

export function MatchEditorSkeleton() {
	return (
		<SkeletonPage className='max-w-2xl mx-auto p-6'>
			<Skeleton className='h-8 w-56 mb-2' />
			<Skeleton className='h-4 w-72 max-w-full mb-6' />
			<div className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FieldSkeleton />
					<FieldSkeleton />
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<FieldSkeleton labelClassName='w-24' />
					<FieldSkeleton labelClassName='w-16' />
				</div>
				<div className='space-y-4'>
					{repeat(2).map(i => (
						<div key={i} className='border rounded-lg p-4 space-y-3'>
							<Skeleton className='h-4 w-12' />
							<div className='grid grid-cols-2 gap-4'>
								<FieldSkeleton />
								<FieldSkeleton />
							</div>
						</div>
					))}
					<div className='flex gap-3'>
						<Skeleton className='h-9 w-32' />
						<Skeleton className='h-9 w-32' />
					</div>
				</div>
				<div className='flex gap-4 pt-4'>
					<Skeleton className='h-9 flex-1' />
					<Skeleton className='h-9 w-24' />
				</div>
			</div>
		</SkeletonPage>
	)
}

export function AddPlayersSkeleton() {
	return (
		<SkeletonPage className='max-w-4xl mx-auto p-6'>
			<div className='flex justify-between items-center mb-6'>
				<Skeleton className='h-8 w-48' />
				<Skeleton className='h-10 w-36' />
			</div>
			<div className='bg-white rounded-lg shadow'>
				<ul className='divide-y divide-gray-200'>
					{repeat(5).map(i => (
						<li key={i} className='p-4 flex items-center justify-between'>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-32' />
								<Skeleton className='h-4 w-24' />
							</div>
							<Skeleton className='h-9 w-9' />
						</li>
					))}
				</ul>
			</div>
			<div className='flex flex-row gap-4 mt-10'>
				<Skeleton className='h-9 w-20' />
			</div>
		</SkeletonPage>
	)
}
