import { HTMLInputTypeAttribute } from 'react'
import {
  FieldErrors,
  FieldValues,
  UseFormRegisterReturn
} from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
  label: string
  name: string
  type: HTMLInputTypeAttribute
  errors: FieldErrors<T>
  registerProps?: UseFormRegisterReturn
}

const FormField = <T extends FieldValues>({
  label,
  name,
  type,
  errors,
  registerProps
}: FormFieldProps<T>) => {
  const errorMessage = errors?.[name]?.message as string | undefined

  return (
    <div className="mb-3">
      <label className="text-sm text-gray-700" htmlFor={name}>
        {label}
      </label>
      <input
        {...registerProps}
        id={name}
        name={name}
        type={type}
        className={`block w-full rounded-md border bg-gray-100 px-3 py-2 hover:bg-gray-200 focus:outline-0 ${errorMessage ? 'border-red-500' : 'border-gray-100 focus:border-blue-300'}`}
      />
      <p className="min-h-[20px] text-sm text-red-500">{errorMessage ?? ' '}</p>
    </div>
  )
}

export default FormField
