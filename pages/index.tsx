import type { NextPage } from 'next'
import Image from 'next/image'
import { dehydrate, QueryClient, useQuery } from 'react-query'

type SpaceXData = {
  name: string
  links: {
    patch: {
      large: string
    }
  }
}

const getSpaceXData = async () =>
  await (await fetch('https://api.spacexdata.com/v4/launches/latest')).json()

const Home: NextPage = () => {
  const { data, isFetching } = useQuery<SpaceXData>(
    'spacex',
    getSpaceXData
  )
  console.log(data)

  if (!data) return <div>No data!!</div>

  return (
    <>
      <header>
        <h2>{data?.name}</h2>
      </header>
      <main>
        <Image
          src={data?.links.patch.large}
          alt='patch-large'
          width={500}
          height={500}
        />
      </main>
    </>
  )
}

export default Home

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery<SpaceXData>('spacex', getSpaceXData)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
