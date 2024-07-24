import { ReactNode } from "react";
import find from "lodash/find";
import Dropdown from "../ui/Dropdown";
import useThemeClass from "@/utils/hooks/useThemeClass";
import Button from "@/components/ui/Button";
import useResponsive from "@/utils/hooks/useResponsive";



type propType = {
  value: any
  labelWithIcon: boolean
  handleChange: any
  iconOnly: boolean
  defaultValue: string | null
  className?: string
  options?: {
    value: any,
    label: string,
    icon: JSX.Element
  }[]
}

const ToggleButton = (
  { value, handleChange, options, iconOnly = false, labelWithIcon = true, defaultValue }: propType
) => {
  const item = options?.find(x => x.value != value)

  return (
    <Button
      className=" md:flex"
      variant="plain"
      size="sm"

      onClick={() =>
        handleChange(item?.value)
      }
    >
      <span className='flex gap-1'>{labelWithIcon && item?.icon} {item?.label} </span>
    </Button>
  )
}



const SelectDropdown = (
  props: propType
) => {

  const { value, handleChange, options, iconOnly = false, labelWithIcon = true, defaultValue, className = '' } = props
  const { smaller } = useResponsive()
  const themeColor = useThemeClass()
  const selectedValue = find(options, x => x.value === value)
  const textClass = defaultValue !== undefined && true && defaultValue !== selectedValue?.value && themeColor.textTheme
  return (

    (
      <div className="flex gap-1 cursor-pointer w-full">
        {options?.length == 2 && <ToggleButton {...props} />}

        {options?.length > 2 && <Dropdown
          placement={!smaller.sm ? 'bottom-end' : "bottom-start"}
          renderTitle={<span
            className={`flex gap-1 ${textClass} ${className}`}> {iconOnly || selectedValue?.label} {selectedValue?.icon} </span>}>
          {options?.map((item: any) => (
            <Dropdown.Item active={item.value == selectedValue?.value} key={item.value}
              eventKey={item.value} onClick={() => {
                handleChange(item.value)

              }}>
              <span className='flex gap-1'>{labelWithIcon && item.icon} {item.label} </span>
            </Dropdown.Item>
          ))}
        </Dropdown>}
      </div>
    )

  )
}
export default SelectDropdown