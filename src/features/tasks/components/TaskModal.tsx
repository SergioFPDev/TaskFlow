import { Modal } from '../../../components/Modal'
import { Task, TaskFormValues } from '../types'
import { TaskForm } from './TaskForm'

type TaskModalProps = {
  open: boolean
  task?: Task
  onClose: () => void
  onSubmit: (values: TaskFormValues) => void
}

export function TaskModal({ open, task, onClose, onSubmit }: TaskModalProps) {
  return (
    <Modal open={open} title={task ? 'Edit task' : 'Create new task'} onClose={onClose}>
      <TaskForm task={task} onCancel={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
