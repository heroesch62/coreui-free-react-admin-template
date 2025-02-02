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
import { cilEnvelope, cilPeople } from '@coreui/icons'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [roles, setRoles] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fetch roles when component mounts
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles')
        if (response.ok) {
          const data = await response.json()
          setRoles(data)
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    fetchRoles()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, roleId }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Password reset instructions have been sent to your email.',
        })
        setEmail('')
        setRoleId('')
      } else {
        setStatus({
          type: 'danger',
          message: data.message || 'Failed to process request',
        })
      }
    } catch (error) {
      setStatus({
        type: 'danger',
        message: 'An error occurred. Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <h1>Forgot Password</h1>
                  <p className="text-medium-emphasis">
                    Enter your role and email address to receive password reset instructions
                  </p>
                  <CForm onSubmit={handleSubmit}>
                    {status.message && <CAlert color={status.type}>{status.message}</CAlert>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilPeople} />
                      </CInputGroupText>
                      <CFormSelect
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        required
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
                        <CIcon icon={cilEnvelope} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                      <CCol xs={6} className="text-right">
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
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword
