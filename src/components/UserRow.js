import { useCallback, useEffect, useState } from 'react'
import { Table, Avatar, Text, Button, toaster } from 'evergreen-ui'

export default function UserRow({ user, onClick }) {
  const [isTokenLoading, setTokenLoading] = useState(false)
  const [details, setDetails] = useState()

  useEffect(() => {
    fetch(`/example/users/${user.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((rsp) => rsp.json())
      .then((data) => {
        setDetails(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [user])

  const handleClick = useCallback(() => {
    setTokenLoading(true)
    fetch('/example/auth/onetime-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
      }),
    })
      .then((rsp) => rsp.json())
      .then((data) => {
        setTokenLoading(false)
        onClick(data.token)
      })
      .catch((error) => {
        setTokenLoading(false)
        console.log(error)
      })
  }, [user, onClick])

  return (
    <Table.Row height={64}>
      <Table.Cell
        display="flex"
        alignItems="center"
        paddingX="20px"
        onClick={() => {
          navigator.clipboard.writeText(user.id)
          toaster.notify(user.id)
        }}
      >
        <Avatar name={getFullName(user)} />
        <div>
          {user.identity?.first_name && user.identity?.last_name && (
            <div>
              <Text marginLeft={8} size={300} fontWeight={500}>
                {getFullName(user)}
              </Text>
            </div>
          )}

          <div>
            <Text marginLeft={8} size={300} cursor="pointer" color="gray700">
              {user.id}
            </Text>
          </div>
        </div>
      </Table.Cell>

      {details && !isOnboardingFinished(details) && (
        <Table.Cell paddingX="20px" flex="none">
          <Button isLoading={isTokenLoading} onClick={handleClick}>
            Open Atomic
          </Button>
        </Table.Cell>
      )}

      {details && isOnboardingFinished(details) && (
        <Table.Cell paddingX="20px" flex="none">
          <Text size={300} color="green600">
            Onboarding Complete
          </Text>
        </Table.Cell>
      )}
    </Table.Row>
  )
}

function getFullName(user) {
  return user.identity?.first_name + ' ' + user.identity?.last_name
}

function isOnboardingFinished(details) {
  return (
    details.verification_status.document_verification.code ===
      'DOCUMENT_VERIFICATION_SUCCESSFUL' &&
    details.verification_status.identity_verification.code ===
      'IDENTITY_VERIFICATION_SUCCESSFUL'
  )
}
