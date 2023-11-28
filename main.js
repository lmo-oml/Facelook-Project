let baseUrl = "https://tarmeezacademy.com/api/v1";
let token;
let user;
let currentPage = 0;
let lastPage;
let postContainer = document.createElement("div");
let idPostForAddComment;
let updatePostId;
let deletePostId;
let scrollValueAfterUpdate;
let scrollValue = 0;
let returnScrollValue = 0;
let scrollStatus = true;


// get user info if he is login
if (localStorage.getItem("token") != null && localStorage.getItem("user") != null) {
  console.log("global: " + true);
  user = localStorage.getItem("user");
  token = localStorage.getItem("token");

};


// pagination
window.addEventListener("scroll", () => {

  let clientHeight = document.documentElement.clientHeight;
  let scrollHeight = document.documentElement.scrollHeight;
  scrollValue = window.scrollY;
  // nextPage = true;

  if (scrollValue + clientHeight === scrollHeight && scrollStatus === true) {

    if (!(returnScrollValue + clientHeight >= scrollHeight)) {


      getPostsPages();


    };
  };

});


getPostsFunc();
showNameAndImgFunc();
btnHidden();


// get pages of posts
function getPostsPages() {

  axios.get(`${baseUrl}/posts`).then(myResponse => {

    let myMeta = myResponse["data"]["meta"];
    lastPage = myMeta["last_page"]

    if (currentPage <= lastPage) {

      getPostsFunc();

    };

  });

};

// get posts
function getPostsFunc() {

  currentPage++;

  document.querySelector(".posts").style.display = "block";
  document.querySelector("nav").classList.remove("full-screen");
  fetch(`${baseUrl}/posts?limit=10&page=${currentPage}`)
    .then(response => response.json())
    .then(data => {

      let posts = data["data"];
      console.log("the posts: ", posts);
      for (let i = 0; i < posts.length; i++) {

        let btns = "";
        let userImg = posts[i]["author"]["profile_image"];
        if (typeof userImg != "object") {

          userImg = posts[i]["author"]["profile_image"];

        } else {

          userImg = "./imgs/185816.png";

        };
        let postTitle = posts[i]["title"];
        if (postTitle != null) {

          postTitle = posts[i]["title"];

        } else {

          postTitle = "";

        };
        let postBody = posts[i]["body"];
        if (postBody != null) {

          postBody = posts[i]["body"];

        } else {

          postBody = "";

        };
        if (posts[i]["author"]["id"] == JSON.parse(localStorage.getItem("user"))["id"]) {

          btns = `
          <button id="editPost" onclick="updatePost(${posts[i]["id"]})" data-bs-toggle="modal" data-bs-target="#creatPostModal" data-bs-whatever="@mdo">edit</button>
          <button id="deletePost" onclick="deletePost(${posts[i]["id"]})" data-bs-toggle="modal" data-bs-target="#staticBackdrop">delete</button>
          `;

        }
        let content = `
        <div class="card shadow p-3 mb-5 bg-body-tertiary rounded">
          <div class="card-header">
              <figure>
                <img src="${userImg}" alt="user-image">
              </figure>
              <span>${posts[i]["author"]["username"]}</span>
            <div class="btnContainer">
            ${btns}
            </div>
          </div>
          <div class="card-body" onclick="viewPostFunc(${posts[i]["id"]})">
            <figure>
              <img src="${posts[i]["image"]}" alt="img-post">
            </figure>
            <span>${posts[i]["created_at"]}</span>
            <h5 class="card-title">${postTitle}</h5>
            <p class="card-text">${postBody}</p>
            <hr>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right-dots-fill" viewBox="0 0 16 16">
            <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg><a href="#" class="post-comments" style="margin-left: 5px;">(${posts[i]["comments_count"]}) Comments</a>
            <span class="tags-of-post" id="post-tags-${posts[i]["id"]}"></span>
            </div>
        </div>`;
        document.querySelector(".posts").innerHTML += content;
        if (posts[i]["tags"].length > 0) {

          for (let j = 0; j < posts[i]["tags"].length; j++) {

            let tagsContent = `<span>${posts[i]["tags"][j]["name"]}</span>`;
            document.getElementById(`post-tags-${posts[i]["id"]}`).innerHTML += tagsContent;

          };
          document.querySelectorAll(".tags-of-post span").forEach(e => {

            e.classList = "tag";

          });
        };
      };
      window.scrollTo({

        top: scrollValueAfterUpdate,
        behavior: "smooth",

      });
    });
};

