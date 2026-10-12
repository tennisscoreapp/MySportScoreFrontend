'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/shadcn/css'
import { Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

const HEX_DIGITS = /^[0-9a-f]{0,6}$/i
const FULL_HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i
const COPIED_MS = 2000

const toDraft = (color: string) => color.replace('#', '').toUpperCase()

// accepts the short form too (F00 -> #ff0000); the API stores lowercase #rrggbb
function toColor(draft: string): string | null {
	if (!FULL_HEX.test(draft)) return null
	const digits = draft.replace('#', '').toLowerCase()
	return digits.length === 3
		? `#${[...digits].map(digit => digit + digit).join('')}`
		: `#${digits}`
}

// Color picker with a HEX field: type or paste a code, or drag and copy it.
// label names the field for screen readers; the dialog title shows it.
export default function ColorPickerField({
	id,
	label,
	color,
	onChange,
}: {
	id: string
	label: string
	color: string
	onChange: (color: string) => void
}) {
	const t = useTranslations('TournamentGroup.color_picker')
	const [draft, setDraft] = useState(() => toDraft(color))
	const [invalid, setInvalid] = useState(false)
	const [copied, setCopied] = useState(false)
	const copiedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
	const code = `#${toDraft(color)}`

	// follow the picker and saved settings, but keep a code that is being typed
	const [shownColor, setShownColor] = useState(color)
	if (color !== shownColor) {
		setShownColor(color)
		if (toColor(draft) !== color) {
			setDraft(toDraft(color))
			setInvalid(false)
		}
	}

	useEffect(() => () => clearTimeout(copiedTimer.current), [])

	const commit = (value: string) => {
		const next = toColor(value)
		if (!next) return false
		setDraft(toDraft(next))
		setInvalid(false)
		if (next !== color) onChange(next)
		return true
	}

	const revert = () => {
		setDraft(toDraft(color))
		setInvalid(false)
	}

	const handleChange = (raw: string) => {
		const next = raw.replace(/[\s#]/g, '')
		if (!HEX_DIGITS.test(next)) {
			setInvalid(true)
			return
		}
		setDraft(next.toUpperCase())
		setInvalid(false)
		// a short code is applied on Enter or blur, so typing past it does not flash
		if (next.length === 6) commit(next)
	}

	// a pasted code replaces the field instead of being spliced into it
	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		const pasted = e.clipboardData.getData('text').trim()
		if (!FULL_HEX.test(pasted)) return
		e.preventDefault()
		commit(pasted)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (!commit(draft)) setInvalid(true)
		} else if (e.key === 'Escape') {
			revert()
			e.currentTarget.blur()
		}
	}

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			clearTimeout(copiedTimer.current)
			copiedTimer.current = setTimeout(() => setCopied(false), COPIED_MS)
		} catch {
			// clipboard can be blocked; let the organizer copy it by hand
			window.prompt(t('copy_manually'), code)
		}
	}

	return (
		<div className='flex w-full flex-col gap-2'>
			<HexColorPicker
				color={color}
				onChange={onChange}
				style={{ width: '100%', height: 220 }}
			/>
			<div className='flex w-full items-center gap-2'>
				<div className='relative flex-1'>
					<span
						aria-hidden
						className='pointer-events-none absolute left-2 top-1/2 size-5 -translate-y-1/2 rounded-sm border border-black/15'
						style={{ backgroundColor: color }}
					/>
					<span
						aria-hidden
						className='pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground'
					>
						#
					</span>
					<Input
						id={id}
						value={draft}
						placeholder='RRGGBB'
						autoComplete='off'
						spellCheck={false}
						aria-label={t('hex_label', { label })}
						aria-invalid={invalid || undefined}
						aria-describedby={`${id}-status`}
						title={t('hex_hint')}
						className='pl-12 font-mono tracking-wider'
						onFocus={e => e.target.select()}
						onChange={e => handleChange(e.target.value)}
						onPaste={handlePaste}
						onKeyDown={handleKeyDown}
						onBlur={() => {
							if (!commit(draft)) revert()
						}}
					/>
				</div>
				<Button
					type='button'
					variant='outline'
					size='icon'
					aria-label={t('copy', { code })}
					title={t('copy', { code })}
					onClick={handleCopy}
				>
					{copied ? <Check className='text-green-600' /> : <Copy />}
				</Button>
			</div>
			<p
				id={`${id}-status`}
				role='status'
				className={cn(
					'min-h-4 w-full text-center text-xs',
					invalid ? 'text-destructive' : 'text-green-600'
				)}
			>
				{invalid ? t('invalid') : copied ? t('copied', { code }) : ''}
			</p>
		</div>
	)
}
