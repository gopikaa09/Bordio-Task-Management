import { Button, FormContainer, FormItem, Input, Select } from "@/components/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Field, FieldProps, Form, Formik } from "formik"
import * as Yup from 'yup'

type FormModel = {
  title: string,
  description: string,
  status: number,
}

const AddTask = ({ drawerClose }) => {
  const initialValues = {
    title: '',
    description: '',
    status: 1, // Default value corresponding to 'New Task'
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title Required"),
    status: Yup.number().required("Status Required")
  })

  const TaskListUrl = 'http://localhost:4000/taskList'; // Ensure this is the correct URL
  const queryClient = useQueryClient();

  const { mutateAsync: addTask } = useMutation({
    mutationKey: ["AddTask"],
    mutationFn: async (values: any) => {
      const data = {
        title: values?.title,
        description: values?.description,
        status: values?.status,
      }
      return await axios.post(TaskListUrl, data)
    },
    onError: (error) => {
      console.error("Error adding task:", error);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries(["tasklist"])
      console.log("Task added successfully:", response.data);
    }
  })

  const statusOptions = [
    { value: 10, label: 'New Task' },
    { value: 20, label: 'Scheduled' },
    { value: 30, label: 'In Progress' },
    { value: 40, label: 'Completed' },
  ]

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await addTask(values);
            resetForm();
            drawerClose(true)
          } catch (error) {
            console.error("Failed to add task:", error);
          }
        }}
      >
        {({ values, errors, touched }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Title"
                invalid={errors.title && touched.title}
                errorMessage={errors.title}
              >
                <Field
                  type="text"
                  name="title"
                  placeholder="Title"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Description"
                invalid={errors.description && touched.description}
                errorMessage={errors.description}
              >
                <Field
                  type="text"
                  name="description"
                  placeholder="Description"
                  component={Input}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Status"
                invalid={errors.status && touched.status}
                errorMessage={errors.status}
              >
                <Field name="status">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      {...field}
                      options={statusOptions}
                      value={statusOptions.find(
                        option => option.value === field.value
                      )}
                      onChange={(option) =>
                        form.setFieldValue(field.name, option?.value)
                      }
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem>
                <Button type="submit" variant="solid">
                  Submit
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default AddTask
