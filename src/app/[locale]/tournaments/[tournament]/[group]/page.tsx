'use client'
import { useParams } from 'next/navigation'
import ServerFetching from './ServerFetching'

export default function GroupPage() {
	const params = useParams()

	return <ServerFetching params={params} />
}
