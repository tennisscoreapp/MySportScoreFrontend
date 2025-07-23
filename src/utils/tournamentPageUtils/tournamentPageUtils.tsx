import { Tournament } from '@/interfaces/tournamentInterfaces'
import { Check, Play, X } from 'lucide-react'

export const getStatusIcon = (status: Tournament['status']) => {
	switch (status) {
		case 'active':
			return <Play className='w-4 h-4' />
		case 'completed':
			return <Check className='w-4 h-4' />
		case 'cancelled':
			return <X className='w-4 h-4' />
	}
}

export const getStatusColor = (status: Tournament['status']) => {
	switch (status) {
		case 'active':
			return 'bg-green-100 text-green-800 border-green-200'
		case 'completed':
			return 'bg-blue-100 text-blue-800 border-blue-200'
		case 'cancelled':
			return 'bg-red-100 text-red-800 border-red-200'
	}
}

export const getStatusText = (status: Tournament['status']) => {
	switch (status) {
		case 'active':
			return 'Активный'
		case 'completed':
			return 'Завершен'
		case 'cancelled':
			return 'Отменен'
	}
}
