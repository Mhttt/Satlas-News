import router from 'next/router';

export default async function redirectUnauthorized(path: string) {
  if (path) {
    sessionStorage.setItem('redirectURL', path);
  }
  router.push('/login');
}
