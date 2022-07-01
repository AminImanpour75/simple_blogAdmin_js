const form = document.querySelector("#form");
const email = form.querySelector("#email");
const username = form.querySelector("#username");
const password = form.querySelector("#password");
const confirmPassword = form.querySelector("#confirmPassword");
const btn = form.querySelector("#btn");
const pMessage = document.querySelector(".message");

const loginGuard = () => {
  const token = window.localStorage.getItem("token");
  if (typeof token === "string" && token) {
    pMessage.innerHTML = "you are logged in...";
    setTimeout(() => {
      window.location.href = "http://localhost:5500";
    }, 1000);
  }
};

loginGuard();

const registerUser = (email, username, password, confirmPassword) => {
  if (typeof email !== "string" || !email) {
    return;
  }
  if (typeof username !== "string" || !username) {
    return;
  }
  if (typeof password !== "string" || !password) {
    return;
  }
  if (typeof confirmPassword !== "string" || !confirmPassword) {
    return;
  }
  if (confirmPassword !== password) {
    pMessage.innerHTML = "password and confirm password is not equal";
    return;
  }
  pMessage.innerHTML = "please wait...";
  axios({
    method: "post",
    url: "https://api.realworld.io/api/users/",
    data: {
      user: {
        email,
        username,
        password,
      },
    },
  })
    .then((response) => {
      pMessage.innerHTML = "successfuly register";
      const token = response.data.user.token;
      window.localStorage.setItem("token", token);
      setTimeout(() => {
        window.location.href = "http://localhost:5500";
      }, 1000);
    })
    .catch((error) => {
      pMessage.innerHTML = "somthing is wrong please try again.";
    });
};

btn.addEventListener("click", () => {
  registerUser(
    email.value,
    username.value,
    password.value,
    confirmPassword.value
  );
});
