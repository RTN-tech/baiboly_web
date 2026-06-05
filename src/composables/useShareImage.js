import { ref } from 'vue'

const COLORS = {
  dark: { bg: '#1a1a2e', text: '#f5f5f5', gold: '#d4af37', accent: '#16213e' },
  light: { bg: '#faf8f5', text: '#2c2c2c', gold: '#d4af37', accent: '#f0ece7' }
}

export function useShareImage() {
  const generating = ref(false)

  async function generateVerseImage(verse, { bookName, chapter, verseNum, isDark = true }) {
    generating.value = true
    try {
      const palette = isDark ? COLORS.dark : COLORS.light
      const padding = 40
      const maxWidth = 600
      const lineHeight = 28
      const fontSize = 18
      const refSize = 14

      // Calculate text dimensions
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      tempCtx.font = `${fontSize}px Georgia, 'Playfair Display', serif`

      const words = verse.split(' ')
      const lines = []
      let currentLine = ''
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word
        const metrics = tempCtx.measureText(testLine)
        if (metrics.width > maxWidth - padding * 2 && currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      if (currentLine) lines.push(currentLine)

      const textHeight = lines.length * lineHeight
      const canvasHeight = Math.max(280, textHeight + padding * 3 + 40)

      // Create actual canvas
      const canvas = document.createElement('canvas')
      canvas.width = maxWidth
      canvas.height = canvasHeight
      const ctx = canvas.getContext('2d')

      // Background
      const gradient = ctx.createLinearGradient(0, 0, maxWidth, canvasHeight)
      gradient.addColorStop(0, palette.bg)
      gradient.addColorStop(0.5, palette.accent)
      gradient.addColorStop(1, palette.bg)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, maxWidth, canvasHeight)

      // Decorative top line
      ctx.fillStyle = palette.gold
      ctx.fillRect(padding, padding - 10, 60, 3)

      // Verse text
      ctx.fillStyle = palette.text
      ctx.font = `${fontSize}px Georgia, 'Playfair Display', serif`
      ctx.textBaseline = 'top'

      let y = padding
      for (const line of lines) {
        ctx.fillText(line, padding, y)
        y += lineHeight
      }

      // Reference
      const reference = `${bookName} ${chapter}:${verseNum}`
      ctx.fillStyle = palette.gold
      ctx.font = `600 ${refSize}px 'Inter', sans-serif`
      ctx.textBaseline = 'top'
      ctx.fillText(`— ${reference}`, padding, y + 20)

      // Bottom decorative line
      ctx.fillStyle = palette.gold
      ctx.fillRect(padding, y + 52, 40, 2)

      // App name
      ctx.fillStyle = palette.gold + '99'
      ctx.font = `400 10px 'Inter', sans-serif`
      ctx.textBaseline = 'top'
      ctx.fillText('Ny Baiboliko', padding, y + 62)

      // Corner ornament
      ctx.strokeStyle = palette.gold + '40'
      ctx.lineWidth = 1
      ctx.strokeRect(15, 15, maxWidth - 30, canvasHeight - 30)

      return canvas
    } finally {
      generating.value = false
    }
  }

  async function downloadVerse(verse, { bookName, chapter, verseNum, isDark }) {
    const canvas = await generateVerseImage(verse, { bookName, chapter, verseNum, isDark })
    const link = document.createElement('a')
    link.download = `${bookName.replace(/\s+/g, '_')}_${chapter}_${verseNum}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  async function shareAsImage(verse, { bookName, chapter, verseNum, isDark }) {
    const canvas = await generateVerseImage(verse, { bookName, chapter, verseNum, isDark })

    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) { reject(new Error('Failed to create blob')); return }
        try {
          if (navigator.share && navigator.canShare({ files: [new File([blob], 'verse.png', { type: 'image/png' })] })) {
            await navigator.share({
              title: `${bookName} ${chapter}:${verseNum}`,
              files: [new File([blob], 'verse.png', { type: 'image/png' })]
            })
          } else {
            // Fallback: download
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${bookName.replace(/\s+/g, '_')}_${chapter}_${verseNum}.png`
            link.click()
            URL.revokeObjectURL(url)
          }
          resolve()
        } catch (e) {
          reject(e)
        }
      }, 'image/png')
    })
  }

  return {
    generating,
    generateVerseImage,
    downloadVerse,
    shareAsImage
  }
}
