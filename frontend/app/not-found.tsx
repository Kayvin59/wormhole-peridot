import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='not-found'>
      <h2>Site Not Found</h2>
      <Link href="/" className='link'>Return Home</Link>
    </div>
  )
}