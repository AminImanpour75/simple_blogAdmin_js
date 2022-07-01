const form = document.querySelector("#form");
const email = form.querySelector("#email");
const password = form.querySelector("#password");
const btn = form.querySelector("#btn");
const pMessage = document.querySelector(".message");

const loginGuard = () => {
  const token = localStorage.getItem("token");
  if (typeof token === "string" && token) {
    window.location.href = "http://localhost:5500";
  }
};
loginGuard();

const resetForm = () => {
  (email.value = ""), (password.value = "");
};

const userLogin = (email, password) => {
  if (typeof email !== "string" || !email) {
    return;
  }
  if (typeof password !== "string" || !password) {
    return;
  }

  pMessage.innerHTML = "please wait...";
  axios({
    method: "post",
    url: "https://api.realworld.io/api/users/login/",
    data: {
      user: {
        email,
        password,
      },
    },
  })
    .then((response) => {
      const token = response.data.user.token;
      pMessage.innerHTML = "successfuly login";
      window.localStorage.setItem("token", token);
      setTimeout(() => {
        window.location.href = "http://localhost:5500";
      }, 1000);
    })
    .catch((error) => {
      const response = error.response;
      if (response.status === 403) {
        pMessage.innerHTML = "Invalid User or Password!";
      }
      resetForm();
    });
};

btn.addEventListener("click", () => {
  userLogin(email.value, password.value);
});
