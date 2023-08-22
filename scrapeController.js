const fs = require('fs')
const scrapers = require("./scraper")
const scrapeController = async (browserInstance) => {
    let url = "https://phongtro123.com/"
    try {
        let browser = await browserInstance
        //gọi hàm cào ở file scrape
        let categories = await scrapers.scrapeCategoty(browser, url)
        const selectedCategories = categories.filter((category, index) => {
            let i = 1;
            for (i; i < 5; i++) {
                if (index == i)
                    return true
            }
        })

        // // let result1 = await scrapers.scraper(browser, selectedCategories[0].link)
        // // fs.writeFile('chothuephongtro.json', JSON.stringify(result1), (error) => {
        // //     if (error)
        // //         console.log('lỗi ghi data vào file ' + error)
        // //     console.log('thêm data vào chothuephongtro thành công')
        // // })
        // let result2 = await scrapers.scraper(browser, selectedCategories[1].link)
        // fs.writeFile('nhachothue.json', JSON.stringify(result2), (error) => {
        //     if (error)
        //         console.log('lỗi ghi data vào file ' + error)
        //     console.log('thêm data vào nhachothue thành công')
        // })
        // let result3 = await scrapers.scraper(browser, selectedCategories[2].link)
        // fs.writeFile('chothuecanho.json', JSON.stringify(result3), (error) => {
        //     if (error)
        //         console.log('lỗi ghi data vào file ' + error)
        //     console.log('thêm data vào chothuecanho thành công')
        // })
        let result4 = await scrapers.scraper(browser, selectedCategories[3].link)
        fs.writeFile('chothuematbang.json', JSON.stringify(result4), (error) => {
            if (error)
                console.log('lỗi ghi data vào file ' + error)
            console.log('thêm data vào chothuematbang thành công')
        })




        await browser.close()
        console.log("trình duyệt đã đóng")
    } catch (error) {
        console.log("lỗi ở scrape controller: " + error)
    }
}
module.exports = scrapeController