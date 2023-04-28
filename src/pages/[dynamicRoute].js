import { useRouter } from 'next/router'
import React from 'react'

const DynamicRoute = () => {
    const router = useRouter();

    const { dynamicRoute } = router.query;
  return (
    <div>
        <h1>Page {dynamicRoute}</h1>
    </div>
  )
}

export default DynamicRoute