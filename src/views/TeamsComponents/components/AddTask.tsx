import { LabelOptions, PriorityOptions, statusOptions } from "@/@types/tasks"
import { Button, DatePicker, FormContainer, FormItem, Input, Select, TimeInput } from "@/components/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Field, FieldProps, Form, Formik } from "formik"
import * as Yup from 'yup'

type FormModel = {
  title: string,
  description: string,
  status: number,
  priority: number
  assignes: string,
  lables: string
  modules: string
  startDate: string
  dueDate: string
  estimates: string,
  attachements: string
}

const AddTask = ({ drawerClose, status, DataURL }) => {
  console.log(status);
  const initialValues = {
    title: '',
    description: '',
    priority: '',
    assignes: '',
    lables: '',
    modules: '',
    status: 1, //new task default
    startDate: '',
    dueDate: '',
    estimates: '',
    attachements: ''
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title Required"),
    status: Yup.number().required("Status Required")
  })


  const TaskListUrl = DataURL;
  const queryClient = useQueryClient();

  const { mutateAsync: addTask } = useMutation({
    mutationKey: ["AddTask"],
    mutationFn: async (values: any) => {
      const data = {
        title: values?.title,
        description: values?.description,
        status: values?.status,
        priority: values?.priority,
        assignes: values?.assignes,
        lables: values?.lables,
        modules: values?.modules,
        startDate: values?.startDate,
        dueDate: values?.dueDate,
        estimates: values?.estimates,
        attachements: values?.attachements
      }
      return await axios.post(TaskListUrl, data)
    },
    onError: (error) => {
      console.error("Error adding task:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasklistQuery"])
    }
  })
  const MembersURl = 'http://localhost:4000/peoples';

  const { data: peoples } = useQuery({
    queryKey: ['Peoples'],
    queryFn: async () => {
      const response = await axios.get(MembersURl)
      return response.data
    }
  })

  const ModulesURL = 'http://localhost:4000/modules';

  const { data: Modules } = useQuery({
    queryKey: ['Modules'],
    queryFn: async () => {
      const response = await axios.get(ModulesURL)
      return response.data
    }
  })


  const memberOPtions =
    peoples &&
    peoples?.map((item: { uid: any; name: any; children: any }) => ({
      value: item.name,
      label: item.name,
    }))

  const ModuleOptions =
    Modules &&
    Modules?.map((item: { uid: any; name: any; children: any }) => ({
      value: item.name,
      label: item.name,
    }))


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
              <FormItem
                label="Priority"
                invalid={errors.priority && touched.priority}
                errorMessage={errors.priority}
              >
                <Field name="priority">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      {...field}
                      options={PriorityOptions}
                      value={PriorityOptions.find(
                        option => option.value === field.value
                      )}
                      onChange={(option) =>
                        form.setFieldValue(field.name, option?.value)
                      }
                    />
                  )}
                </Field>
              </FormItem>
              <FormItem
                label="Assignes"
                invalid={errors.assignes && touched.assignes}
                errorMessage={errors.assignes}
              >
                <Field name="assignes">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      {...field}
                      options={memberOPtions}
                      value={memberOPtions?.find(
                        option => option.value === field.value
                      )}
                      onChange={(option) =>
                        form.setFieldValue(field.name, option?.value)
                      }
                    />
                  )}
                </Field>
              </FormItem>
              <FormItem
                label="Labels"
                invalid={errors.lables && touched.lables}
                errorMessage={errors.lables}
              >
                <Field name="lables">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      {...field}
                      options={LabelOptions}
                      value={LabelOptions?.find(
                        option => option.value === field.value
                      )}
                      onChange={(option) =>
                        form.setFieldValue(field.name, option?.value)
                      }
                    />
                  )}
                </Field>
              </FormItem>
              <FormItem
                label="Modules"
                invalid={errors.modules && touched.modules}
                errorMessage={errors.modules}
              >
                <Field name="modules">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Select
                      {...field}
                      options={ModuleOptions}
                      value={ModuleOptions?.find(
                        option => option.value === field.value
                      )}
                      onChange={(option) =>
                        form.setFieldValue(field.name, option?.value)
                      }
                    />
                  )}
                </Field>
              </FormItem>
              <FormItem
                label="Start Date"
                invalid={errors.startDate && touched.startDate}
                errorMessage={errors.startDate}
              >
                <Field name="startDate" placeholder="Date">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DatePicker
                      field={field}
                      form={form}
                      value={values.startDate}
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
                label="Due Date"
                invalid={errors.dueDate && touched.dueDate}
                errorMessage={errors.dueDate}
              >
                <Field name="dueDate" placeholder="Date">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DatePicker
                      field={field}
                      form={form}
                      value={values.dueDates}
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
                label="Time Estimates"
                invalid={errors.estimates && touched.estimates}
                errorMessage={errors.estimates}
              >
                <Field
                  type="number"
                  name="estimates"
                  placeholder="Description"
                  component={Input}
                />
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
