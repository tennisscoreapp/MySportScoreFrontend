import { expect, test } from '@playwright/test'

const base = process.env.GO_E2E_BASE_URL
const email = process.env.GO_E2E_EMAIL
const password = process.env.GO_E2E_PASSWORD

for (const format of ['tennis', 'legacy'] as const) {
	test(`Go management creates a ${format} tournament, group, players and result`, async ({ page }) => {
		test.skip(!base || !email || !password, 'Requires local demo servers and GO_E2E_* variables')
		test.setTimeout(120_000)
		expect(new URL(base!).hostname).toMatch(/^(localhost|127\.0\.0\.1)$/)
		await page.goto(`${base}/en/auth/login`)
		await page.getByLabel('Email', { exact: true }).fill(email!)
		await page.getByLabel('Password', { exact: true }).fill(password!)
		await page.locator('button[type="submit"]').click()
		await page.waitForURL(url => !url.pathname.includes('/auth/login'))
		await page.goto(`${base}/en/tournaments/create`)
		await expect(page.locator('#scoring_mode')).toHaveValue('tennis')
		await page.locator('#scoring_mode').selectOption(format)
		await page.locator('#name').fill(`Browser ${format} ${Date.now()}`)
		const year = new Date().getFullYear()
		await page.locator('#start_date').fill(`${year}-09-23`)
		await page.locator('#end_date').fill(`${year}-09-24`)
		const created = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith('/api/v1/tournaments'))
		await page.locator('button[type="submit"]').click()
		const createdResponse = await created
		expect(createdResponse.status()).toBe(201)
		const { tournament_id: tournament } = await createdResponse.json()
		await page.waitForURL(url => /\/tournaments$/.test(url.pathname))
		await page.goto(`${base}/en/tournaments/${tournament}/creategroup`)
		await page.locator('#name').fill('Browser group')
		const grouped = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith('/api/v1/groups'))
		await page.locator('button[type="submit"]').click()
		const groupResponse = await grouped
		expect(groupResponse.status()).toBe(201)
		const { group_id: group } = await groupResponse.json()
		await page.waitForURL(url => url.pathname.endsWith(`/tournaments/${tournament}`))
		const groupURL = `${base}/en/tournaments/${tournament}/groups/${group}`
		await page.goto(`${groupURL}/addplayers`)
		for (const name of ['Browser One', 'Browser Two']) {
			await page.getByRole('button', { name: 'Add player', exact: true }).click()
			await page.locator('#first_player').fill(name)
			await page.locator('#email').fill(`${name.replaceAll(' ', '-')}@example.test`)
			const player = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith(`/groups/${group}/players`))
			await page.locator('button[type="submit"]').click()
			expect((await player).status()).toBe(201)
			await expect(page.locator('#first_player')).toHaveCount(0)
			await expect(page.getByText(name, { exact: true })).toBeVisible()
		}
		await page.goto(`${groupURL}/addmatch`)
		await page.locator('#player1_id').selectOption({ label: 'Browser One' })
		await page.locator('#player2_id').selectOption({ label: 'Browser Two' })
		await page.locator('#set-0-player1_games').fill(format === 'legacy' ? '20' : '6')
		await page.locator('#set-0-player2_games').fill(format === 'legacy' ? '18' : '4')
		await page.locator('#set-1-player1_games').fill(format === 'legacy' ? '11' : '6')
		await page.locator('#set-1-player2_games').fill('3')
		if (format === 'legacy') await expect(page.locator('#set-0-tiebreak_player1')).toHaveCount(0)
		const saved = page.waitForResponse(r => r.request().method() === 'POST' && r.url().endsWith('/api/v1/matches'))
		await page.getByRole('button', { name: 'Create match', exact: true }).click()
		expect((await saved).status()).toBe(201)
		await page.waitForURL(url => url.pathname.endsWith(`/groups/${group}`))
		await expect(page.getByText('Browser One', { exact: true }).first()).toBeVisible()
	})
}
