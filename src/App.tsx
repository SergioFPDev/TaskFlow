import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { BoardPage } from './pages/BoardPage'
import { TaskDetailPage } from './pages/TaskDetailPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/board" replace />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App
