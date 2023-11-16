const OWNER = "SeenaChristin";
const REPO = "DOM-project";
const TOKEN =
  "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";
let ISSUE_NUMBER = 0;
let HEADER = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const gitIssues = {
  getResponse: async (url, fetchMethod, issueBody) => {
    if (fetchMethod == "GET") {
      const response = await fetch(url, {
        method: fetchMethod,
        headers: HEADER,
      });
      let data = await response.json();
      return data;
    } else {
      const response = await fetch(url, {
        method: fetchMethod,
        headers: HEADER,
        body: JSON.stringify(issueBody),
      });
      let data = await response.json();
      return data;
    }
  },

  getIssues: async () => {
    let url = `https://api.github.com/repos/${OWNER}/${REPO}/issues`;
    let data = await gitIssues.getResponse(url, "GET", {});
    renderIssues(data);
  },

  createIssue: async (issueBody) => {
    let url = `https://api.github.com/repos/${OWNER}/${REPO}/issues`;
    let data = await gitIssues.getResponse(url, "POST", issueBody);
    return data;
  },
  updateIssue: async (issueBody, ISSUE_NUMBER) => {
    let url = `https://api.github.com/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}`;
    let data = await gitIssues.getResponse(url, "POST", issueBody);
    return data;
  },
  closeIssue: async (issueBody, ISSUE_NUMBER) => {
    let url = `https://api.github.com/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}`;
    let data = await gitIssues.getResponse(url, "POST", issueBody);
    console.log(data);
    return data;
  },
};

function renderIssues(data) {
  data.map((issue) => {
    createDom(issue.title, issue.body, issue.number, false);
  });
}
async function onClickCreate(event) {
  const parent = event.target.parentElement;
  const input = parent.getElementsByClassName("new-todo");
  let issue = { title: input[0].value, body: input[1].value };
  let data = await gitIssues.createIssue(issue);
  let newIssue = true;
  if (data.title == input[0].value) {
    createDom(data.title, data.body, data.number, newIssue);
  }
  input[0].value = "";
  input[1].value = "";
}

function clickUpdate(event) {
  if (event.target.innerText == "Update") {
    event.target.innerText = "Done";
    let div = event.target.parentElement;
    let label1 = div.querySelector("label.name span");
    let text1 = label1.innerText;
    let input1 = document.createElement("input");
    input1.className = "update-todo";
    input1.value = text1;
    div.appendChild(input1);
    label1.className = "hide";
    let label2 = div.querySelector("label.desc span");
    let text2 = label2.innerText;
    let input2 = document.createElement("input");
    input2.className = "update-todo";
    input2.value = text2;
    div.appendChild(input2);
    label2.className = "hide";
  } else if (event.target.innerText == "Done") {
    clickDone(event);
  } else if (event.target.innerText == "X") {
    close(event);
  }
}

async function clickDone(event) {
  event.target.innerText = "Update";
  let el = event.target;
  let div = event.target.parentElement;
  let arr = div.getElementsByClassName("update-todo");
  let name = arr[0].value;
  let desc = arr[1].value;
  let issue = { title: name, body: desc };
  let result = await gitIssues.updateIssue(issue, div.parentElement.id);
  if (result.title == name) {
    let label1 = div.querySelector("label.name span");
    label1.innerText = name;
    let label2 = div.querySelector("label.desc span");
    label2.innerText = desc;
    label1.classList.remove("hide");
    label2.classList.remove("hide");
    let boxes = div.querySelectorAll(".update-todo");
    boxes.forEach((box) => {
      box.remove();
    });
    div.getElementsByClassName("update")[0].disabled = false;
  }
}

async function close(event) {
  let el = event.target.parentElement.parentElement;
  let id = el.id;
  let result = await gitIssues.closeIssue({ state: "closed" }, id);
  if (result) {
    el.remove();
  }
}

function createDom(name, description, issue_number, newIssue) {
  var li = document.createElement("li");
  li.id = issue_number;
  var div = document.createElement("div");
  div.class = "view";
  var label1 = document.createElement("label");
  label1.innerText = "Name:  ";
  label1.className = "name";
  var label2 = document.createElement("label");
  label2.innerText = "Description:  ";
  label2.className = "desc";
  var span1 = document.createElement("span");
  span1.innerText = name;
  var span2 = document.createElement("span");
  span2.innerText = description;
  var button = document.createElement("button");
  button.className = "destroy";
  button.innerText = "X";
  var update = document.createElement("button");
  update.className = "update";
  update.innerText = "Update";
  label1.appendChild(span1);
  label2.appendChild(span2);
  div.appendChild(label1);
  div.appendChild(label2);
  div.appendChild(button);
  div.appendChild(update);
  li.appendChild(div);
  document.getElementsByClassName("todo-list")[0].appendChild(li);
  if (newIssue) {
    let message = document.getElementById("message");
    message.innerText = "New Issue Created Successfully";
    message.remove("hide");
    setTimeout(() => {
      let message = document.getElementById("message");
      message.className = "hide";
    }, 2000);
  }
}
gitIssues.getIssues();
