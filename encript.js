const fsPromise = require("fs/promises")
const cryptojs = require("crypto-js")
const arg = require("arg")
const prompts = require("prompts")

//arguments

const argumentsList = arg({
	"--encrypt": Boolean,
	"--decrypt": Boolean,
	"--input": String,
	"--output": String,
	"--pass": String,
	"-e": "--encrypt",
	"-d": "--decrypt",
	"-i": "--input",
	"-o": "--output"
})

//password
async function main() {
if(argumentsList["--pass"]){
	var password = argumentsList["--pass"]
} else {
	var password = await getUserPassword()
}

//modo de operação

if(argumentsList["--encrypt"]){
	encryptFile(argumentsList["--input"], password, argumentsList["--output"])
} else if(argumentsList["--decrypt"]){
	decryptFile(argumentsList["--input"], password, argumentsList["--output"])
}
}//main-end

main()

//Logica

async function encryptFile(fileName, password, fileNameEncrypt){
	const file = await fsPromise.readFile("test.txt", "utf-8")
	const encryptFile = cryptojs.AES.encrypt(file, password).toString()
	await fsPromise.writeFile(fileNameEncrypt, encryptFile)
	console.log("File encrypt: ${fileNameEncrypt} completo!")
}

async function decryptFile(fileNameEncrypt, password, fileName){
	const fileEncrypt = await fsPromise.readFile(fileNameEncrypt, "utf-8")
	const fileDecryptObj = cryptojs.AES.decrypt(fileEncrypt, password)
	const fileDecrypt = fileDecryptObj.toString(cryptojs.enc.Utf8)
	await fsPromise.writeFile(fileName, fileDecrypt)
	console.log("File descrypt: ${fileName} completo!")
}

async function getUserPassword(){
	const obj = {
		type: "text",
		message: "Password: ",
		name: "pass"
	}
	const passInput1 = await prompts(obj)
	const passInput2 = await prompts(obj)
	if(passInput1.pass == passInput2.pass){
		return passInput1.pass
	}else{
		console.log("ERROR: Password Invalid!")
		process.exit()
	}
}
