'use client'
import { Button } from '@/components/ui/button'
import { Check, Link as LinkIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function CopyLinkButton({
	path,
	label,
	size,
}: {
	path: string
	label: string
	size?: 'sm' | 'default'
}) {
	const t = useTranslations('PublicPages')
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		const url = `${window.location.origin}${path}`
		try {
			await navigator.clipboard.writeText(url)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			// clipboard can be blocked; let the organizer copy it by hand
			window.prompt(t('copy_manually'), url)
		}
	}

	return (
		<Button size={size} variant='outline' onClick={handleCopy}>
			{copied ? <Check /> : <LinkIcon />}
			{copied ? t('link_copied') : label}
		</Button>
	)
}
