import axios from "axios";

const config = {
  jiraServerUrl: process.env.JIRA_SERVER,
  userEmail: process.env.USER_EMAIL,
  userPassword: process.env.USER_PASSWORD,
  projectKey: process.env.PROJECT_KEY,
  projectId: process.env.PROJECT_ID,
  defaultTaskType: process.env.DEFAULT_TASK_TYPE,
};

const headers = {
  Authorization: `Basic ${Buffer.from(
    `${config.userEmail}:${config.userPassword}`
  ).toString("base64")}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function createIssue({ data }) {
  try {
    const response = await axios.post(
      `${config.jiraServerUrl}/rest/api/3/issue`,
      data,
      {
        headers: headers,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.error(JSON.stringify(e));
    console.error(e.response.status, e.response.statusText);
  }
}

function buildBody(options: Issue) {
  const { summary, description } = options;
  const issueType = options.issueType || config.defaultTaskType;
  const data = {
    fields: {
      project: {
        id: config.projectId,
        key: config.projectKey,
      },
      summary: summary,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "heading",
            attrs: {
              level: 3,
            },
            content: [
              {
                type: "text",
                text: "🚀 Description ",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: description,
              },
            ],
          },
        ],
      },
      issuetype: {
        id: issueType,
      },
    },
  };
  return data;
}

/**
 *
 * STORY= 10001
 * @export
 * @param {{
 *   summary: string;
 *   description: any;
 *   issueType?: number;
 * }}
 * @interface Issue
 */
export interface Issue {
  summary: string;
  description: any;
  issueType?: number;
}

export async function bulkCreateIssues(options: { list: Issue[] }) {
  console.info(config);
  const { list } = options;
  for (const issue of list) {
    const issueBody = buildBody(issue);
    await createIssue({ data: issueBody });
  }
}
