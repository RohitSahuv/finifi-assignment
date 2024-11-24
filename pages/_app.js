import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  )
}
