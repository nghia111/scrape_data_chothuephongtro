const scrapeCategoty = async (browser, url) => {
    try {
        let page = await browser.newPage()
        console.log(">> mở tab mới...")
        await page.goto(url)
        console.log(">> truy cập vào " + url)
        await page.waitForSelector('#webpage')
        console.log(">> website đã load xong...")

        const dataCategory = await page.$$eval('#navbar-menu > ul > li', (element) => {
            let data = element.map((ele) => {
                return {
                    category: ele.querySelector('a').innerText,
                    link: ele.querySelector('a').href
                }
            })
            return data
        })
        // console.log(dataCategory)
        await page.close()
        console.log('tab đã đóng')
        return dataCategory



    } catch (error) {
        console.log("lỗi ở scrape category " + error)
        return error
    }
}

const scraper = async (browser, url) => {
    try {
        let newPage = await browser.newPage()
        console.log(">> đã mở tab mới...")
        await newPage.goto(url)
        console.log(">> đã truy cập vào trang " + url)
        await newPage.waitForSelector('#main')
        console.log("đã load xong main...")

        const scrapeData = {}
        // lấy header
        const headerData = await newPage.$eval('header', (element) => {
            return {
                title: element.querySelector('h1').innerText,
                description: element.querySelector('p').innerText
            }
        })
        scrapeData.header = headerData
        // lấy link detail items
        const detailLink = await newPage.$$eval('#left-col > section.section-post-listing > ul > li', (elements) => {
            let data = elements.map(ele => {
                return ele.querySelector('.post-meta > h3 > a').href
            })
            return data
        })



        const scraperDetail = async (link) => {
            try {
                let pageDetail = await browser.newPage()
                await pageDetail.goto(link)
                console.log('>> truy cập ' + link)
                await pageDetail.waitForSelector('#main')

                // bắt đầu cào
                const detailData = {}
                //cào ảnh
                const images = await pageDetail.$$eval('#left-col > article >div.post-images > div > div.swiper-wrapper > div.swiper-slide', (elements) => {
                    const data = elements.map((el) => {
                        return el.querySelector('img')?.src
                    })
                    return data.filter(i => !i === false)
                })


                detailData.images = images

                //lấy header detail
                const header = await pageDetail.$eval('header.page-header', (element) => {
                    return {
                        title: element.querySelector('h1>a').innerText,
                        start: element.querySelector('h1>span')?.className?.replace(/^\D+/g, ''),
                        class: {
                            content: element.querySelector('p').innerText,
                            classType: element.querySelector('p>a>strong').innerText
                        },
                        address: element.querySelector('address').innerText,
                        attributes: {
                            price: element.querySelector('div.post-attributes > .price > span').innerText,
                            acreage: element.querySelector('div.post-attributes > .acreage > span').innerText,
                            published: element.querySelector('div.post-attributes > .published > span').innerText,
                            hashtag: element.querySelector('div.post-attributes > .hashtag > span').innerText
                        }

                    }
                })
                detailData.header = header

                //cào thông tin mô tả  

                const mainContentHeader = await pageDetail.$eval('#left-col > article.the-post > section.post-main-content', (element) => {
                    return {
                        header: element.querySelector('div.section-header > h2').innerText
                    }
                })
                const mainContentContent = await pageDetail.$$eval('#left-col > article.the-post > section.post-main-content > div.section-content > p', (elements) => {
                    return elements.map(el => {
                        return el.innerText
                    })
                })
                detailData.mainContent = {
                    header: mainContentHeader,
                    content: mainContentContent
                }
                // cào đặc điểm tin đăng
                const overviewHeader = await pageDetail.$eval('#left-col > article.the-post > section.post-overview', (element) => {
                    return {
                        header: element.querySelector('div.section-header > h3').innerText
                    }
                })
                const overviewContent = await pageDetail.$$eval('#left-col > article.the-post > section.post-overview > div.section-content > table.table > tbody> tr ', (elements) => {
                    return elements.map(el => {
                        return {
                            name: el.querySelector('td:first-child').innerText,
                            content: el.querySelector('td:last-child').innerText
                        }
                    })
                })
                detailData.overview = {
                    header: overviewHeader,
                    content: overviewContent
                }
                // cào thông tin liên hệ
                const contactHeader = await pageDetail.$eval('#left-col > article.the-post > section.post-contact', (element) => {
                    return {
                        header: element.querySelector('div.section-header > h3').innerText
                    }
                })
                const contactContent = await pageDetail.$$eval('#left-col > article.the-post > section.post-contact > div.section-content > table.table > tbody> tr ', (elements) => {
                    return elements.map(el => {
                        return {
                            name: el.querySelector('td:first-child').innerText,
                            content: el.querySelector('td:last-child').innerText
                        }
                    })
                })
                detailData.contact = {
                    header: contactHeader,
                    content: contactContent
                }

                await pageDetail.close()
                console.log('đã đóng tab ' + link)
                return detailData
            } catch (error) {
                console.log('Lấy data detail lỗi: ' + error)
            }

        }
        const details = []
        for (let link of detailLink) {
            const detail = await scraperDetail(link)
            details.push(detail)
        }
        scrapeData.body = details;


        return scrapeData

    } catch (error) {
        return error
    }
}



module.exports = { scrapeCategoty, scraper }