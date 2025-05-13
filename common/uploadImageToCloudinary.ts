type CloudinaryResponse = {
    secure_url: string
}

const uploadImageToCloudinary = async (file: File): Promise<string | undefined> => {
    try {
        const formData = new FormData()
        formData.append('file', file)

        const signature = await fetch('https://localhost:44381/api/admin/cloudinary/signature').then(res => {
            return res.json()
        })

        formData.append('api_key', signature.apiKey)
        formData.append('timestamp', signature.timestamp)
        formData.append('signature', signature.signature)
        formData.append('folder', signature.folder)

        const response = await fetch(`https://api.cloudinary.com/v1_1/dzwmjh7b8/image/upload`, {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: CloudinaryResponse = await response.json()

        return data.secure_url
    } catch (error) {
        return undefined
    }
}

export default uploadImageToCloudinary
