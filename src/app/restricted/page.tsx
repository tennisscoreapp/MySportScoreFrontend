import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RestrictedPage() {
	return (
		<div className='flex flex-col items-center justify-center h-screen gap-4'>
			<h1 className='text-4xl font-bold'>Restricted Page</h1>
			<p className='text-lg'>You are not authorized to access this page</p>
			<Link href='/tournaments'>
				<Button> Back to tournaments</Button>
			</Link>
		</div>
	)
}
