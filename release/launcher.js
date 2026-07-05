const { spawn, exec } = require('child_process')
const http = require('http')
const path = require('path')

const PORT = 3000
const URL = `http://localhost:${PORT}`

const server = spawn('node', [path.join(__dirname, 'server.js')], {
  stdio: 'inherit',
  env: { ...process.env, PORT: String(PORT) }
})

function check(retries = 40) {
  http.get(URL, () => {
    console.log('\n  =============================')
    console.log('   墨韵诗境 · AI中国古诗词生成器')
    console.log('  =============================')
    console.log(`\n  浏览器访问: ${URL}\n`)
    openBrowser(URL)
  }).on('error', () => {
    if (retries > 0) {
      setTimeout(() => check(retries - 1), 500)
    } else {
      console.log(`服务器已启动，请手动访问: ${URL}`)
    }
  })
}

function openBrowser(url) {
  exec(`start "" "${url}"`, () => {})
}

check()

process.on('SIGINT', () => { server.kill(); process.exit() })
