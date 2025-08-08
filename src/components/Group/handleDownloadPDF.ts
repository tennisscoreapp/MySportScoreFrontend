import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

export const handleDownloadPDFUtil = async (inputData: HTMLDivElement) => {
	try {
		if (!inputData) return

		const canvas = await html2canvas(inputData, {
			useCORS: true,
			allowTaint: true,
			backgroundColor: '#ffffff',
			scale: 3,
		})

		const imgData = canvas.toDataURL('image/png')

		const pdf = new jsPDF({
			orientation: 'landscape',
			unit: 'mm',
			format: 'a4',
			putOnlyUsedFonts: true,
		})

		const imgWidth = pdf.internal.pageSize.getWidth()
		const imgHeight = (canvas.height * imgWidth) / canvas.width

		pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

		pdf.save('group-export.pdf')
	} catch (error) {
		console.error('Error generating PDF:', error)
	}
}
