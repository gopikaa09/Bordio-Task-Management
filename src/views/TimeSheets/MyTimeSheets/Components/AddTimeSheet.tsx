import { Button, DatePicker, FormContainer, FormItem, Input, TimeInput } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Field, FieldProps, Form, Formik } from 'formik'
import React from 'react'

type FormModel = {
  date: string,
  in: string,
  out: string,
  hours: string
}
const AddTimeSheet = () => {
  const sheetsURL = 'http://localhost:4000/timeSheetList'
  const { mutateAsync: AddTimeSheet } = useMutation({
    mutationKey: ['addTimeSheet'],
    mutationFn: async (values) => {
      const response = await axios.post(sheetsURL, values)
      return response.data
    }
  })

  return (
    <div>
      <Formik
        initialValues={{
          date: '',
          in: '',
          out: '',
          hours: ''
        }}
        onSubmit={async (values) => {
          console.log(values);
          await AddTimeSheet(values)
        }}

      >
        {({ values, errors, touched }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Date"
              >
                <Field name="date" placeholder="Date">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DatePicker
                      field={field}
                      form={form}
                      value={values.date}
                      onChange={(date) => {
                        form.setFieldValue(
                          field.name,
                          date
                        )
                      }}
                    />
                  )}
                </Field>
              </FormItem>
              <FormItem
                label="Start Time"
                invalid={errors.in && touched.in}
                errorMessage={errors.in}
              >
                <Field name="in" placeholder="Start Time">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <TimeInput
                      field={field}
                      form={form}
                      value={values.in}
                      onChange={(time) => {
                        form.setFieldValue(
                          field.name,
                          time
                        )
                      }}
                    />
                  )}
                </Field>
              </FormItem>
              <FormItem
                label="End Time"
                invalid={errors.out && touched.out}
                errorMessage={errors.out}
              >
                <Field name="in" placeholder="Start Time">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <TimeInput
                      field={field}
                      form={form}
                      value={values.out}
                      onChange={(time) => {
                        form.setFieldValue(
                          field.name,
                          time
                        )
                      }}
                    />
                  )}
                </Field>
              </FormItem>
              <FormItem>
                <Button type='submit'>Save</Button>
              </FormItem>
            </FormContainer>
          </Form>
        )}

      </Formik>

    </div>
  )
}

export default AddTimeSheet
