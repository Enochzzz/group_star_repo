// 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
const vscode = acquireVsCodeApi();
let log = document.querySelector('#log');
let git_token = document.querySelector('#git_token');
let tokenstatus = document.querySelector('#tokenstatus');
let token_btn = document.querySelector('#token_btn');
let submit_btn = document.querySelector('#submit_btn');
let repoList = [];

function init() {
  getInitState();
  submitBtnStyle();
}

/**
 * 获取存储内容
 */
function getInitState() {
  vscode.postMessage({
    command: 'getStorage',
    content: {
      key: 'git_token_study_plan'
    }
  });
}

/**
 * 提交按钮初始化
 */
function submitBtnStyle() {
  // if (!git_token.value || !issue_number.value || !mdArea.value) {
  //   submit_btn.classList.add('disabled');
  // } else {
  //   submit_btn.classList.remove('disabled');
  // }
}