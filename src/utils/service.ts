import http from './axios'

export const createUser = async (payload: any) => {
  return await http.post('/user/register', payload)
}

export const uploadImage = async (payload: any) => {
  return await http.post('/user/upload-image', payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getUserById = async (id: string) =>{
  return await http.get(`/user/${id}`);
}

export const updateUser = async (payload: any) =>{
  return await http.patch('/user', payload)
}

export const verifyUser = async (payload: any) =>{
  return await http.post('/user/verify', payload)
}