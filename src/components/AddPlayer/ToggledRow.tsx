import { NewPlayerFormData } from '@/interfaces/playerInterfaces'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export default function ToggledRow({ t }: { t: (key: string) => string }) {
	const { control, formState } = useFormContext<NewPlayerFormData>()
	const isCouple = useWatch({ control, name: 'is_couple' })

	if (!isCouple) return null

	return (
		<div>
			<Label htmlFor='second_player' className='block text-sm font-medium mb-1'>
				{t('form.second_player')}
			</Label>
			<Controller
				control={control}
				name='second_player'
				render={({ field }) => (
					<Input
						{...field}
						id='second_player'
						type='text'
						disabled={!isCouple}
					/>
				)}
			/>

			{formState.errors.second_player && (
				<p className='text-red-500 text-sm mt-1'>
					{formState.errors.second_player.message}
				</p>
			)}
		</div>
	)
}
