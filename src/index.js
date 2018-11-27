const {Command, flags} = require('@oclif/command')
const fs = require('fs-extra')
const walk = require('klaw-sync')
const pug = require('pug')
const dedent = require('dedent')

class PugToHtmlCommand extends Command {
  async run() {
    const {args} = this.parse(PugToHtmlCommand)

    const cwd = args.path || process.cwd()
    const files = walk(cwd, {
      nodir: true,
    })
    let oldLength = 0
    let newLength = 0
    let filesCount = 0
    for (const file of files) {
      if (file.path.toLowerCase().endsWith('.pug')) {
        try {
          const fileContents = await fs.readFile(file.path, 'utf-8')
          const newFileContents = pug.render(fileContents, {pretty: '  '})
          await fs.writeFile(file.path, newFileContents)
          await fs.rename(file.path, file.path.substr(0, file.path.length - 4) + '.html')
        } catch (error) {
          this.error(`ERROR while processing ${file.path}`)
          throw error
        }
      }
      if (file.path.toLowerCase().endsWith('.vue')) {
        try {
          const fileContents = await fs.readFile(file.path, 'utf-8')
          const newFileContents = fileContents.replace(/<template lang=['"]pug["']>\n+([\s\S]*)<\/template>/i, (substr, match) => {
            if (match.startsWith(' ')) {
              match = dedent(match)
            }
            match = match.trim()
            let html = pug.render(match, {pretty: '  '})
            html = html.replace(/&amp;/g, '&')
            // &quot; is ", but it appears only inside attributes - and html attributes already use " for enclosing
            html = html.replace(/&quot;/g, "'")
            html = html.replace(/&gt;/g, '>')
            html = html.replace(/&lt;/g, '<')
            html = html.replace(/v-else="v-else"/g, 'v-else')
            return `<template>
${html}
</template>`
          })
          await fs.writeFile(file.path, newFileContents)
          filesCount++
          oldLength += fileContents.length
          newLength += newFileContents.length
        } catch (error) {
          this.error(`ERROR while processing ${file.path}`)
          throw error
        }
      }
    }
    this.log(`Processed ${filesCount} files. Old length: ${oldLength}, new length: ${newLength}`)
  }
}

PugToHtmlCommand.description = `Converts your pug code to html code.
This tool will recursively scan provided path, and replace pug code with html code.

- For *.pug files, it will replace entire file contents and rename it to *.html
- For *.vue files, it will find <template lang="pug"> sections and replace their contents with HTML
`

PugToHtmlCommand.flags = {
  version: flags.version({char: 'v'}),
  help: flags.help({char: 'h'}),
}

PugToHtmlCommand.args = [
  {name: 'path', description: 'Path to the directory where with vue files. Defaults to current working directory'},
]

module.exports = PugToHtmlCommand
