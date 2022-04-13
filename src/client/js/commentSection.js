const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const delBtn = document.querySelectorAll(".delBtn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.classList.add("deleteBtn");
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
  span2.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const delComment = (event) => {
    const commentList = document.querySelector(".video__comments ul");
    const delTarget = event.target.parentNode;
    commentList.removeChild(delTarget);
};

const handleDelete = async (event) => {
    const delTarget = event.target.parentNode;
    const commentId = delTarget.dataset.id;
    const videoId = videoContainer.dataset.id
    const response = await fetch(`/api/comments/${commentId}/delete`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            videoId,
            commentId,
        })
    });
    if(response.status === 200){
        delComment(event);
    }
    if(response.status === 403){
        alert("Not Authorized User!");
    }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
};

for(let cnt = 0; cnt < delBtn.length; cnt++){
    delBtn[cnt].addEventListener("click", handleDelete);
};