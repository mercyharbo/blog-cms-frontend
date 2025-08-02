// api/mediaReq.ts
export const uploadMedia = async (formData: FormData, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/media/upload`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  )
  return response.json()
}

export const deleteMedia = async (id: string, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/media/${id}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.json()
}
