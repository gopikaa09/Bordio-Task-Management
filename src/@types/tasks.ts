export const TaskStatus = {
  10: 'New Task',
  20: 'Scheduled',
  30: 'In Progress',
  40: 'Completed',
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
