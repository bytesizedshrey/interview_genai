import { useNavigate,Link } from 'react-router';
import '../auth.form.scss'

const Register = () => {

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="enter your username..."
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="enter your email..."
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="enter your password..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="button primary-button active"
                    >
                        Register
                    </button>

                </form>
                <p>already have an account? <Link to={'/login'}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register