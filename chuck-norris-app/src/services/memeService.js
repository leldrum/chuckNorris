const API_URL = 'https://api.imgflip.com/get_memes'
const CAPTION_API_URL = 'https://api.imgflip.com/caption_image'

const API_USERNAME = 'lelyan'
const API_PASSWORD = 'Lelyan1603.'


export const fetchMemes = async () => {
  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error('La réponse de l\'API indique un échec')
    }

    return data.data.memes.map(meme => ({
      ...meme,
      box_count: meme.box_count || 2
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des memes:', error)
    throw new Error('Impossible de charger les memes')
  }
}

export const getRandomMeme = (memes) => {
  if (!memes || memes.length === 0) return null
  const index = Math.floor(Math.random() * memes.length)
  return memes[index]
}

export const captionMeme = async (templateId, texts, username = API_USERNAME, password = API_PASSWORD) => {
  try {

    const params = new URLSearchParams()
    params.append('template_id', templateId)
    params.append('username', username)
    params.append('password', password)
    
    if (Array.isArray(texts)) {
      texts.forEach((text, index) => {
        params.append(`text${index}`, text || '')
      })
    } else {
      params.append('text0', texts || '')
      params.append('text1', '')
    }

    console.log('Génération du meme avec template ID:', templateId)

    const response = await fetch(CAPTION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data = await response.json()
    
    console.log('Réponse API:', data)

    if (!data.success) {
      const errorMsg = data.error_message || 'Erreur inconnue'
      console.error('❌ Erreur API:', errorMsg)
      throw new Error(errorMsg)
    }

    return {
      url: data.data.url,
      page_url: data.data.page_url,
      templateId: templateId
    }
  } catch (error) {
    console.error(' Erreur lors de la génération du meme:', error)
    
    if (error.message.includes('HTTP')) {
      throw new Error(`Erreur de connexion à l'API (${error.message})`)
    }
    
    throw error
  }
}


export const downloadImage = async (url, filename = 'meme.jpg') => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    throw new Error('Impossible de télécharger l\'image')
  }
}

export const saveCreatedMeme = (memeUrl) => {
  try {
    const createdMemes = JSON.parse(localStorage.getItem('createdMemes') || '[]')
    createdMemes.push({
      id: Date.now(),
      url: memeUrl,
      createdAt: new Date().toISOString()
    })
    localStorage.setItem('createdMemes', JSON.stringify(createdMemes))
    return true
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du meme:', error)
    return false
  }
}

export const getCreatedMemes = () => {
  try {
    return JSON.parse(localStorage.getItem('createdMemes') || '[]')
  } catch (error) {
    console.error('Erreur lors de la récupération des memes:', error)
    return []
  }
}

export const deleteCreatedMeme = (memeId) => {
  try {
    const createdMemes = JSON.parse(localStorage.getItem('createdMemes') || '[]')
    const filtered = createdMemes.filter(meme => meme.id !== memeId)
    localStorage.setItem('createdMemes', JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression du meme:', error)
    return false
  }
}

export const clearAllCreatedMemes = () => {
  try {
    localStorage.removeItem('createdMemes')
    return true
  } catch (error) {
    console.error('Erreur lors de la suppression des memes:', error)
    return false
  }
}

export const captionCustomImage = async (imageFile, text0, text1) => {
  try {
    const dataUrl = await fileToDataUrl(imageFile)
    
    const memeUrl = await drawTextOnImage(dataUrl, text0, text1)
    
    return {
      url: memeUrl,
      page_url: memeUrl
    }
  } catch (error) {
    console.error('Erreur lors de la génération du meme personnalisé:', error)
    throw new Error('Impossible de créer le meme avec l\'image personnalisée')
  }
}

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const drawTextOnImage = (imageData, text0, text1) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = img.width
        canvas.height = img.height
        
        ctx.drawImage(img, 0, 0)
        
        const fontSize = Math.floor(canvas.width / 15)
        const fontFamily = 'Impact, Arial, sans-serif'
        const lineHeight = fontSize * 1.2
        const padding = 10
        const maxWidth = canvas.width - padding * 2
        
        ctx.font = `bold ${fontSize}px ${fontFamily}`
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        
        const wrapText = (text) => {
          const words = text.split(' ')
          const lines = []
          let currentLine = ''
          
          for (let word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word
            const metrics = ctx.measureText(testLine)
            
            if (metrics.width > maxWidth) {
              if (currentLine) {
                lines.push(currentLine)
              }
              currentLine = word
            } else {
              currentLine = testLine
            }
          }
          if (currentLine) {
            lines.push(currentLine)
          }
          return lines
        }
        
        const text0Lines = wrapText(text0)
        const text1Lines = wrapText(text1)
        
        let y = padding
        for (let line of text0Lines) {
          const x = canvas.width / 2
          ctx.strokeText(line, x, y)
          ctx.fillText(line, x, y)
          y += lineHeight
        }
        
        y = canvas.height - (text1Lines.length * lineHeight) - padding
        for (let line of text1Lines) {
          const x = canvas.width / 2
          ctx.strokeText(line, x, y)
          ctx.fillText(line, x, y)
          y += lineHeight
        }
        
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Impossible de charger l\'image'))
    }
    
    img.src = imageData
  })
}
