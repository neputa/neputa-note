import { useForm } from 'react-hook-form'

type FormValues = {
  name: string
  email: string
  message: string
}

interface FormProps {
  formUrl: string
  siteKey: string
}

export default function ContactForm(props: FormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({ mode: 'onChange' })

  const onSubmit = handleSubmit(async (data) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(props.siteKey, { action: 'submit' }).then(async (token) => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value)
        })

        formData.append('googleReCaptchaToken', token)

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
            location.href = '/error/'
          }
        } catch (err) {
          location.href = '/error/'
        }
      })
    })
  })

  return (
    <form onSubmit={onSubmit}>
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
          className='p-4 md:p-4 block w-full text-md rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900'
          {...register('email', { required: '※Emailは必須項目です。' })}
          placeholder='example@example.com'
        />
      </div>
      <div className='mb-8'>
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
          className='p-4 md:p-4 block w-full text-md rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900'
          {...register('message', { required: '※Message は必須項目です。' })}
          placeholder='メッセージ'
        ></textarea>
      </div>
      <div className='flex justify-center items-center mb-4'>
        <button type='submit' className='primary-btn mx-auto w-full'>
          送信
        </button>
      </div>
    </form>
  )
}
