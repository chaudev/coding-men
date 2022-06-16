import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './LoginForm.module.scss'
import { useRouter } from 'next/router'
import { Spin } from 'antd'
import Link from 'next/link'
import clsx from 'clsx'

type Inputs = {
	text: string
	textRequired: string
}

interface LoginInputs {
	username: Inputs
	password: Inputs
}

function index(props: any) {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginInputs>()

	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const _Submit = async (data: any) => {
		setLoading(true)
		props?.onSubmit(data)
	}

	const moveToSignUp = (e: any) => {
		e.preventDefault()
		router.push('/account/register')
	}

	// RENDER
	return (
		<>
			<div className={styles.container}>
				<div className={styles.wrapBox}>
					<div className={styles.wrapForm}>
						<form onSubmit={handleSubmit(_Submit)} className={styles.loginForm}>
							<div className={styles.loginFormImg}>
								<img src="/images/logo.png" alt="coding-logo" />
							</div>

							<h6 className={styles.title}>Đăng nhập Coding Mentor</h6>

							<input name="csrfToken" type="hidden" defaultValue={props?.csrfToken} />

							<label className={styles.fcontrol}>Email hoặc tài khoản</label>

							<div className={styles.inputIcon}>
								<input
									name="username"
									defaultValue=""
									{...register('username', {
										required: true,
										validate: (value: any) => {
											return !!value.trim()
										},
										setValueAs: (value) => value.trim()
									})}
									placeholder="Email"
								/>
								<img src="/icons/email-icon.png" className={clsx(styles.icon, styles.iconEmail)} />
							</div>
							{errors.username && <span className="form-error">Hãy điền tên đăng nhập</span>}

							<label className="mt-3">Mật khẩu</label>
							<div className={styles.inputIcon}>
								<input
									name="password"
									type="password"
									defaultValue=""
									{...register('password', { required: true })}
									placeholder="Mật khẩu"
								/>
								<img src="/icons/Lock.png" className={styles.icon} />
							</div>
							{errors.password && <span className="form-error">Hãy điền mật khẩu</span>}
							{!!router.query?.error && router.query?.error != 'undefined' && (
								<span className="form-error">{JSON.parse(router.query?.error.toString())?.message}</span>
							)}

							<div className={styles.checkbox}>
								<input type="checkbox" />
								<label>Ghi nhớ đăng nhập</label>

								<div className={styles.forgetPass} style={{ marginLeft: 'auto' }}>
									<Link href="/reset-password">
										<a>Quên mật khẩu?</a>
									</Link>
								</div>
							</div>

							<div className="position-relative">
								<input type="submit" value={'Đăng nhập'} />
								{loading && <Spin className="loading-login" />}
								<div className="w-100 m-1 text-center color-red fw-bold">{props.error && props.error}</div>
							</div>
							<div className={styles.boxSignup}>
								Chưa có tài khoản?{' '}
								<a href="" onClick={moveToSignUp} style={{ textDecoration: 'underline' }}>
									Tạo tài khoản mới
								</a>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}

export default index
