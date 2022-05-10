import { POST_STAR_URL, OK_STATUS } from '../common/constants';
import Vaildate from './vaildate';
let cansubmit: boolean = true;

/**
 * 提交
 * @param octokit 
 * @param content 
 * @param postMes 
 * @returns 
 */
export async function submit(octokit: any, content: any, postMes: Function) {
  postMes('info_webview', { text: '操作中....', type: 'info' });
  if (!cansubmit) {
    return;
  }
  cansubmit = false;
  const infoList = handleRepoList(content.repoList);
  infoList.forEach(async(i: any) => {
    await handleStarRepo(i, octokit, postMes);
  });
  cansubmit = true;
}

export function handleRepoList(repoList: any) {
  const infoList = repoList.map((i: any) => {
    const { owner, repo } = getRepoInfo(i['链接']);
    return { owner, repo };
  });
  return infoList;
}

function getRepoInfo(url: string) {
  const result:any = url.match(/.*\/(\S*)\/(\S*)/);
  return {
    owner: result[1] || '',
    repo: result[2] || ''
  };
}

async function handleStarRepo(info: any, octokit: any, postMes: Function) {
  const { owner, repo } = info;
  try {
    let res = await octokit.request(POST_STAR_URL, {
      owner,
      repo
    });
    console.log(res, 777777777);
    const validate = new Vaildate;
    validate.addRule({
      rule: res.status === OK_STATUS,
      handle: () => {
        postMes('info_webview', { text: '${owner}的repo star失败', type: 'err' });
      }
    });
    if(!validate.check()) {
      return false;
    }
    postMes('success_webview', `${owner}的repo star成功！`);
    return true;
  } catch (error: any) {
    postMes('info_webview', { text: `${error.message}, ${owner}的repo star失败`, type: 'err' });
    return false;
  }
}