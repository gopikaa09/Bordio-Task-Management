export const TaskStatus = {
  10: 'New Task',
  20: 'Scheduled',
  30: 'In Progress',
  40: 'Completed',
}
export const PriorityEnum = {
  1: 'Urgent',
  2: 'High',
  3: 'Medium',
  4: 'Low',
  5: 'None'
}
export const LabelsEnum = {
  10: 'UI-Fixes',
  20: 'Enhancement',
  30: 'Functional',
  40: 'Back-End',
  50: 'Front-End'
}

export type Task = {
  id: string
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
export type Category = {
  category: string
  value?: string
  label?: string
}

export const statusOptions = [
  { value: 10, label: 'New Task' },
  { value: 20, label: 'Scheduled' },
  { value: 30, label: 'In Progress' },
  { value: 40, label: 'Completed' },
]

export const PriorityOptions = [
  { value: 1, label: 'Urgent' },
  { value: 2, label: 'High' },
  { value: 3, label: 'Medium' },
  { value: 4, label: 'Low' },
  { value: 5, label: 'None' },
]

export const LabelOptions = [
  { value: 10, label: 'UI_Fixes' },
  { value: 20, label: 'Enhancement' },
  { value: 30, label: 'Functional' },
  { value: 40, label: 'Back-End' },
  { value: 50, label: 'Fronts-End' },
]