// edit post event click
function updatePost(postId) {

  document.querySelector("#createPostModalLabel").textContent = "Update Post";
  document.querySelector("#createPostBtn").textContent = "Update";
  console.log(postId);

  const url = `${baseUrl}/posts/${postId}`;
  const headers = {

    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`

  };
  axios.get(url, {

    headers: headers

  }).then(res => {

    console.log(res["data"]["data"]);
    let title = res["data"]["data"]["title"];
    let content = res["data"]["data"]["body"];
    let image = res["data"]["data"]["image"];
    document.querySelector("#newPostTitle").value = title;
    document.querySelector("#newPostContent").value = content;
    updatePostId = postId;
    document.querySelector("#newPostImg").files[0] = image;
    scrollValueAfterUpdate = scrollValue;

  }).catch(err => {
    console.log(err);
  })


}


// hide btn function
function btnHidden() {

  if (localStorage.getItem("token") != null && localStorage.getItem("token") != "undefined" && localStorage.getItem("user") != null && localStorage.getItem("user") != "undefined") {

    document.querySelector(".the-login-btn").style.display = "none";
    document.querySelector("#user-singin-btn").style.display = "none";
    document.querySelector(".user-info").style.display = "flex";
    document.querySelector("#loguot-btn").style.display = "inline-block";
    document.querySelector(".nav .nav-item:nth-child(1)").style.display = "flex";
    document.querySelector(".nav .nav-item:nth-child(2)").style.display = "flex";
    document.querySelector(".create-post-btn").style.display = "block";
    document.querySelector("nav").style.justifyContent = "space-between";
    document.querySelector("nav>div:first-child").style.justifyContent = "space-between";
    document.querySelector("nav div:first-child>.logo").style.fontSize = "2rem";
    getPostsPages();


  } else {

    document.querySelector(".the-login-btn").style.display = "inline-block";
    document.querySelector("#user-singin-btn").style.display = "inline-block";
    document.querySelector(".user-info").style.display = "none";
    document.querySelector("#loguot-btn").style.display = "none";
    document.querySelector(".posts").style.display = "none";
    document.querySelector(".posts").innerHTML = "";
    document.querySelector("nav").classList.add("full-screen");
    document.querySelector(".nav .nav-item:nth-child(1)").style.display = "none";
    document.querySelector(".nav .nav-item:nth-child(2)").style.display = "none";
    document.querySelector(".create-post-btn").style.display = "none";
    document.querySelector("nav").style.justifyContent = "space-evenly";
    document.querySelector("nav>div:first-child").style.justifyContent = "space-evenly";
    document.querySelector("nav div:first-child>.logo").style.fontSize = "4rem";

  };
};


// logout btn event
document.querySelector("#loguot-btn").addEventListener("click", () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  btnHidden();

});


// login btn event 
document.getElementById("user-login").addEventListener("click", () => {

  fetch(`${baseUrl}/login`,
    {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        "username": `${document.querySelector(".username").value}`,
        "password": `${document.querySelector(".user-password").value}`
      })
    }
  ).then((res) => res.json())
    .then(data => {

      token = data["token"];
      console.log(token);
      console.log(data);
      user = data["user"];
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      const modal = document.querySelector("#login") // close modal
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide();
      btnHidden();
      const theName = JSON.parse(localStorage.getItem("user"))["username"];
      const theImg = JSON.parse(localStorage.getItem("user"))["profile_image"];
      showNameAndImgFunc(theName, theImg)

    }).catch(error => {
      console.log(error["message"]);
    })
});

// singin btn event
document.getElementById("user-singin").addEventListener("click", () => {

  const name = document.querySelector("#newName").value;
  const userName = document.querySelector("#userName").value;
  const password = document.querySelector("#singinPassword").value;
  const email = document.querySelector("#singinEmail").value;
  const image = document.querySelector("#singinImg").files[0];

  let formData = new FormData()
  formData.append("name", name);
  formData.append("username", userName);
  formData.append("password", password);
  formData.append("email", email);
  formData.append("image", image);
  const url = `${baseUrl}/register`;
  const headers = {

    'Content-Type': 'multipart/form-data',

  };
  axios.post(url, formData, {

    headers: headers

  }).then(response => {

    console.log(response);
    token = response["data"]["token"];
    user = response["data"]["user"];
    console.log(token);
    console.log(user);
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    const modal = document.querySelector("#singinModal") // close modal
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide();
    btnHidden();
    const theName = JSON.parse(localStorage.getItem("user"))["username"];
    const theImg = JSON.parse(localStorage.getItem("user"))["profile_image"];
    showNameAndImgFunc(theName, theImg)

  }).catch(error => {
    console.log(error);
  })
})


// show userName and userImg in nav bar
function showNameAndImgFunc(userName, userImg) {

  if (localStorage.getItem("user") != null) {

    userName = JSON.parse(localStorage.getItem("user"))["username"];
    if (typeof JSON.parse(localStorage.getItem("user"))["profile_image"] != "object") {

      theImg = JSON.parse(localStorage.getItem("user"))["profile_image"];

    }
  }
  let image = `<img src="${userImg}" alt="">`;
  document.querySelector(".user-info > .user-image").innerHTML = image;
  document.querySelector(".user-info > .user-username").innerHTML = userName;

}


// create a new post
document.getElementById("createPostBtn").addEventListener("click", () => {

  const title = document.querySelector("#newPostTitle").value;
  const content = document.querySelector("#newPostContent").value;
  const image = document.querySelector("#newPostImg").files[0];
  const token = localStorage.getItem("token")

  let formData = new FormData()
  formData.append("title", title);
  formData.append("body", content);
  formData.append("image", image);
  const url = `${baseUrl}/posts`;
  const headers = {

    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`

  };
  if (document.getElementById("createPostBtn").innerHTML === "Create") {

    axios.post(url, formData, {

      headers: headers

    }).then(() => {

      location.reload();

    }).catch(error => {

      console.log(error["data"]["message"]);

    });
  };
  if (document.getElementById("createPostBtn").innerHTML === "Update") {

    formData.append("_method", "put")
    axios.post(`${url}/${updatePostId}`, formData, {

      headers: headers

    }).then(() => {

      const modal = document.querySelector("#creatPostModal") // close modal
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide();
      location.reload();

    }).catch(error => {

      console.log(error);

    });
  };
});


