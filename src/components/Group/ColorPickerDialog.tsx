'use client'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import ColorPickerField from './ColorPickerField'

// The picker lives behind a button so scrolling past it can't change the color.
// While the dialog is open the page previews the draft through onPreview
// (null drops the preview); only Save keeps it.
export default function ColorPickerDialog({
	id,
	label,
	buttonLabel,
	color,
	onPreview,
	onSave,
}: {
	id: string
	label: string
	buttonLabel: string
	color: string
	onPreview: (color: string | null) => void
	onSave: (color: string) => void
}) {
	const t = useTranslations('TournamentGroup.color_picker')
	const [open, setOpen] = useState(false)
	const [draft, setDraft] = useState(color)

	const handleOpenChange = (next: boolean) => {
		if (next) setDraft(color)
		else onPreview(null)
		setOpen(next)
	}

	const handleChange = (next: string) => {
		setDraft(next)
		onPreview(next)
	}

	const handleSave = () => {
		if (draft !== color) onSave(draft)
		handleOpenChange(false)
	}

	return (
		// not modal: the page stays scrollable and undimmed so the whole table
		// can be checked while trying colors
		<Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
			<div className='flex w-full flex-col gap-2'>
				<span className='text-sm font-medium'>{label}</span>
				<DialogTrigger asChild>
					<Button
						variant='outline'
						className='w-full justify-start'
					>
						<span
							aria-hidden
							className='size-4 shrink-0 rounded-sm border border-black/15'
							style={{ backgroundColor: color }}
						/>
						{buttonLabel}
						<span className='ml-auto font-mono text-xs text-muted-foreground'>
							{color.toUpperCase()}
						</span>
					</Button>
				</DialogTrigger>
			</div>
			{/* clicking the page to look at it must not throw the edit away */}
			<DialogContent
				className='sm:max-w-sm'
				onInteractOutside={e => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>{label}</DialogTitle>
					<DialogDescription>{t('dialog_description')}</DialogDescription>
				</DialogHeader>
				<ColorPickerField
					id={id}
					label={label}
					color={draft}
					onChange={handleChange}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>{t('cancel')}</Button>
					</DialogClose>
					<Button onClick={handleSave}>{t('save')}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
