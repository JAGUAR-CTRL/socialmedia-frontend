import React, {useState} from 'react'
import "./signup.css"
import {Formik, Form, Field, ErrorMessage} from "formik"
import * as yup from "yup";
import {Link, useNavigate} from "react-router-dom"
import Logo from '../../components/Logo.jsx'
import { signUp } from '../api/axiosRequests.js';
import Spinner from '../../components/Spinner.jsx';
function Signup() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
        const initialValues = {
            username: "",
            password:"",
            gender: ""
        }
        const validationSchema = yup.object({
            username: yup.string().required().min(5),
            password: yup.string().required().min(6).max(20),
            gender: yup.string().required()
        })
  return (
    <div>
      <div className="header">
            <Logo/>
        </div>
        <div className='body'>
            <h2>Sign Up</h2>
            <Formik validationSchema={validationSchema} 
                    initialValues={initialValues}
                    onSubmit={async (values, helpers) => {
                        setLoading(true)
                        await signUp(values);
                        helpers.resetForm();
                        setLoading(false);
                        navigate("/");
                    }}>
                <Form className='form'>
                    <div className="username field">
                        <label htmlFor="username">Username</label>
                        <Field type="text" name="username" className="username input"/>
                        <ErrorMessage name='username'/>
                    </div>
                    <div className="password field">
                        <label htmlFor="password">Password</label>
                        <Field type="password" name="password" className="password input"/>
                        <ErrorMessage name='password'/>
                    </div>
                    <div className="gender">
                        <div>Gender</div>
                        <div className="gender-container">
                            <div className="male-input">
                                <label htmlFor="male">Male</label>
                                <Field type="radio" name="gender" value="male"  id="male" className="gender input"/>
                            </div>
                            <div className="female-input">
                                <label htmlFor="female">Female</label>
                                <Field type="radio" name="gender" value="female"  id="female" className="gender input"/>
                            </div>
                        </div>
                        <ErrorMessage name='gender'/>
                    </div>

                    <button type='submit'>{loading ? <Spinner size={20}/> : "Sign Up"}</button>
                    <p style={{width: "100%", textAlign:"center"}}>Already have an account? Just <Link to="/login" style={{color: "turquoise", textDecoration: "none"}}>log in</Link> now</p>
                </Form>
            </Formik>
            <p className={!error || error == "" ? "" : "error"}>{error}</p>
        </div>
    </div>
  )
}

export default Signup
