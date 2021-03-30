import React from 'react'
  import PropTypes from 'prop-types'
  import { Link } from 'react-router-dom'
  

  //Conditionally rendered buttons using the target dataset status
  export const Options = ({status, handler}) => {
  

    return(
    <div>
    <div>
      <button onClick={handler} className="button" data-status={status === 'Login' ? 'Create account' : "Login"}>
      {status === 'Login' ? 'Need to create an account?' : 'Please log in!'}
      </button>
      </div>
      {/* If the status is Login, return this */}
      {status === 'Login' ? (
        <div>
        <button className="button" onClick={handler} data-status="Reset Password">
          Need a new password?
        </button>
        </div>
      ): null}
    </div>
  

    )
  }
  

  Options.propTypes = {
    handler: PropTypes.func,
    status: PropTypes.string,
  }
  Options.defaultProps = {
  status: "Login"
  }