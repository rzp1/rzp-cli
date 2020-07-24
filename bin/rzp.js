#!/usr/bin/env node

const semver = require('semver')
const chalk = require('chalk')

const requiredVersion = require('../package.json').engines.node
// const leven = require('leven')

function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'rzp-cli')

// const fs = require('fs')
// const path = require('path')
// const slash = require('slash')
const minimist = require('minimist')

// enter debug mode when creating test repo
// if (
//   slash(process.cwd()).indexOf('/packages/test') > 0 && (
//     fs.existsSync(path.resolve(process.cwd(), '../@vue')) ||
//     fs.existsSync(path.resolve(process.cwd(), '../../@vue'))
//   )
// ) {
//   process.env.VUE_CLI_DEBUG = true
// }

const program = require('commander')
// const loadCommand = require('../lib/util/loadCommand')
// console.log('process.argv',process.argv)

program
  .version(`rzp-cli ${require('../package').version}`)
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('create a new project powered by rzp-cli-service')
  .alias('i')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    // minimist 命令行解析参数
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    // --git makes commander to default git to true
    if (process.argv.includes('-g') || process.argv.includes('--git')) {
      options.forceGit = true
    }
    require('../lib/create')(name, options)
  })



program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv)



// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
