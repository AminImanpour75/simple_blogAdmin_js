const token = window.localStorage.getItem("token");
const container = document.querySelector(".container");
const loading = document.querySelector(".loading");
const userName = document.querySelector("#user-name");
const avatar = document.querySelector("#avatar");
const signOutBtn = document.querySelector("#signOut");
const tags = document.querySelector("#tags");
const btn = document.querySelector("#btn");
const articleTitle = document.querySelector("#title");
const articleDescription = document.querySelector("#description");
const articleBody = document.querySelector("#body");
const createTagBtn = document.querySelector("#createTagBtn");
const createTagInput = document.querySelector("#createTags");

const helloUser = () => {
  container.classList.add("d-none");
  loading.classList.remove("d-none");

  axios({
    method: "get",
    url: "https://api.realworld.io/api/user/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      container.classList.remove("d-none");
      loading.classList.add("d-none");
      const data = response.data.user;
      userName.innerHTML = `Hello ${data.username}`;
      if (data.image) {
        avatar.src = data.imgage;
      }
    })
    .catch((error) => {
      loading.querySelector("p").innerHTML = "ERROR";
      window.location.href = "http://localhost:5500/login.html";
    });
};

const getTags = () => {
  axios({
    method: "get",
    url: "https://api.realworld.io/api/tags",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      const tagsList = response.data.tags;
      for (let i in tagsList) {
        const divTag = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");
        divTag.classList.add("tagRow");
        input.classList.add("checkBox");
        input.id = `${tagsList[i]}`;
        input.type = "checkbox";
        label.for = `${tagsList[i]}`;
        label.innerHTML = tagsList[i];
        divTag.appendChild(label);
        divTag.appendChild(input);
        tags.appendChild(divTag);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const firstAction = () => {
  helloUser();
  getTags();
};
firstAction();

const createArticle = () => {
  if (!articleBody) {
    return;
  }
  if (!articleTitle) {
    return;
  }
  if (!articleDescription) {
    return;
  }
  const tagsList = checkedTags();

  axios({
    method: "post",
    url: "https://api.realworld.io/api/articles",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      article: {
        body: articleBody.value,
        description: articleDescription.value,
        title: articleTitle.value,
        tagList: tagsList,
      },
    },
  })
    .then((response) => {
      resetForm();
      setTimeout(() => {
        window.location.href = "http://localhost:5500/";
      }, 1000);
    })
    .catch((error) => {
      console.log(error);
    });
};

const resetForm = () => {
  articleBody.value = "";
  articleDescription.value = "";
  articleTitle.value = "";
};

const createTag = () => {
  if (!createTagInput.value) {
    return;
  }
  const divTag = document.createElement("div");
  const input = document.createElement("input");
  const label = document.createElement("label");
  divTag.classList.add("tagRow");
  input.classList.add("checkBox");
  input.id = createTagInput.value;
  input.type = "checkbox";
  input.checked = true;
  label.for = createTagInput.value;
  label.innerHTML = createTagInput.value;
  divTag.appendChild(label);
  divTag.appendChild(input);
  tags.appendChild(divTag);
  createTagInput.value = "";
};

createTagBtn.addEventListener("click", createTag);

const checkedTags = () => {
  let checkedTagsList = [];
  const checked = tags.querySelectorAll(".checkBox");
  checked.forEach((element) => {
    if (element.checked) {
      checkedTagsList.push(element.id);
    }
  });
  return checkedTagsList;
};

const signOut = () => {
  window.localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = "http://localhost:5500/login.html";
  }, 1000);
};

btn.addEventListener("click", createArticle);

signOutBtn.addEventListener("click", signOut);
