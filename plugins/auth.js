export default function ({ route, store, redirect }) {
  const token = get_cookie("accessToken");
  const whiteList = [
    '/login',
  ];

  if (!whiteList.includes(route.path)) {
    if (!token) {
      return redirect('/login')
    };
  } else if (token) {
    return redirect('/')
  };
}

const get_cookie = (name) => {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
}