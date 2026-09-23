'use client'

import MatchEditor from '@/components/Match/MatchEditor'
import { useFetchGroupQuery } from '@/hooks/queries/useFetchGroupQuery'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function AddMatchPage() {
 const { group, tournament } = useParams<{ group: string; tournament: string }>()
 const { data, isLoading, error } = useFetchGroupQuery(group)
 const t = useTranslations('Match')
 if (isLoading) return <p className='p-6'>{t('loading')}</p>
 if (error || !data?.[0]) return <p role='alert' className='p-6'>{t('load_failed')}</p>
 const info = data[0].group_data
 return <MatchEditor groupId={group} tournamentId={tournament} players={info.players} setsToWin={info.group.sets_to_win} scoringMode={info.group.scoring_mode} />
}
