const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawn

/**
 * Runs `npm install` in the project directory
 * @param {string} cwd Path of the created project directory
 * @param {object} data Data from questionnaire
 */
exports.installDependencies = function installDependencies(
  cwd,
  executable = 'npm',
  color
) {
  console.log(`\n\n# ${color('Installing project dependencies ...')}`)
  console.log('# ========================\n')
  return runCommand(executable, ['install'], cwd)
}

/**
 * Prints the final message with instructions of necessary next steps.
 * @param {Object} data Data from questionnaire.
 */
exports.printMessage = function printMessage(data, { green, yellow }) {
  const message = `
# ${green('Project initialization finished!')}
`
  console.log(message)
}

/**
 * Spawns a child process and runs the specified command
 * By default, runs in the CWD and inherits stdio
 * Options are the same as node's child_process.spawn
 * @param {string} cmd
 * @param {array<string>} args
 * @param {object} options
 */
function runCommand(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const spwan = spawn(
      cmd,
      args,
      {
        cwd: cwd,
        stdio: 'inherit',
        shell: true,
      }
    )
    spwan.on('exit', () => {
      resolve()
    })
  })
}
