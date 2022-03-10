import { Button, toaster } from 'evergreen-ui'

export default function Footer({ onSuccess }) {
  function createNewUser() {
    fetch('/example/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        custom_user_id: String(Date.now()),
      }),
    })
      .then((rsp) => {
        if (!rsp.ok) {
          throw new Error('HTTP ' + rsp.status)
        }

        return rsp.json()
      })
      .then((data) => {
        toaster.notify('Created user ' + data.id)
        onSuccess()
      })
      .catch((error) => toaster.danger(error.message))
  }

  return (
    <div className="row footer">
      <Button appearance="primary" onClick={createNewUser}>
        Create user
      </Button>
    </div>
  )
}
