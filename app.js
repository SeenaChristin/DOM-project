const OWNER = "SeenaChristin";
const REPO = "DOM-project";
const TOKEN =
  "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";
let ISSUE_NUMBER = 0;
async function getIssues() {
  let response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/issues`
  );
  let data = await response.json();
  data.map((issue) => {
    createDom(issue.title, issue.body, issue.number);
  });
}

async function createIssue(event) {
  const parent = event.target.parentElement;
  const input = parent.getElementsByClassName("new-todo");
  let issue = { title: input[0].value, body: input[1].value };
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    }
  );
  let data = await response.json();
  if (data.title == input[0].value) {
    createDom(data.title, data.body, data.number);
  }
  input[0].value = "";
  input[1].value = "";
}

async function updateIssue(updatedIssue, updatedDesc, ISSUE_NUMBER) {
  let issue = { title: updatedIssue, body: updatedDesc };
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    }
  );
  let data = await response.json();
  return data.title;
}

async function deleteIssue(ISSUE_NUMBER) {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: "closed" }),
    }
  );

  let data = await response.json();
  console.log(data);
  return data.title;
}

function createDom(name, description, issue_number) {
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
}

function openTextBox(event) {
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
    checkKey(event);
  } else if (event.target.innerText == "X") {
    close(event);
  }
}

async function checkKey(event) {
  event.target.innerText = "Update";
  let el = event.target;
  let div = event.target.parentElement;
  let arr = div.getElementsByClassName("update-todo");
  let name = arr[0].value;
  let desc = arr[1].value;
  let result = await updateIssue(name, desc, div.parentElement.id);
  if (result == name) {
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
  let result = await deleteIssue(id);
  if (result) {
    el.remove();
  }
}
