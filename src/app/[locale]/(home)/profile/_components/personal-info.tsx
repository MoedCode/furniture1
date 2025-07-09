interface Field {
  label: string
  value: string
}

interface Props {
  fields: Field[]
}

export function PersonalInfo({ fields }: Props) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Contact Information</h3>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={index} className="border-b border-gray-200 pb-3 sm:pb-4 last:border-b-0">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
              <span className="text-sm sm:text-base text-gray-600 font-medium sm:font-normal">{field.label}</span>
              <span className="text-sm sm:text-base text-gray-900 break-all sm:break-normal">{field.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

