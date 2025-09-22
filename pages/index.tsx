import { NextPage } from 'next';
import Head from 'next/head';
import MentalHealthApp from '../components/mainapp';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>MindWell - Mental Health Support App</title>
        <meta name="description" content="A comprehensive mental health support application with AI chatbot, mood tracking, sleep monitoring, meditation timer, and wellness resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8b5cf6" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mindwell.vercel.app/" />
        <meta property="og:title" content="MindWell - Mental Health Support App" />
        <meta property="og:description" content="Your personal mental health companion with AI support, mood tracking, and wellness tools." />
        <meta property="og:image" content="/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://mindwell.vercel.app/" />
        <meta property="twitter:title" content="MindWell - Mental Health Support App" />
        <meta property="twitter:description" content="Your personal mental health companion with AI support, mood tracking, and wellness tools." />
        <meta property="twitter:image" content="/twitter-image.png" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MindWell" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>
      <main>
        <MentalHealthApp />
      </main>
    </>
  );
};

export default HomePage;