import React from "react";
import AuthLayout from "~/components/AuthLayout";
import RegisterForm from "~/components/RegisterForm";
Register.propTypes = {};

function Register({}) {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
Register.layout = AuthLayout

export default Register;