// view the post 
function viewPostFunc(postId) {

  scrollStatus = false;
  returnScrollValue = scrollValue;
  idPostForAddComment = postId;
  document.querySelector("#postsContainer").style.display = "none";
  document.querySelector(".create-post-btn").style.display = "none";
  axios.get(`${baseUrl}/posts/${postId}`).then(response => {

    post = response["data"]["data"]
    let userImg = post["author"]["profile_image"];
    if (typeof userImg != "object") {

      userImg = post["author"]["profile_image"];

    } else {

      userImg = "./imgs/185816.png";

    };
    let postTitle = post["title"];
    if (postTitle != null) {

      postTitle = post["title"];

    } else {

      postTitle = "";

    };
    let postBody = post["body"];
    if (postBody != null) {

      postBody = post["body"];

    } else {

      postBody = "";

    };
    let content = `
    <div class="row justify-content-center parent">
        <div class="col-9" id="postsContainer">
          <div class="container">
            <div class="card shadow p-3 mb-5 bg-body-tertiary rounded" id="showPost">
              <div class="card-header">
            <figure class="userImgeHolder">
              <img src="${userImg}" alt="user-image" style="width:100%">
            </figure>
            <span>${post["author"]["username"]}</span>
          </div>
          <div class="card-body">
            <figure>
              <img src="${post["image"]}" alt="img-post"style="width:100%">
            </figure>
            <span>${post["created_at"]}</span>
            <h5 class="card-title">${postTitle}</h5>
            <p class="card-text">${postBody}</p>
            <hr>
              <div class="commentsContainer"></div>
            </div>
          </div>
          </div>
        </div>
    </div>
  `;
    postContainer.innerHTML = content;
    document.querySelector(".parent").appendChild(postContainer)
    if (post["comments"].length > 0) {

      for (comment of post["comments"]) {

        let commentUserImg = comment["author"]["profile_image"];
        if (typeof commentUserImg != "object") {

          commentUserImg = comment["author"]["profile_image"];

        } else {

          commentUserImg = "./imgs/185816.png";

        };

        let commentContainer = `
          <div class="commentContainer">
            <div>
              <span class="userImgSpan">
                <img src="${commentUserImg}" alt="user-image">
              </span>
              <span class="userNameSpan">${comment["author"]["username"]}</span>
            </div>
            <p>${comment["body"]}</p>
          </div>
        `;
        // commentsContainer= commentContainer

        document.querySelector(".commentsContainer").innerHTML += commentContainer;
      };
    };
    let createCommentContent = `
    <div class="createCommentContainer">
      <input type="text" placeholder="Add Comment ....">
      <button id="createCommentBtn">Add</button>
    </div>
    `;
    document.querySelector(".commentsContainer").innerHTML += createCommentContent;

  });
};


