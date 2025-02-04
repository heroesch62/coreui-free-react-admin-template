import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('No reset token provided')
      setValidatingToken(false)
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch('https://localhost:7037/api/Users/verify-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          setTokenValid(true)
        } else {
          setError('This password reset link has expired or is invalid.')
        }
      } catch (err) {
        setError('Failed to verify reset token')
      } finally {
        setValidatingToken(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://localhost:7037/api/Users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      })

      // In ResetPassword.js, in the handleSubmit function, update the navigate call
      if (response.ok) {
        // Show success message and redirect to login
        navigate('/login', {
          state: {
            showToast: true, // Add this flag
            message: 'Password has been reset successfully. Please login with your new password.',
          },
        })
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to reset password')
      }
    } catch (err) {
      setError('An error occurred while resetting password')
    } finally {
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <div className="text-center">
                <CSpinner color="primary" />
                <p className="mt-3">Verifying reset token...</p>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }

  if (!tokenValid && !validatingToken) {
    return (
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <CCard className="p-4">
                <CCardBody>
                  <CAlert color="danger">{error}</CAlert>
                  <div className="text-center">
                    <CButton color="primary" onClick={() => navigate('/login')}>
                      Return to Login
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1>Reset Password</h1>
                  <p className="text-body-secondary">Enter your new password</p>
                  {error && (
                    <CAlert color="danger" className="mb-3">
                      {error}
                    </CAlert>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="New Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm New Password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol xs={6}>
                      <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-right">
                      <CButton color="link" className="px-0" onClick={() => navigate('/login')}>
                        Return to Login
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ResetPassword

