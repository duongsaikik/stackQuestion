import React, { useState, useContext } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { publicFetch } from '../../../util/fetcher'
import { AuthContext } from '../../../store/auth'
import ModalContext from '../../../store/modal'

import FormInput from '../../form-input'
import Button from '../../button'

import styles from './signup-form.module.css'

const VerificationForm = () => {
  const { setAuthState, info } = useContext(AuthContext)

  const { setIsComponentVisible } = useContext(ModalContext)

  const [loading, setLoading] = useState(false)

  return (
    <Formik
      initialValues={{
        email: info?.userInfo ? info?.userInfo.email : '',
        newPassword: '',
        passwordConfirmation: ''
      }}
      onSubmit={async (values, { setStatus, resetForm }) => {
        setLoading(true)
        try {
          console.log(values.newPassword)
          var request = {
            id: info?.userInfo.id,
            newPassword: values.newPassword
          }

          const user = await publicFetch.put('user/upDatePass', request)
          if (user) {
            const { data } = user
            const { token, expiresAt, userInfo } = data
            setAuthState({ token, expiresAt, userInfo })
            resetForm({})
            setIsComponentVisible(false)
          }
        } catch (error) {
          setStatus(error.response.data.message)
        }
        setLoading(false)
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .required('Required')
          .matches(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),

        newPassword: Yup.string()
          .required('Required')
          .min(6, 'Must be at least 6 characters long')
          .max(50, 'Must be at most 50 characters long'),
        passwordConfirmation: Yup.string().oneOf(
          [Yup.ref('newPassword'), null],
          'Passwords must match'
        )
      })}
    >
      {({
        values,
        errors,
        touched,
        status,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <form onSubmit={handleSubmit} className={styles.form}>
          <FormInput
            label="Email"
            type="text"
            name="email"
            autoComplete="off"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled
          />
          <FormInput
            label="NewPassword"
            type="text"
            name="newPassword"
            autoComplete="off"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            hasError={touched.newPassword && errors.newPassword}
            errorMessage={errors.newPassword && errors.newPassword}
          />

          <FormInput
            label="Password Confirm"
            type="password"
            name="passwordConfirmation"
            autoComplete="off"
            value={values.passwordConfirmation}
            onChange={handleChange}
            onBlur={handleBlur}
            hasError={
              touched.passwordConfirmation && errors.passwordConfirmation
            }
            errorMessage={
              errors.passwordConfirmation && errors.passwordConfirmation
            }
          />
          <p className={styles.status}>{status}</p>
          <Button
            primary
            full
            className={styles.submitButton}
            disabled={isSubmitting}
            isLoading={loading}
            type="submit"
          >
            Sign up
          </Button>
        </form>
      )}
    </Formik>
  )
}

export default VerificationForm
