const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version


module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },
  
  prompts: {
    author: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: '你的名字',
    },
    MTh5: {
      type: 'checkbox',
      message: '请勾选您所需要的颜色',
      choices: [
        {
          name: "yellow",
        },
        {
          name: "blue",
          checked: true // 默认选中
        }
      ],
    },
    wantFruit: {
      type: 'confirm',
      message: '是否启用 水果改变控件？',
    },
    fruit: {
      when: 'wantFruit',
      type: 'list',
      message: '请选择水果',
      choices: [
        {
          name: '苹果',
          value: 'apple'
        },
        {
          name: '菠萝',
          value: 'pear'
        },
        {
          name: '香蕉',
          value: 'banner'
        }
      ],
    },
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm',
        },
        {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        },
      ],
    },
  },
  filters: {
    '.eslintrc.js': 'lint'
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
