import { useCallback, useState } from 'react'
import Header from './components/Header'
import UserTable from './components/UserTable'
import Footer from './components/Footer'
import IFrameModule from './components/IFrameModule'
import useUsers from './shared/useUsers'
import useAtomicModule from './shared/useAtomicModule'

export default function App() {
  const [users, refreshUsers] = useUsers()
  const [token, setToken] = useState()

  const module = useAtomicModule({
    // Token to authenticate your app with Atomic Module.
    // This is a short lived, one-time use token that should be unique for each Atomic Module session.
    token,

    // Pick and choose what features of Atomic Module you want to use.
    features: [
      'page-get-started',
      'page-how-it-works',
      'page-investment-preference',
      'page-time-horizon',
      'page-large-drop',
      'page-gross-income',
      'page-risk-level',
      'page-investment-plan',
      'page-initial-contribution',
      'page-excluded-investing',
      'page-included-investing',
      'page-verify-identity',
      'page-personal-info',
      'page-contact-info',
      'page-birthday',
      'page-address',
      'page-us-status',
      'page-emp-status',
      'page-affiliations',
      'page-restrictions',
      'page-trusted-contact',
      'page-connect-account',
      'page-review',
      'page-sign-agreement',
      'page-onboarding-success',
    ],

    // We use window.postMessage() to communicate events from Atomic Module.
    // For iframe, you would need to provide origin where these events should go to.
    origin: window.location.origin,

    // For webview, set origin as empty string
    // origin: '',
  })

  const openWithToken = useCallback(
    (userId, token) => {
      setToken(token)
      module.open(userId)
    },
    [module]
  )

  return (
    <div className="app">
      <Header />
      <UserTable users={users} onClick={openWithToken} />
      <Footer onSuccess={refreshUsers} />
      <IFrameModule module={module} />
    </div>
  )
}
