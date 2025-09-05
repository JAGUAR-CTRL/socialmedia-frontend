import {useState} from 'react'
import "./login.css"
import {Formik, Form, Field, ErrorMessage} from "formik"
import * as yup from "yup";
import {Link, useNavigate} from "react-router-dom"
import Spinner from "./../../components/Spinner.jsx";
import Logo from '../../components/Logo.jsx'
import { logIn } from '../api/axiosRequests.js';
function Login() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const initialValues = {
        username: "",
        password:""
    }
    const validationSchema = yup.object({
        username: yup.string().required(),
        password: yup.string().required()
    })
  return (
    <div>
        <div className="header">
            <Logo/>
        </div>
        <div className='body'>
            <h2>Log In</h2>
            <Formik validationSchema={validationSchema} 
                    initialValues={initialValues}
                    onSubmit={async (values, helpers) => {
                        setLoading(true);
                        await logIn(values);
                        helpers.resetForm();
                        setLoading(false);
                        navigate("/")
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
                    <button type='submit'>{loading ? <Spinner size={20}/> : "Log In"}</button>
                    <p style={{width: "100%", textAlign:"center"}}>Dont have an account? <Link to="/signup" style={{color: "turquoise", textDecoration: "none", wordWrap: ""}}>Create an account</Link> now</p>
                   
                </Form>
            </Formik>
        </div>
    </div>
  )
}

export default Login
