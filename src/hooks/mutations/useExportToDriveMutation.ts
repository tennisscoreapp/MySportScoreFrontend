import { groupService } from '@/service/group.service'
import { useMutation } from '@tanstack/react-query'

// takes the PDF builder so pending and error states cover rendering as well as the upload
export const useExportToDriveMutation = (groupId: string) =>
	useMutation({
		mutationFn: async (createPdf: () => Promise<string>) =>
			groupService.exportToDrive(groupId, await createPdf()),
	})
