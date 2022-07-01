const container = document.querySelector(".container");
const loading = document.querySelector(".loading");
const userName = document.querySelector("#user-name");
const avatar = document.querySelector("#avatar");
const signOutBtn = document.querySelector("#signOut");
const tableBody = document.querySelector("#tableBody");
const table = document.querySelector("#table");
const pTableError = document.querySelector("#tableError");
const token = window.localStorage.getItem("token");
const numberArticle = document.querySelector("#numberArticle");
const numberTags = document.querySelector("#numberTags");

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

const getArticles = () => {
  axios({
    method: "get",
    url: "https://api.realworld.io/api/articles",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      table.classList.remove("d-none");
      const articlesArray = response.data.articles;
      readArticles(articlesArray);
    })
    .catch((error) => {
      pTableError.classList.remove("d-none");
    });
};

const tagsCount = () => {
  axios({
    method: "get",
    url: "https://api.realworld.io/api/tags",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      const tags = response.data.tags;
      numberTags.innerHTML = tags.length;
    })
    .catch(() => {
      numberTags.innerHTML = "error";
    });
};

const firstAction = () => {
  helloUser();
  getArticles();
  tagsCount();
};
firstAction();

const readArticles = (arr) => {
  numberArticle.innerHTML = arr.length;
  tableBody.innerHTML = "";
  arr.forEach((element) => {
    const trTag = document.createElement("tr");
    trTag.innerHTML = `
        
        <td>${element.title}</td>
        <td>${element.author.username}</td>
        <td>${element.description}</td>
        <td><span class="status pending">${element.tagList}</span></td>
        <td>${element.createdAt.split("T")[0]}</td>
        <td>
        <div class='box'>
        <select data-slug='${element.slug}'>
        
        <option value="edit">edit</option>
        <option value="del">delete</option>
      </select>
      </div>
      </td>
        
        `;
    tableBody.appendChild(trTag);
  });
};

const signOut = () => {
  window.localStorage.removeItem("token");
  setTimeout(() => {
    window.location.href = "http://localhost:5500/login.html";
  }, 1000);
};

signOutBtn.addEventListener("click", signOut);

const delArticle = (slug) => {
  console.log(slug);
  axios({
    method: "DELETE",
    url: "https://api.realworld.io/api/articles/" + slug,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    )
    .catch((error) => {
      console.log(error);
    });
};

table.addEventListener("click", (event) => {
  if (event.target.value === "del") {
    delArticle(event.target.dataset.slug);
  }
  if (event.target.value === "edit") {
    window.location.href =
      "http://localhost:5500/edit.html?" + event.target.dataset.slug;
  }
});
