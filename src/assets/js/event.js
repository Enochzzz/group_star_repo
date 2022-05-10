/**
 * token输入框
 */
function tokenInput() {
  tokenBtnStyle();
  submitBtnStyle();
}

/**
 * token更新按钮
 * @returns
 */
function updateToken() {
  if (!git_token.value) {
    return;
  }
  vscode.postMessage({
    command: "setStorage",
    content: {
      key: "git_token_study_plan",
      value: git_token.value,
    },
  });
  vscode.postMessage({
    command: "initOct",
  });
  tokenstatus.innerHTML = "已配置";
}

/**
 * 提交
 * @returns
 */
function submit() {
  if (!git_token.value) {
    createLog(`请先配置git token！`);
    return;
  }
  if (!repoList.length) {
    createLog('请先选择文件');
    return;
  }
  vscode.postMessage({
    command: "submit",
    content: {
      repoList
    },
  });
}

/**
 * 消息处理
 * @param {*} event
 */
function messageHandle(event) {
  const message = event.data;
  switch (message.command) {
    case "get_issue_fail_webview":
      issue_title.innerHTML = message.content;
      issue_btn.classList.remove("display_none");
      break;
    case "today_issue_number_webview":
      issueNumberHandle(message);
      break;
    case "info_webview":
      createLog(`${message.content.text}！`, message.content.type || null);
      break;
    case "success_webview":
      submitBtnStyle();
      createLog(`${message.content}！`, "success");
      break;
    case "getStorage_webview":
      console.log(message.type, message.content, 111);
      getStorageHandle(message.type, message.content);
      break;
    default:
      break;
  }
}

/**
 * 处理storage
 * @param {*} type
 * @param {*} content
 */
function getStorageHandle(type, content) {
  console.log(type, content, 2222);
  switch (type) {
    case "git_token_study_plan":
      try {
        let token = content;
        git_token.value = token || "";
        tokenstatus.innerHTML = token
          ? "已配置"
          : "未配置（配置方法见下方提示）";
        !git_token.value
          ? createLog(`请先配置git token！`)
          : createLog(`初始化成功！`, 'success');
        
      } catch (error) {
        createLog(`获取本地存储token参数失败，请重新填写！`);
      }
      tokenBtnStyle();
      break;
    default:
      break;
  }
}

/**
 * 导入/解析 excel
 * @param {*} e 
 */
function importXlsx(e) {
  let files = e.files;
  for (let i = 0; i < files.length; i++) {
    let reader = new FileReader();
    let name = files[i].name;
    reader.onload = function (e) {
      let data = e.target.result;
      let workbook = XLSX.read(data, {
        type:
          typeof FileReader !== "undefined" &&
          (FileReader.prototype || {}).readAsBinaryString
            ? "binary"
            : "array",
      });
      let workbookSheets = workbook.Sheets;
      for (let sheet in workbookSheets) {
        if (workbookSheets.hasOwnProperty(sheet)) {
          fromTo = workbookSheets[sheet]["!ref"];
          let xlsxData = XLSX.utils.sheet_to_json(workbookSheets[sheet]);
          // 结果数组
          repoList = xlsxData;
        }
      }

      e.target.value = '';
    };
    reader.readAsBinaryString(files[i]);
  }
}
