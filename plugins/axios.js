export default (inter) => {
  // { $axios, $auth }
  // request
  // console.log(inter)
  inter.$axios.onRequest((req) => {
    const header = req.headers;
    header.authorization  = `Bearer ${get_cookie("accessToken")}`;
    req.headers = header;
  });

  // response
  inter.$axios.onResponse((res) => {
  });

  inter.$axios.onError((error) => {
    window._this.axiosAlertPopOpen(error.response.data);
    if(error.response?.status == 401){
      inter.$auth.logout().then((result) => {
        localStorage.clear()
        inter.redirect("/login");
      })
    }
    if (error.name === 'ExpiredAuthSessionError') {
      localStorage.clear()
      inter.redirect('/login');
    }
    if (error.response) {
      console.error(`${error.response}`);
    }
  });
};

const get_cookie = (name) => {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
}

// export default function ({ $axios }, inject) {
//   const searchAPI = $axios.create();
//   const tk = `Bearer ${get_cookie("accessToken")}`
//   searchAPI.setToken(tk, "Bearer"); 

//   inject("searchAPI", searchAPI);
  
//   const productAPI = $axios.create();

//   productAPI.setToken(tk, "Bearer"); 

//   inject("productAPI", productAPI);
// }

// const get_cookie = (name) => {
//   var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
//   return value? value[2] : null;
// }

