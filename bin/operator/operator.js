#!/usr/bin/env node
const walk = require('klaw-sync');
const path = require('path');
const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const commands = walk(`${__dirname}/`, {
    nodir: true,
    filter: item => path.basename(item.path) === 'index.js'
}).map(item => path.dirname(item.path.replace(`${__dirname}/`, '')).replace(/\//g, '.')).concat('exit');

(async () => {
    while(true) {
        let answers = await inquirer.prompt([
            {
                name: 'command', 
                message: '输入命令:', 
                type:'autocomplete', 
                source: async (answersSoFar, input) => {
                    if (input === null) {
                        return commands;
                    }
                    return commands.filter(command => command.startsWith(input));
                }
            }
        ]);
        if (answers.command === 'exit') {
            break;
        }
        try {
            await require(`./${answers.command.replace(/\./g, '/')}`)();
            console.log("执行成功");
        }
        catch(err) {
            console.error("执行失败, 原因:" + err.stack);
        }
    }
})();
