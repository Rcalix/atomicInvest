import { Table } from 'evergreen-ui'
import UserRow from './UserRow'

export default function UserTable({ users, onClick }) {
  return (
    <div className="row users">
      <Table border>
        <Table.Head height="36px">
          <Table.TextHeaderCell paddingX="20px">User</Table.TextHeaderCell>
          <Table.TextHeaderCell width={150} flex="none"></Table.TextHeaderCell>
        </Table.Head>

        <Table.Body>
          {users
            .sort((a, b) => new Date(a.created) - new Date(b.created))
            .map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onClick={(token) => {
                  onClick(user.id, token)
                }}
              />
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}
