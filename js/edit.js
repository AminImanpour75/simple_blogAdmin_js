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
const slug = window.location.search.substring(1, window.location.search.length);

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

const getArticle = () => {
  axios({
    method: "get",
    url: "https://api.realworld.io/api/articles/" + slug,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      const article = response.data.article;
      articleTitle.value = article.title;
      articleDescription.value = article.description;
      articleBody.value = article.body;
      getTags(article.tagList);
    })
    .catch((error) => {
      console.log(error);
    });
};

const firstAction = () => {
  helloUser();
  getArticle();
};
firstAction();

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

const getTags = (arr) => {
  for (let i in arr) {
    const divTag = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    divTag.classList.add("tagRow");

    input.classList.add("checkBox");
    input.id = `${arr[i]}`;
    input.type = "checkbox";
    input.checked = true;
    label.for = `${arr[i]}`;
    label.innerHTML = arr[i];
    divTag.appendChild(label);
    divTag.appendChild(input);
    tags.appendChild(divTag);
  }
};

const resetForm = () => {
  articleBody.value = "";
  articleDescription.value = "";
  articleTitle.value = "";
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
const editArticle = () => {
  const tagsList = checkedTags();
  axios({
    method: "put",
    url: "https://api.realworld.io/api/articles/" + slug,
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
    .then(() => {
      setTimeout(() => {
        window.location.href = "http://localhost:5500";
      }, 1000);
    })
    .catch((error) => {
      console.log(error);
    });
};

btn.addEventListener("click", editArticle);

const signOut = () => {
  window.localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = "http://localhost:5500/login.html";
  }, 1000);
};
signOutBtn.addEventListener("click", signOut);
