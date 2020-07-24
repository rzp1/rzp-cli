const path = require("path");
const fs = require("fs");
const os = require("os");

const ora = require("ora");
const chalk = require("chalk");
const inquirer = require("inquirer");
const download = require("download-git-repo");
const Metalsmith = require("metalsmith");
const Handlebars = require("handlebars");

const filterFiles = require("./filter");

const { installDependencies, runLintFix, printMessage } = require("../utils");

const filters = {
  ".eslintrc.js": "lint && author === 'rzp'"
};

module.exports = async (projectName, options) => {
  let questions = [
    {
      type: "input",
      name: "author"
    },
    {
      type: "confirm",
      message: "你想要lint吗?",
      name: "lint"
    },
    {
      type: "checkbox",
      name: "MTh5",
      message: "请勾选您所需要的颜色",
      choices: [
        {
          name: "yellow"
        },
        new inquirer.Separator(),
        {
          name: "blue",
          checked: true // 默认选中
        },
        new inquirer.Separator("--- 分隔符 ---") // 自定义分隔符
      ]
    },
    {
      type: "confirm",
      message: "你想要水果吗?",
      name: "wantFruit",
      prefix: "前缀"
    },
    {
      type: "list",
      when: answers => answers.wantFruit,
      message: "请选择一种水果:",
      name: "fruit",
      choices: [
        {
          name: "苹果",
          value: "apple"
        },
        {
          name: "菠萝",
          value: "pear"
        },
        {
          name: "香蕉",
          value: "banner"
        }
      ],
      filter: function(val) {
        // 使用filter将回答变为小写
        return val.toLowerCase();
      }
    },
    {
      type: "list",
      message: "怎么自动安装依赖",
      name: "autoInstall",
      choices: [
        {
          name: "npm",
          value: "npm"
        },
        {
          name: "yarn",
          value: "yarn"
        }
      ]
    }
  ];
  inquirer.prompt(questions).then(answers => {
    console.log(`answers`, answers);
    let spinner = ora("Loading unicorns").start();
    let cwd = path.join(process.cwd(), projectName);
    // os.tmpdir() 存进缓存
    download(
      "rzp1/rzp-cli-template",
      path.join(os.tmpdir(), "rzp-cli-presets", projectName),
      { clone: false },
      err => {
        spinner.stop();
        if (err) {
          console.log(`${chalk.cyan(err)}`);
          return;
        }
        console.log(`${chalk.blue(`Download completed`)}`);
        Handlebars.registerHelper("if_eq", (v1, v2, options) => {
          if (v1 === v2) {
            return options.fn(this);
          }
          return options.inverse(this);
        });

        Metalsmith(path.join(os.tmpdir(), "rzp-cli-presets", projectName))
          .metadata(answers) //metadata 为用户输入的内容
          .clean(false)
          .source("./") //模板文件 path
          .destination(cwd) //最终编译好的文件存放位置
          .use(filterFiles(filters, answers))
          .use((files, metalsmith, done) => {
            Object.keys(files).forEach(fileName => {
              //遍历替换模板
              const fileContentsString = files[fileName].contents.toString(); //Handlebar compile 前需要转换为字符串
              files[fileName].contents = new Buffer(
                Handlebars.compile(fileContentsString)(metalsmith.metadata())
              );
            });
            done();
          })
          .build(err => {
            // build
            if (err) {
              console.log(chalk.red(`Metalsmith build error: ${err}`));
            } else {
              console.log(chalk.blue(`成功`));
              const green = chalk.green;

              installDependencies(cwd, answers.autoInstall, green)
                .then(() => {
                  printMessage(answers, chalk);
                })
                .catch(e => {
                  console.log(chalk.red("Error:"), e);
                });
            }
          });
      }
    );
  });
};
