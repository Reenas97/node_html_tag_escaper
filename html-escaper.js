const fs = require('node:fs') //pegar os dados do arquivo
const path = require('node:path')//lidar com caminhos de forma mais segura
const readLine = require('node:readline')//perguntar ao usuario pelo terminal


function escapeHtmlSpecialCharacters(text){
              //o replace permite pesquisar dentro da string
                          //se quiser escrever um & tambem precisa escapar ele
    return text.replace(/[<>&\s]/g, (match) =>{
        switch(match){
            case "<":
                return "&lt;"
            case ">":
                return "&gt;"
            case "&":
                return "&amp;"
            case " ":
                return "&nbsp;";
            case "\t":
                return "&emsp;";
            case "\n":
                return "<br>";
            default:
                return match
        }
    })

}

//interagir com o usuário
function escapeHtmlFile(inputFilePath, outputFilePath){
    try {
        const fileContent = fs.readFileSync(inputFilePath, 'utf-8')
        const escapedContent = escapeHtmlSpecialCharacters(fileContent)
        fs.writeFileSync(outputFilePath, escapedContent, 'utf-8')
        console.log(`Arquivo escapado com sucesso: ${outputFilePath}`)
    } catch (error) {
        console.log('Erro', error.message)
        process.exit(1)
    }
}

//pegar o caminho do arquivo
function askFilePath(question){
    const rl = readLine.createInterface({input: process.stdin, output: process.stdout})
    
    return new Promise((resolve) =>{
        rl.question(question, (answer) =>{
            resolve(answer)
            rl.close()
        })
    })
}

//tratar interação com o usuário
async function userInteraction(){
    //node html-escaper.js inputPath outputPath
    let inputPath = process.argv[2]//se o usuario quiser executar direto pela linha de comando
    if(!inputPath){
        inputPath = await askFilePath('Informe o caminho do arquivo de entrada:')
    }
    inputPath = path.resolve(inputPath)//resolve para caminho absoluto

    const defaultName = `escaped_${path.basename(inputPath)}.txt`//caso o usuario não defina um nome para o arquivo de saida
    const answer = await askFilePath(`Informe o caminho do arquivo de saída (padrão: ${defaultName}):`)

    let outputPath = answer.length > 0 ? answer : defaultName

    outputPath = path.resolve(outputPath)

    escapeHtmlFile(inputPath, outputPath)

}

//tratar a interação com o usuario
function run(){
    if(process.argv.length >= 4){
        escapeHtmlFile(path.resolve(process.argv[2]), path.resolve(process.argv[3]))
    } else{
        console.log(`-------------------`)
        console.log(`HTML Tag Escaper v1.0`)
        console.log(`-------------------\n`)
        console.log(`Argumentos não informados! Por favor, informe os caminhos dos arquivos para realizar o escape`)
        userInteraction()
    }
}

//executar o codigo
run()