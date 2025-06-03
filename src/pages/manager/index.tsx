import { useEffect } from "react"
import { useRouter } from "next/router"

export default function ManagerPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard")
  }, [router])

  return null
}
