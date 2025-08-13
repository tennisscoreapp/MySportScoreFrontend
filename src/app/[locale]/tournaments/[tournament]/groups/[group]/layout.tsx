export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='lg:p-10'>
			<main>{children}</main>
		</div>
	)
}
