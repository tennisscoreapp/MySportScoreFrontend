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

		// calculate scaled image size to fit into page and center vertically
		const pageWidth = pdf.internal.pageSize.getWidth()
		const pageHeight = pdf.internal.pageSize.getHeight()
		const imagePixelWidth = canvas.width
		const imagePixelHeight = canvas.height
		// choose the smaller ratio to contain the image within the page
		const widthRatio = pageWidth / imagePixelWidth
		const heightRatio = pageHeight / imagePixelHeight
		const renderRatio = Math.min(widthRatio, heightRatio)
		const renderWidth = imagePixelWidth * renderRatio
		const renderHeight = imagePixelHeight * renderRatio
		// center both horizontally and vertically
		const offsetX = (pageWidth - renderWidth) / 2
		const offsetY = (pageHeight - renderHeight) / 2 - 15

		pdf.addImage(imgData, 'PNG', offsetX, offsetY, renderWidth, renderHeight)

		pdf.save(`Group_${groupName}.pdf`)
	} catch (error) {
		console.error('Error generating PDF:', error)
	} finally {
		if (inputData?.hasAttribute('data-pdf-export-root')) {
			inputData.removeAttribute('data-pdf-export-root')
		}
	}
}
