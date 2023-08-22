const puppeteer = require("puppeteer")

const startBrowser = async () => {
    let browser
    try {
        browser = await puppeteer.launch({
            // tắt ui của chormium hay không 
            headless: false,
            // chorme sử dụng multiple layer s của sandbox để chặn những web không đáng tin cậy ở đây mình tắt tính năng này
            args: ['--disable-setuid-sandbox'],
            //truy cập website bỏ qua các lỗi liên quan đến secure
            'ignoreHTTPSErrors': true
        })
    } catch (error) {
        console.log('khởi động trình duyệt thất bại ' + error)
    }
    return browser
}
module.exports = startBrowser