// click on home link
document.querySelector("#homePage").onclick = function () {

  scrollStatus = true;
  scrollValue = 0;
  postContainer.innerHTML = "";
  document.querySelector("#postsContainer").style.display = "block";
  // document.querySelector(".create-post-btn").style.display = "block";
  // if ()
  window.scrollTo({
    top: returnScrollValue,
    behavior: "smooth",
  });

};


// create new comment
document.addEventListener("click", (ele) => {

  if (ele.target.getAttribute("id") == "createCommentBtn") {

    let myComment = document.querySelector(".createCommentContainer>input").value;
    if (myComment != "") {

      let token = localStorage.getItem("token");
      let theHeader = {

        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`

      };
      let theBody = {

        "body": `${myComment}`

      };
      axios.post(`${baseUrl}/posts/${idPostForAddComment}/comments`, theBody, {

        headers: theHeader

      }).then(response => {

        viewPostFunc(idPostForAddComment);

      }).catch(error => {

        console.log(Error(`${error}`));

      })

    };

  };

});


// delete post btn event
document.addEventListener("click", (ele) => {

  if (ele.target.getAttribute("id") === "dalatePostBtn") {

    let token = localStorage.getItem("token");
    let theHeader = {

      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`

    };
    axios.delete(`${baseUrl}/posts/${deletePostId}`, {

      headers: theHeader

    }).then(res => {

      const modal = document.querySelector("#staticBackdrop") // close modal
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide();
      location.reload();

    }).catch(err => {
      console.log(err);
    });
  };
});


// delete post function
function deletePost(postId) {

  deletePostId = postId;

};


// profile event 
document.addEventListener("click", ele => {

  if (ele.target.getAttribute("id") === "profile") {

    scrollStatus = false;
    document.querySelector("#postsContainer").style.display = "none";
    // document.querySelector(".create-post-btn").style.display = "none";
    axios.get(`${baseUrl}/users/${JSON.parse(localStorage.getItem("user"))["id"]}`)
      .then(res => {

        let image = res["data"]["data"]["profile_image"];
        if (typeof image == "object") {
          image = "./imgs/185816.png";
        }
        let name = res["data"]["data"]["name"];
        let userName = res["data"]["data"]["username"];
        let postCounts = res["data"]["data"]["posts_count"];
        let commentsCounts = res["data"]["data"]["comments_count"];
        let content = `
        <div class="profileContainer shadow">
          <div class="profileUserImgContainer">
            <img src="${image}" alt="">
          </div>
          <div class="profileUserNamesContainer">
            <span>User Name: ${userName}</span>
            <span>Name: ${name}</span>
          </div>
          <div class="profileUserPostInfoContainer">
            <span>Posts: ${postCounts}</span>
            <span>Comments: ${commentsCounts}</span>
          </div>
        </div>
        `;
        // document.querySelector(".posts").innerHTML = content;
        postContainer.innerHTML = content;

      }).catch(err => {

        console.log(err);

      })
    document.querySelector(".parent").appendChild(postContainer)
  };
});