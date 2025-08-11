import { useForm } from 'react-hook-form'
import { useState } from 'react'

type FormValues = {
  name: string
  email: string
  message: string
}

interface FormProps {
  formUrl: string
  siteKey: string
}

declare global {
  interface Window {
    grecaptcha: any
  }
}

export default function ContactForm(props: FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ mode: 'onChange' })

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true)
    setSubmitError(null)

    if (!props.formUrl) {
      setSubmitError('設定エラー: FormspreeのURLが設定されていません')
      setIsSubmitting(false)
      return
    }

    if (!props.siteKey) {
      setSubmitError('設定エラー: reCAPTCHAのサイトキーが設定されていません')
      setIsSubmitting(false)
      return
    }

    if (typeof window.grecaptcha === 'undefined') {
      setSubmitError('reCAPTCHAが読み込まれていません。ページを再読み込みしてください。')
      setIsSubmitting(false)
      return
    }

    try {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(props.siteKey, { action: 'submit' }).then(async (token: string) => {
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value)
          })
          formData.append('g-recaptcha-response', token)

          try {
            const response = await fetch(props.formUrl, {
              method: 'POST',
              body: formData,
              headers: {
                Accept: 'application/json'
              }
            })

            if (response.ok) {
              location.href = '/thanks/'
            } else {
              const responseText = await response.text()
              setSubmitError(`送信に失敗しました。しばらく時間をおいて再度お試しください。`)
              setIsSubmitting(false)
            }
          } catch (err) {
            setSubmitError('ネットワークエラーが発生しました。しばらく時間をおいて再度お試しください。')
            setIsSubmitting(false)
          }
        }).catch((error: any) => {
          setSubmitError('reCAPTCHA エラーが発生しました。ページを再読み込みしてください。')
          setIsSubmitting(false)
        })
      })
    } catch (err) {
      setSubmitError('reCAPTCHA の初期化に失敗しました。ページを再読み込みしてください。')
      setIsSubmitting(false)
    }
  })

  return (
    <form onSubmit={onSubmit}>
      {submitError && (
        <div className='mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded'>
          <strong>エラー:</strong> {submitError}
        </div>
      )}

      <div className='mb-6'>
        <label htmlFor='name' className='block text-sm font-medium mb-2'>
          Name
          <span className='text-red-800 mx-1 text-sm'>*</span>
          {errors?.name && (
            <span id='error-name-required' aria-live='assertive' className='ml-4 text-red-700'>
              {errors.name.message}
            </span>
          )}
        </label>
        <input
          id='name'
          className='p-4 block w-full text-md rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 '
          {...register('name', { required: '※Name は必須項目です。' })}
          aria-describedby='error-name-required'
          placeholder='名前'
          disabled={isSubmitting}
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='email' className='block text-sm font-medium mb-2'>
          Email
          <span className='text-red-800 mx-1 text-sm'>*</span>
          {errors?.email && (
            <span id='error-email-required' aria-live='assertive' className='ml-4 text-red-700'>
              {errors.email.message}
            </span>
          )}
        </label>
        <input
          id='email'
          type='email'
          className='p-4 block w-full text-md rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900'
          {...register('email', {
            required: '※Emailは必須項目です。',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '有効なメールアドレスを入力してください'
            }
          })}
          placeholder='メールアドレス'
          disabled={isSubmitting}
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='message' className='block text-sm font-medium mb-2'>
          Message
          <span className='text-red-800 mx-1 text-sm'>*</span>
          {errors?.message && (
            <span id='error-message-required' aria-live='assertive' className='ml-4 text-red-700'>
              {errors.message.message}
            </span>
          )}
        </label>
        <textarea
          id='message'
          rows={5}
          className='p-4 block w-full text-md rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900'
          {...register('message', { required: '※Message は必須項目です。' })}
          placeholder='メッセージ'
          disabled={isSubmitting}
        ></textarea>
      </div>

      <div className='mb-6'>
        <p className='text-xs text-gray-600'>
          このサイトはreCAPTCHA v3によって保護されており、Googleの
          <a href='https://policies.google.com/privacy' className='underline' target='_blank' rel='noopener noreferrer'>
            プライバシーポリシー
          </a>
          と
          <a href='https://policies.google.com/terms' className='underline' target='_blank' rel='noopener noreferrer'>
            利用規約
          </a>
          が適用されます。
        </p>
      </div>

      <div className='flex justify-center items-center mb-4'>
        <button
          type='submit'
          className='w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : '送信'}
        </button>
      </div>
    </form>
  )
}
