import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import PropTypes from 'prop-types'
import './scss/style.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const ForgotPassword = React.lazy(() => import('./views/pages/forgot-password/ForgotPassword'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user')
  return user ? children : <Navigate to="/login" replace />
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('hr2-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    } else if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
