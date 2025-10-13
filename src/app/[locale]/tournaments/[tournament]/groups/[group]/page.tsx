import { Params } from 'next/dist/server/request/params'
import ServerFetching from './ServerFetching'

export default async function GroupPage({ params }: { params: Params }) {
	return <ServerFetching params={params} />
}
