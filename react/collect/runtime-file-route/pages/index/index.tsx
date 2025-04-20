import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLastVisitedPage } from '~/integrations'

const Page = () => {
  const [lastPage] = useLastVisitedPage()
  const navigate = useNavigate()
  useEffect(() => {
    navigate(lastPage)
  }, [])
  return null
}

export default Page
