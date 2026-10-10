'use client'
import { useUpdateGroupSettingsMutation } from '@/hooks/mutations/useUpdateGroupSettingsMutation'
import { GroupSettings } from '@/interfaces/groupInterfaces'
import { groupService } from '@/service/group.service'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'

const SAVE_DELAY_MS = 600
const DEFAULT_DISPLAY = {
	primary_color: '#ffffff',
	primary_winners: 0,
	secondary_color: '#ff4444',
	secondary_winners: 0,
}
const HEX_COLOR = /^#[0-9a-f]{6}$/i

export const clampPlaces = (value: number) =>
	Math.min(1000, Math.max(0, Math.floor(Number.isFinite(value) ? value : 0)))

// colors and places used to live in the organizer's browser; move them to the group once
function legacyDisplaySettings(raw: string): Partial<GroupSettings> {
	try {
		const state = JSON.parse(raw)?.state ?? {}
		const patch: Partial<GroupSettings> = {}
		if (HEX_COLOR.test(state.tournamentColor ?? ''))
			patch.primary_color = state.tournamentColor.toLowerCase()
		if (HEX_COLOR.test(state.secondaryTournamentColor ?? ''))
			patch.secondary_color = state.secondaryTournamentColor.toLowerCase()
		if (typeof state.numberOfWinners === 'number')
			patch.primary_winners = clampPlaces(state.numberOfWinners)
		if (typeof state.numberOfSecondaryWinners === 'number')
			patch.secondary_winners = clampPlaces(state.numberOfSecondaryWinners)
		return patch
	} catch {
		return {}
	}
}

// Edits show immediately; display changes are saved after the organizer stops
// dragging, visibility changes are saved at once.
export function useGroupSettings(groupId: string, saved?: GroupSettings) {
	const queryClient = useQueryClient()
	const { mutate, isPending, isError } = useUpdateGroupSettingsMutation(groupId)
	const [draft, setDraft] = useState<Partial<GroupSettings>>({})
	const pending = useRef<Partial<GroupSettings>>({})
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

	const flush = useCallback(() => {
		clearTimeout(timer.current)
		const patch = pending.current
		pending.current = {}
		if (Object.keys(patch).length === 0) return
		mutate(patch, { onError: () => setDraft({}) })
	}, [mutate])

	const update = useCallback(
		(patch: Partial<GroupSettings>, immediate = false) => {
			setDraft(current => ({ ...current, ...patch }))
			pending.current = { ...pending.current, ...patch }
			clearTimeout(timer.current)
			if (immediate) flush()
			else timer.current = setTimeout(flush, SAVE_DELAY_MS)
		},
		[flush]
	)

	// save an unfinished edit when the organizer leaves the page
	useEffect(
		() => () => {
			clearTimeout(timer.current)
			const patch = pending.current
			if (Object.keys(patch).length === 0) return
			groupService
				.updateGroupSettings(groupId, patch)
				.finally(() =>
					queryClient.invalidateQueries({ queryKey: ['group', groupId] })
				)
		},
		[groupId, queryClient]
	)

	useEffect(() => {
		if (!saved) return
		const key = `color-group-${groupId}`
		const raw = window.localStorage.getItem(key)
		if (raw === null) return
		const patch = legacyDisplaySettings(raw)
		const serverUntouched = Object.entries(DEFAULT_DISPLAY).every(
			([field, value]) => saved[field as keyof GroupSettings] === value
		)
		const changes = Object.entries(patch).some(
			([field, value]) =>
				DEFAULT_DISPLAY[field as keyof typeof DEFAULT_DISPLAY] !== value
		)
		if (!serverUntouched || !changes) {
			window.localStorage.removeItem(key)
			return
		}
		mutate(patch, { onSuccess: () => window.localStorage.removeItem(key) })
	}, [groupId, saved, mutate])

	return {
		settings: saved ? { ...saved, ...draft } : undefined,
		update,
		isSaving: isPending,
		isError,
	}
}
