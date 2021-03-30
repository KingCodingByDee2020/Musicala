  import React, { useState, useEffect } from 'react'
  import  {Formik, ErrorMessage, Field, Form } from 'formik'
  import * as Yup from "yup"
  import { useHistory, useLocation } from 'react-router-dom'
  //Use Formik to build, Yup to validate, and conditionally render the input and message components
  import api from 'api/routes'
  import auth from "auth"
  

  import { Options } from './Options'
  const usersAPI = api("users")
  

  

  export const Login = () => {
  

    const history = useHistory()
    const { state } = useLocation()
    const [status, setStatus] = useState(state?.status || 'Loading...')
  

    function handleStatus({
      target: {
        dataset: { status },
      },
    }) {
      console.log(status)
      setStatus(status)
    }
  

      useEffect(() => {
  

        if (status === "Loading...") {
          ;(async () => {
            const { currentUser } = auth
            if (currentUser) {
              try {
                const { uid } = currentUser
                const res = await usersAPI.show(uid)
                const {
                  body: { name },
                } = await res.json()
                history.push(`/mainview/${uid}`, { name })
              } catch (err) {
                console.error(err)
              }
            } else {
              setStatus("Login")
            }
          })()
        } else {
          auth.signOut()
        }
      }, [history, status])
  

  

  return (
    <section>
      <Formik
          initialValues={{
            name: "",
            email: "",
            pass: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address!")
              .required("Email is required!"),
            name:
              status === "Create Account" &&
              Yup.string().required("Name is required!"),
            pass:
              status !== "Reset Password" &&
              Yup.string().min(6).required("Password is required!"),
          })}
          onSubmit={({ name, email, pass }, { setSubmitting }) => {
            switch (status) {
              case "Reset Password":
                auth
                  .sendPasswordResetEmail(email)
                  .then(() => {
                    setSubmitting(false)
                  })
                  .catch((err) => {
                    setSubmitting(false)
                  })
                break
              case "Login":
                auth
                  .signInWithEmailAndPassword(email, pass)
                  .then(({ user: { uid } }) => usersAPI.show(uid))
                  .then((res) => {
                    if (res.status > 400) {
                      throw new Error(`Unable to login ATM! 😞🙇🏽‍♂️
                      Please check your internet connection and/or contact support!
                    `)
                    }
                    return res.json()
                  })
                  .then(({ body: { uid, name } }) => {
                    history.push(`/mainview/${uid}`, { name })
                  })
                  .catch((err) => {
                    setSubmitting(false)
                  })
                break
              default:
                auth
                  .createUserWithEmailAndPassword(email, pass)
                  .then(({ user: { uid } }) => usersAPI.create({ uid, name }))
                  .then((res) => {
                    if (res.status > 400) {
                      throw new Error(`Unable to create an account ATM! 😞🙇🏽‍♂️
                      Please check your internet connection and/or try again later! 🤞🏽
                    `)
                    }
                    return res.json()
                  })
                  .then(({ uid }) => {
                    history.push(`/mainview/${uid}`, { name })
                  })
                  .catch((err) => {
                    setSubmitting(false)
                    auth.currentUser.delete().then(() => {
                      console.info(
                        "Removing any newly created auth user to preserve data integrity!"
                      )
                    })
                  })
            }
          }}
        >
                {({ isSubmitting }) => (
            <Form>
              {status !== "Login" && status !== "Reset Password" ? (
                <div className="field">
                  <label htmlFor="name" className="ml-2">
                    Name
                  </label>
                  <div className="control mx-2 my-1">
                    <Field name="name" type="text" className="w-100" />
                    <p className="help is-danger">
                      <ErrorMessage name="name" />
                    </p>
                  </div>
                </div>
              ) : null}
  

              <div className="field">
                <label htmlFor="email" className="ml-2">
                  Email
                </label>
                <div className="control mx-2 my-1">
                  <Field name="email" type="email" className="w-100" />
                  <p className="help is-danger">
                    <ErrorMessage name="email" />
                  </p>
                </div>
              </div>
  

              {status !== "Reset Password" ? (
                <div className="field">
                  <label htmlFor="pass" className="ml-2">
                    Password
                  </label>
                  <div className="control mx-2 my-1">
                    <Field name="pass" type="password" className="w-100" />
                    <p className="help is-danger">
                      <ErrorMessage name="pass" />
                    </p>
                  </div>
                </div>
              ) : null}
 

              <button
                type="submit"
                className="button is-success ml-2 mt-2"
                disabled={isSubmitting}
              >
                {status}
              </button>
            </Form>
          )}
      </Formik>
      <Options status={status} handler={handleStatus}/>
  

    </section>
  )
  }

  
