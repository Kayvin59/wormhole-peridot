'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './CookieForm.module.scss'

export default function CookieForm() {
  const [showConsent, setShowConsent] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkConsent = async () => {
      const response = await fetch('/api/check-cookie-consent')
      // If the user has not accepted the cookie consent, show the form
      if (!response.ok) {
        setShowConsent(true)
      }
    }
    checkConsent()
  }, [])

  const handleConsent = async (consent: boolean) => {
    const response = await fetch('/api/cookie-consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent }),
    })
    // If the user has accepted the cookie consent, hide the form
    if (response.ok) {
      setShowConsent(false)
      router.refresh()
    }
  }
  if (!showConsent) return null

  return (
    <div className={styles.container}>
      <p className={styles.text}>
        <span>This website uses cookies to enhance the user experience.
        By accepting you also agree to our <span><Link className={styles.link} href={"https://peridot.finance/docs"}>legal documents</Link>.</span></span>
        
      </p>
      <div className={styles.button_wrapper}>
        <button className={styles.button} onClick={() => handleConsent(true)}>
          I Accept
        </button>
        <button className={styles.button} onClick={() => handleConsent(false)}>
          I Decline
        </button>
      </div>
    </div>
  )
}

