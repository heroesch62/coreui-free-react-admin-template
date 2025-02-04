import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAt, cilPeople } from '@coreui/icons' // Changed cilEnvelope to cilAt

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [roles, setRoles] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://localhost:7037/api/Roles')
        if (response.ok) {
          const data = await response.json()
          setRoles(data)
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
        setStatus({
          type: 'danger',
          message: 'Failed to load roles. Please refresh the page.',
        })
      }
    }

    fetchRoles()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('https://localhost:7037/api/Users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          roleId: parseInt(roleId, 10),
        }),
      })

      const data = await response.json()

      // Always show success message to prevent email enumeration
      setStatus({
        type: 'success',
        message:
          'If your email and role match our records, you will receive password reset instructions.',
      })
      setEmail('')
      setRoleId('')
    } catch (error) {
      console.error('Error:', error)
      setStatus({
        type: 'danger',
        message: 'An error occurred. Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <h1>Forgot Password</h1>
                  <p className="text-body-secondary">
                    Enter your role and email address to receive password reset instructions
                  </p>
                  <CForm onSubmit={handleSubmit}>
                    {status.message && (
                      <CAlert color={status.type} className="mb-3">
                        {status.message}
                      </CAlert>
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilPeople} />
                      </CInputGroupText>
                      <CFormSelect
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        required
                        disabled={isLoading}
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilAt} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <Link to="/login">
                          <CButton color="link" className="px-0">
                            Back to Login
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>HR2 System</h2>
                    <p>
                      Password reset is easy. Just tell us your role and email address, and we will
                      send you instructions to reset your password.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword
