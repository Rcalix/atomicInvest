import { useState, useEffect, useCallback } from 'react'

export default function useUsers() {
  const [users, setUsers] = useState([])
  const [refreshToken, setRefreshToken] = useState(Date.now())

  useEffect(() => {
    fetch('/example/users')
      .then((rsp) => rsp.json())
      .then((data) => setUsers(data.elements || []))
      .catch((error) => console.log(error))
  }, [refreshToken])

  const refreshUsers = useCallback(() => {
    setRefreshToken(Date.now())
  }, [])

  return [users, refreshUsers]
}
