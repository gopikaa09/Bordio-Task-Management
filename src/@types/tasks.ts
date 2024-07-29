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
  title: string
  status: number
  type: string
  dueDate: string
}
export type Category = {
  category: string
  value?: string
  label?: string
}
