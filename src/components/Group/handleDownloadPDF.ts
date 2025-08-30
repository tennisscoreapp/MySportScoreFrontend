import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export const handleDownloadPDFUtil = async (
	inputData: HTMLDivElement,
	groupName: string
) => {
	try {
		if (!inputData) return

		if (typeof document !== 'undefined' && 'fonts' in document) {
			try {
				await (document as Document).fonts.ready
			} catch {}
		}

		// get root element for targeting in onclone
		inputData.setAttribute('data-pdf-export-root', '1')
		const resolvedFamily =
			getComputedStyle(inputData).fontFamily ||
			getComputedStyle(document.body).fontFamily ||
			"'Press Start 2P', monospace"

		const canvas = await html2canvas(inputData, {
			useCORS: true,
			allowTaint: true,
			backgroundColor: '#ffffff',
			scale: 1.5,
			logging: false,
			onclone: clonedDocument => {
				try {
					const style = clonedDocument.createElement('style')
					style.textContent = `
						.force-font, .force-font * { font-family: ${resolvedFamily} !important; }
					`
					clonedDocument.head.appendChild(style)
					const root = clonedDocument.querySelector(
						'[data-pdf-export-root="1"]'
					)
					if (root) {
						;(root as HTMLElement).classList.add('force-font')
					}
				} catch {}
			},
		})

		const imgData = canvas.toDataURL('image/png')

		const pdf = new jsPDF({
			orientation: 'landscape',
			unit: 'mm',
			format: 'a4',
			putOnlyUsedFonts: true,

			compress: true,
		})

		const imgWidth = pdf.internal.pageSize.getWidth()
		const imgHeight = (canvas.height * imgWidth) / canvas.width

		pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

		pdf.save(`Group_${groupName}.pdf`)
	} catch (error) {
		console.error('Error generating PDF:', error)
	} finally {
		if (inputData?.hasAttribute('data-pdf-export-root')) {
			inputData.removeAttribute('data-pdf-export-root')
		}
	}
}
