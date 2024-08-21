import { Button, Input } from '@/components/ui'
import React, { useState } from 'react'
import { HiChevronDown, HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi'

const CustomTable = () => {
  // Define the number of days (columns)
  const numDays = 6

  // Initial projects state
  const initialProjects = [
    {
      id: 'Project1',
      tasks: [
        { name: 'Task1', hours: Array(numDays).fill(8) }
      ]
    },
    {
      id: 'Project2',
      tasks: [
        { name: 'Task2', hours: Array(numDays).fill(9) }
      ]
    }
  ]

  // State to track which project rows are expanded
  const [expandedProjects, setExpandedProjects] = useState<string[]>([initialProjects[0].id])

  // State to manage hours for each task
  const [projects, setProjects] = useState(initialProjects)

  // Handler to update hours
  const updateHour = (projectId: string, taskIndex: number, dayIndex: number, value: number) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId ? {
          ...project,
          tasks: project.tasks.map((task, tIndex) =>
            tIndex === taskIndex ? {
              ...task,
              hours: task.hours.map((hour, hIndex) => hIndex === dayIndex ? value : hour)
            } : task
          )
        } : project
      )
    )
  }

  // Handler to update task name
  const updateTaskName = (projectId: string, taskIndex: number, value: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId ? {
          ...project,
          tasks: project.tasks.map((task, tIndex) =>
            tIndex === taskIndex ? { ...task, name: value } : task
          )
        } : project
      )
    )
  }

  // Handler to add a new task to a project
  const addTask = (projectId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId ? {
          ...project,
          tasks: [...project.tasks, { name: `New Task ${project.tasks.length + 1}`, hours: Array(numDays).fill(0) }]
        } : project
      )
    )
  }

  // Handler to delete a task from a project
  const deleteTask = (projectId: string, taskIndex: number) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId ? {
          ...project,
          tasks: project.tasks.filter((_, tIndex) => tIndex !== taskIndex)
        } : project
      )
    )
  }

  // Handler to add a new project
  const addProject = () => {
    const newProjectId = `Project${projects.length + 1}`
    setProjects(prevProjects =>
      [...prevProjects, {
        id: newProjectId,
        tasks: [{ name: `New Task 1`, hours: Array(numDays).fill(0) }]
      }]
    )
    setExpandedProjects(prev => [...prev, newProjectId])
  }

  // Handler to delete a project
  const deleteProject = (projectId: string) => {
    setProjects(prevProjects =>
      prevProjects.filter(project => project.id !== projectId)
    )
    setExpandedProjects(prev => prev.filter(id => id !== projectId))
  }

  // Calculate daily totals for each date
  const calculateDailyTotals = () => {
    const dailyTotals = Array(numDays).fill(0)

    projects.forEach(project => {
      project.tasks.forEach(task => {
        task.hours.forEach((hours, index) => {
          dailyTotals[index] += hours
        })
      })
    })

    return dailyTotals
  }

  const dailyTotals = calculateDailyTotals()

  // Define the dates
  const dates = [
    '5 Aug 2024', '6 Aug 2024', '7 Aug 2024', '8 Aug 2024', '9 Aug 2024', '10 Aug 2024'
  ]

  return (
    <div className="p-4 customTable">
      <Button
        variant='solid'
        onClick={addProject}
        className="my-2"
      >
        Add Project
      </Button>
      <table className="min-w-full divide-y divide-gray-200 bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr className='Border'>
            <th className="px-4 py-4 text-left">Project</th>
            {dates.map((date, index) => (
              <th key={date} className="px-4 py-2 text-center">
                {date}
                <div className="text-sm text-gray-600">
                  {dailyTotals[index]}
                </div>
              </th>
            ))}
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map(project => (
            <React.Fragment key={project.id}>
              <tr className="bg-gray-50 cursor-pointer" onClick={() => setExpandedProjects(prev =>
                prev.includes(project.id) ? prev.filter(id => id !== project.id) : [...prev, project.id]
              )}>

                <td colSpan={dates.length + 2} className="px-4 py-2 font-semibold text-left ">
                  <Button icon={<HiChevronDown />} variant='plain' size='xs'></Button>
                  {project.id}</td>
                {/* <td className="px-4 py-2">
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete Project
                  </button>
                </td> */}
              </tr>
              {expandedProjects.includes(project.id) && project.tasks.map((task, taskIndex) => (
                <tr key={task.name} className='Border'>
                  <td className="px-4 py-2">
                    <Button
                      onClick={() => addTask(project.id)}
                      variant='plain'
                      size='xs'
                      icon={<HiOutlinePlusCircle />}
                    ></Button>
                    <Input
                      type="text"
                      value={task.name}
                      onChange={(e) => updateTaskName(project.id, taskIndex, e.target.value)}
                      className="ml-2 p-1 border border-gray-300 rounded-md"
                      style={{ width: '150px' }}
                    />
                  </td>
                  {task.hours.map((hours, dayIndex) => (
                    <td key={dayIndex} className="px-4 py-2">
                      <Input
                        type="number"
                        value={hours}
                        onChange={(e) => updateHour(project.id, taskIndex, dayIndex, Number(e.target.value))}
                        className="w-16 p-1 border border-gray-300 rounded-md text-right"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2">
                    {task.hours.reduce((total, hours) => total + hours, 0)}
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      onClick={() => deleteTask(project.id, taskIndex)}
                      size='xs'
                      variant='twoTone'
                      icon={<HiOutlineTrash />}
                    ></Button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomTable
