import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {ReactNode} from "react";

interface LayoutArgs{
    children: ReactNode
}

export default function Layout({ children } : LayoutArgs ) {
  const router = useRouter();
//   const isActive = (path) => {
//     if (router.pathname === path) {
//       return 'nav-item active';
//     }
//     return 'nav-item';
//   };
//   const returnName = (user) => {
//     if (user.name) {
//       return user.name;
//     }
//     return 'Profile';
//   };
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='stylesheet'
          href='https://use.fontawesome.com/releases/v5.0.13/css/all.css'
          integrity='sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp'
          crossOrigin='anonymous'
        ></link>
        <link
          rel='stylesheet'
          href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'
          integrity='sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB'
          crossOrigin='anonymous'
        ></link>
        <script
          src='http://code.jquery.com/jquery-3.3.1.min.js'
          integrity='sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8='
          crossOrigin='anonymous'
          async
          defer
        ></script>
        <script
          src='https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js'
          integrity='sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T'
          crossOrigin='anonymous'
          async
          defer
        ></script>
      </Head>
      <nav className='navbar navbar-expand-sm navbar-light bg-light sticky-top'>
        <div className='container'>
          <Link href='/' className='navbar-brand'>
            Logo
          </Link>
          <button
            className='navbar-toggler'
            data-toggle='collapse'
            data-target='#navbarCollapse'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarCollapse'>
            <ul className='navbar-nav ml-auto'>
              <li className={isActive('/')}>
                <Link href='/' prefetch={false}>
                  <a className='nav-link'>Home</a>
                </Link>
              </li>

              {!isAuth() && (
                <>
                  <li className={isActive('/signup')}>
                    <Link href='/signup' prefetch={false}>
                      <a className='nav-link'>Signup</a>
                    </Link>
                  </li>
                  <li className={isActive('/signin')}>
                    <Link href='/signin' prefetch={false}>
                      <a className='nav-link'>Signin</a>
                    </Link>
                  </li>
                </>
              )}
              {isAuth() && (
                <>
                  <li className={isActive('/')}>
                    <Link href='/'>
                      <a className='nav-link'>{returnName(isAuth())}</a>
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <span
                      style={{ cursor: 'pointer' }}
                      className='nav-link'
                      onClick={() => {
                        signout(() => {
                          router.push('/');
                        });
                      }}
                    >
                      Signout
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}
