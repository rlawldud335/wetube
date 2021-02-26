import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const deleteBtns = document.getElementsByClassName("deleteCommentBtn");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const deleteComment = async (dbt) => {
  const response = await axios({
    url: `/api/${dbt.id}/comment/delete`,
    method: "POST",
  });
  if (response.status === 200) {
    dbt.closest(".comment-list__comment").remove();
    decreaseNumber();
  }
};

const addComment = (comment, data) => {
  const div = document.createElement("div");
  div.classList.add("comment-list__comment");
  div.innerHTML = `
      <span class="comment-creator">${data.creator}</span>
      <div class="comment-text">
        <span>${comment}</span>
        <div class="deleteCommentBtn" id="${data.id}">삭제</div>
      </div>
  `;
  commentList.prepend(div);
  const dbt = document.getElementById(data.id);
  dbt.addEventListener("click", () => {
    deleteComment(dbt);
  });
  increaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment/add`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addComment(comment, response.data);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  Array.prototype.forEach.call(deleteBtns, (dbt) => {
    dbt.addEventListener("click", () => deleteComment(dbt));
  });
}

if (addCommentForm) {
  init();
}
