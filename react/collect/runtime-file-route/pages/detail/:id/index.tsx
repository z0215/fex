import { useParams } from 'react-router-dom'
import Detail from '../components/Detail'

const Page = () => {
  const { id } = useParams()

  return <Detail id={id} />
}

export default Page
